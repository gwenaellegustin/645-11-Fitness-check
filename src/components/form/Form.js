import {createContext, useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query, addDoc, Timestamp} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db} from "../../config/initFirebase";
import {documentUser} from "../App";

export const FormContext = createContext();

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    //Categories
    useEffect(() => {
        async function getCategories(){
            //Get all categories from database
            let categoriesCollection = await getDocs(query(collection(db, "categories")));
            //Fill categories with objects containing all data from Firestore object + id
            let categoriesArray = categoriesCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setCategories(categoriesArray);
        }
        getCategories();
    }, [])

    //Questions
    useEffect(() => {
        async function getQuestions(){
            //Get all questions from database
            let questionsCollection = await getDocs(query(collection(db, "questions")));
            //Fill questions with objects containing all data from Firestore object + id
            let questionsArray = questionsCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setQuestions(questionsArray);
        }
        getQuestions();
    }, [])

    let formCompleted = {
        dateTime: null,
        answeredQuestions : []
    }

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
        const answeredQuestionAlreadyExist = formCompleted.answeredQuestions.find(answeredQuestion => answeredQuestion.question.id === questionId);

        if(answeredQuestionAlreadyExist){
            formCompleted.answeredQuestions.forEach(answeredQuestion => {
                if(answeredQuestion.question.id === questionId){
                    //If 'radio', only 1 response need to be saved
                    if(target.type === 'radio'){
                        answeredQuestion.answers = [answerDoc.ref];
                    } else {
                        //If 'checkbox'
                        //If checked, add the answer to saved ones
                        if(target.checked){
                            answeredQuestion.answers.push(answerDoc.ref);
                        } else { //Otherwise, remove the answer from saved ones
                            answeredQuestion.answers = answeredQuestion.answers.filter(answer => answer.id !== answerId)
                        }
                    }
                }}
            )
        } else {
            //Otherwise, create the answeredQuestion object
            formCompleted.answeredQuestions.push({
                question: questionDoc.ref,
                answers: [answerDoc.ref]
            })
        }
    }

    const handleFormSubmit = e => {
        e.preventDefault(); //TODO: Needed?

        //Set the date and time when submitting the form
        formCompleted.dateTime = Timestamp.fromDate(new Date());

        async function addCompletedFormToFirestore(){
            return await addDoc(collection(documentUser.ref, "completedForms"), formCompleted);
        }

        addCompletedFormToFirestore().then(completedFormRef => {
            if(completedFormRef != null){
                console.log("ADD COMPLETED FORM SUCCESSFUL, id : " + completedFormRef.id);
            }
        });
    }

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <FormContext.Provider value={handleFormInputChange}>
            <form onSubmit={handleFormSubmit}>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)}/>
                ))}
                <input type="submit" />
            </form>
        </FormContext.Provider>
    )
}
