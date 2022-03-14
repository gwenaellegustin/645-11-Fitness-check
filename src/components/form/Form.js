import {useEffect, useState} from "react";
import {collection, getDoc, getDocs, query, where} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db} from "../../config/initFirebase";

export function Form(){
    const [categories, setCategories] = useState([]);
    const [otherQuestions, setOtherQuestions] = useState([]);

    //Categories
    const getCategories = async () => {
        return await getDocs(query(collection(db, "categories")))
    }

    const getQuestions = async () => {
        return await getDocs(query(collection(db, "questions")));
    };

    useEffect(() => {
        getCategories().then(response => {
            setCategories(response.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })))
        })
    }, [])

    useEffect(() => {
        getQuestions().then(response => {
            setOtherQuestions(response.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
                answer0: doc.data().arrayanswers ? doc.data().arrayanswers[4].point : null
            })))
        })
    }, [])

    return (
        <>
            {categories.map(category => (
                <CategoryContainer key={category.id} category={category} allQuestions={otherQuestions}/>
            ))}
            {/*
            <ul>
                {questions.map(question => (
                    <li>{question.label}</li>
                ))}
            </ul>
            */}
        </>

    )
}
