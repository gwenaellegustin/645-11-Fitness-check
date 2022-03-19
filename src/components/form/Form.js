import {useEffect, useState} from "react";
import {collection, getDocs, query} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db, getCategories, setCategories} from "../../config/initFirebase";

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));
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

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            {categories.map(category => (
                <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)}/>
            ))}
        </>
    )
}
