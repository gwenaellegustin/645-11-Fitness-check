import {useEffect, useState} from "react";
import {collection, getDocs, query} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db} from "../../config/initFirebase";

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    //Categories
    const getCategories = async () => {
        return await getDocs(query(collection(db, "categories")))
    }

    useEffect(() => {
        getCategories().then(response => {
            //Fill categories with objects containing all data from Firestore object + id
            setCategories(response.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })))
        })
    }, [])

    //Questions
    const getQuestions = async () => {
        return await getDocs(query(collection(db, "questions")));
    };

    useEffect(() => {
        getQuestions().then(response => {
            //Fill questions with objects containing all data from Firestore object + id
            setQuestions(response.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                answer0: doc.data().arrayanswers ? doc.data().arrayanswers[4].point : null //TODO: just to test
            })))
        })
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
