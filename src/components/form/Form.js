import {createContext, useEffect, useState} from "react";
import {collection, doc, getDoc, query, addDoc, Timestamp} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {
    db,
    getCategories,
    getForm,
    getQuestionsWithIds
} from "../../config/initFirebase";
import {documentUser} from "../App";
import {FormError} from "./FormError";
import {useNavigate} from "react-router-dom";

export const FormContext = createContext();

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isValidForm, setIsValidForm] = useState(true);
    const [completedForm] = useState({dateTime: null, answeredQuestions : []})
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    //Categories
    useEffect(() => {
        getCategories().then(r => {
            setCategories(r)
        });
    }, [])

    //Questions from Form collection
    useEffect(() => {
        let questionsIds = [];
        getForm().then(form => {
            form.questions.forEach(questionDoc => {
                questionsIds.push(questionDoc.id)
            })

            getQuestionsWithIds(questionsIds).then(r => {
                setQuestions(r);
            })
        })
    }, [])

    useEffect(() => {
        if(questions.length > 0 && categories.length > 0){
            setIsLoading(false);
        }
    }, [questions, categories])

    //TODO: TO DELETE, just to represent the objet inside the array above "answeredQuestions"
    let answeredQuestion = {
        question: "QUESTIONID",
        answers: ["REF"]
    }
    
    useEffect(() => {
        completedForm.pointsByCategory = [];
        categories.forEach(category => {
            completedForm.pointsByCategory.push({
                category: category.categoryRef,
                categoryLabel: category.label,
                points: 0
            })
        })
    }, [categories])

    const handleFormInputChange = async e => {
        const target = e.target;
        const questionId = target.name;
        const answerId = target.value;

        //Found the document in order to persist the reference
        const questionDoc = await getDoc(query(doc(db, "questions", questionId)));
        const answerDoc = await getDoc(query(doc(questionDoc.ref, "answers", answerId)));

        //Check if the answeredQuestion object exist in the array, otherwise, create it
        const answeredQuestionAlreadyExist = completedForm.answeredQuestions.find(answeredQuestion => answeredQuestion.question.id === questionId);

        const answerPoint = answerDoc.data().point;
        const categoryId = questionDoc.data().category.id;

        if(answeredQuestionAlreadyExist){
            completedForm.answeredQuestions.forEach((answeredQuestion, index) => {
                if(answeredQuestion.question.id === questionId){
                    //If 'radio', only 1 response and 1 point need to be saved
                    if(target.type === 'radio'){
                        answeredQuestion.answers = [answerDoc.ref];
                        answeredQuestion.points = answerPoint;
                    } else {
                        //If 'checkbox'
                        //If checked, add the answer to saved ones and add points
                        if(target.checked){
                            answeredQuestion.answers.push(answerDoc.ref);
                            answeredQuestion.points += answerPoint;
                        } else { //Otherwise, remove the answer from saved ones and remove point
                            answeredQuestion.answers = answeredQuestion.answers.filter(answer => answer.id !== answerId);
                            answeredQuestion.points -= answerPoint;

                            //If the answered question doesn't have any checked answer, remove it
                            if(answeredQuestion.answers.length === 0){
                                completedForm.answeredQuestions.splice(index, 1);
                            }


                        }
                    }
                }}
            )
        } else {
            //Otherwise, create the answeredQuestion object
            completedForm.answeredQuestions.push({
                question: questionDoc.ref,
                answers: [answerDoc.ref],
                points: answerPoint,
                category: categoryId
            })
        }
    }

    const handleFormSubmit = e => {
        e.preventDefault(); //TODO: Needed?

        //Check all questions have been answered
        if(questions.length === completedForm.answeredQuestions.length){
            setIsValidForm(true);

            //Set pointsByCategory
            //Add points from each question to the correct category
            completedForm.answeredQuestions.forEach(answeredQuestion => {
                completedForm.pointsByCategory.forEach(objectCategory => {
                    if(answeredQuestion.category === objectCategory.category.id){
                        objectCategory.points += answeredQuestion.points;
                        return;
                    }
                })
            })

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
                    navigate("/history", {state: {formDate: formDate}})
                }
            });
        } else {
            //All answers aren't completed
            setIsValidForm(false);
        }
    }

    if(isLoading){
        return <div>Loading ...</div>
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
