import {createContext, useEffect, useState} from "react";
import {collection, doc, getDoc, query, addDoc, Timestamp} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db, getCategories, getQuestions} from "../../config/initFirebase";
import {documentUser} from "../App";
import {FormError} from "./FormError";
import {useNavigate} from "react-router-dom";

export const FormContext = createContext();

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isValidForm, setIsValidForm] = useState(true);
    const [completedForm] = useState({dateTime: null, answeredQuestions : []})

    const navigate = useNavigate();

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));
    }, [])

    //Questions
    useEffect(() => {


        getQuestions().then(r => setQuestions(r));
    }, [])



    //TODO: TO DELETE, just to represent the objet inside the array above "answeredQuestions"
    let answeredQuestion = {
        question: "QUESTIONID",
        answers: ["REF"]
    }

    const handleFormInputChange = async e => {
        const target = e.target;
        const questionId = target.name;
        const answerId = target.value;

        //Found the document in order to persist the reference
        let questionDoc = await getDoc(query(doc(db, "questions", questionId)));
        let answerDoc = await getDoc(query(doc(questionDoc.ref, "answers", answerId)));

        //Check if the answeredQuestion object exist in the array, otherwise, create it
        const answeredQuestionAlreadyExist = completedForm.answeredQuestions.find(answeredQuestion => answeredQuestion.question.id === questionId);

        if(answeredQuestionAlreadyExist){
            completedForm.answeredQuestions.forEach((answeredQuestion, index) => {
                if(answeredQuestion.question.id === questionId){
                    //If 'radio', only 1 response need to be saved
                    if(target.type === 'radio'){
                        console.log("Add radio answer")
                        answeredQuestion.answers = [answerDoc.ref];
                    } else {
                        //If 'checkbox'
                        //If checked, add the answer to saved ones
                        if(target.checked){
                            answeredQuestion.answers.push(answerDoc.ref);
                        } else { //Otherwise, remove the answer from saved ones
                            answeredQuestion.answers = answeredQuestion.answers.filter(answer => answer.id !== answerId);
                            if(answeredQuestion.answers.length === 0){
                                console.log("delete answered question")
                                completedForm.answeredQuestions.splice(index, 1);
                            }
                        }
                    }
                }}
            )
        } else {
            console.log("Add radio answer")
            //Otherwise, create the answeredQuestion object
            completedForm.answeredQuestions.push({
                question: questionDoc.ref,
                answers: [answerDoc.ref]
            })
        }
    }

    const handleFormSubmit = e => {
        e.preventDefault(); //TODO: Needed?

        console.log("Questions")
        console.log(questions);


        //Check all questions have been answered
        if(questions.length === completedForm.answeredQuestions.length){
            setIsValidForm(true);

            console.log("All questions have been answered");
            //Set the date and time when submitting the form
            const formDate = new Date();
            completedForm.dateTime = Timestamp.fromDate(formDate);

            async function addCompletedFormToFirestore(){
                return await addDoc(collection(documentUser.ref, "completedForms"), completedForm);
            }

            addCompletedFormToFirestore().then(completedFormRef => {
                if(completedFormRef != null){
                    console.log("ADD COMPLETED FORM SUCCESSFUL, id : " + completedFormRef.id);
                    console.log(completedForm.dateTime)
                    navigate("/user", {state: {formDate: formDate}})
                }
            });
        } else {
            setIsValidForm(false);
            console.log("Answered questions");
            console.log(completedForm.answeredQuestions)
        }
    }

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <FormContext.Provider value={handleFormInputChange}>

            <form onSubmit={handleFormSubmit}>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)} isDisplayMode={false}/>
                ))}
                <FormError isValidForm={isValidForm}/>
                <button type="submit">Submit</button>
            </form>
        </FormContext.Provider>
    )
}
