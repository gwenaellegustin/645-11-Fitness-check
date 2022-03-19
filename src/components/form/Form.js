import {createContext, useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query, addDoc} from "firebase/firestore";
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
            let questionsCollection = await getDocs(query(collection(db, "questionsTest")));
            //Fill questions with objects containing all data from Firestore object + id
            let questionsArray = questionsCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setQuestions(questionsArray);
            console.log(questionsArray)
        }

        getQuestions();
    }, [])

    let formCompleted = {
        dateTime: null,
        answeredQuestions : []
    }

    let answeredQuestion = {
        question: "QUESTIONID",
        answers: ["REF"]
    }

    const handleFormInputChange = async e => {
        const target = e.target;
        const questionId = target.name;
        const answerId = target.value;

        const answeredQuestionAlreadyExist = formCompleted.answeredQuestions.find(answeredQuestion => answeredQuestion.question === questionId);

        if(answeredQuestionAlreadyExist){
            formCompleted.answeredQuestions.map(answeredQuestion => {
                if(answeredQuestion.question === questionId){
                    if(target.checked){
                        answeredQuestion.answers.push(answerId);
                    } else {
                        answeredQuestion.answers = answeredQuestion.answers.filter(answer => answer !== answerId)
                    }
                }}
            )
        } else {
            formCompleted.answeredQuestions.push({
                question: questionId,
                answers: [answerId]
            })
        }

        console.log(formCompleted)
    }

    const handleFormSubmit = async e => {
        e.preventDefault(); //TODO: Needed?

        //let questionDoc = await getDoc(query(doc(db, "questionsTest", questionId)));
        //let answerDoc = await getDoc(query(doc(questionDoc.ref, "answersTest", answerId)));

        const form = modifyFormBeforeSubmit();

        addDoc(collection(documentUser.ref, "completedForms"), form);

        console.log(formCompleted);


    }

    function modifyFormBeforeSubmit(){
        formCompleted.dateTime = new Date().getTime();

        formCompleted.answeredQuestions.map(answeredQuestion => {
                console.log(answeredQuestion)
                getDoc(query(doc(db, "questionsTest", answeredQuestion.question))).then(r => {
                    console.log(r.ref)
                    answeredQuestion.question = r.ref;

                    answeredQuestion.answers.map(answer => {
                        console.log(answer)
                        getDoc(query(doc(r.ref, "answersTest", answer))).then(res => {
                            console.log(res.ref)
                            return formCompleted;
                        })
                    })
                });
            }
        )
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
