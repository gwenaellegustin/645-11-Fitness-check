import {useEffect, useState} from "react";
import {collection, getDocs, query} from "firebase/firestore";
import {db} from "../../config/initFirebase";
import {CategoryContainer} from "../form/CategoryContainer";
import {FormContext} from "../form/Form";

export function FormCompleted({completedForm}){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

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


    // Answered questions
    useEffect(() => {
        async function getQuestionsOfFrom(){
            //Get all questions from database
            let questionsCollection = await getDocs(query(collection(db, "questions")));
            //Fill questions with objects containing all data from Firestore object + id
            let answeredQuestionsArray = completedForm.answeredQuestions.map(answeredQuestions)
            setAnsweredQuestions(answeredQuestionsArray);
            console.log(answeredQuestionsArray)
        }
        getQuestionsOfFrom();
    }, [])


    return (
            <form>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={answeredQuestions.filter(question => question.category.id === category.id)}/>
                ))}
                <input type="submit" />
            </form>

    )

}