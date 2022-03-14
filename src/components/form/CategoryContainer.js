import {QuestionContainer} from "./QuestionContainer";
import {collection, getDoc, getDocs, query, where} from "firebase/firestore";
import {db} from "../../config/initFirebase";
import {useEffect, useState} from "react";

export function CategoryContainer({category, allQuestions}){
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        let questionsByCategory = allQuestions.filter(question => question.category.id === category.id);
        setQuestions(questionsByCategory)
        console.log(allQuestions)
    }, [allQuestions])

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
            <ul>
                {category.label}
                {questions.map(question => (
                    <li key={question.id}>{question.label}</li>
                ))}
            </ul>
            {/*
{category.label}

            */}
        </div>

    )
}
