import {QuestionContainer} from "./QuestionContainer";
import {collection, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../../config/initFirebase";
import {useEffect, useState} from "react";

export function CategoryContainer({category, questions}){

    useEffect(() => {
        console.log(category);
        console.log(questions.filter(question => question.category.id === category.id))
    })

    //Questions
    /*
    const getQuestions = async () => {
        await getDocs(query(collection(db, "questions"), where("category", "==", category.id)));
        /*
        await questionsSnapshot.docs.forEach(doc => {
            let newQuestion = doc.data();
            newQuestion.id = doc.id;
            getDoc(newQuestion)
            getCategory(newQuestion).then(r => {
                setQuestions([r]);
            })
        })
    };

    const getCategory = async (question) => {
        await getDoc(question.category).then(doc => {
            question.categoryRef = doc.data();
            question.categoryRef.id = doc.id;
            return question;
        })
    }
    */

    return (
        <div>
            {/*category.label + ' ' + category.id}
            {questions.map(question => (
                <QuestionContainer key={question.id} question={question}/>
            ))*/}
        </div>

    )
}
