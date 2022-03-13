import {useEffect, useState} from "react";
import {collection, getDoc, getDocs, query} from "firebase/firestore";
import {db} from "../../config/initFirebase";

export function CategoryContainer({category}){
    let [questions, setQuestions] = useState([]);

    const getQuestions = async () => {
        return await getDocs(query(collection(db, "questions")))
    }

    useEffect(() => {
        let newQuestions = [];
        getQuestions().then(response => {
            response.forEach(doc => {
                let newQuestion = doc.data();
                newQuestion.id = doc.id;
                if(newQuestion.category){
                    getDoc(newQuestion.category).then(response => {
                        newQuestion.categoryRef = response.data();
                    })
                    .catch(err => console.error(err));
                }
                newQuestions.push(newQuestion);
            })
        })
        .catch(err => { console.error(err) });

        setQuestions(newQuestions);
    }, [])

    const questionsByCategory = () => {
        /*
        setQuestions(questions.filter(question => ({
            console.log(question)
        })))
         */
        questions.map(question => (
            console.log(question)
        ))
    }

    questionsByCategory();

    return (
        <div>
            {category.label}
            {/*Render list of questionContainer for each question*/}
            {/*
            {questions.map((question, index) =>
                (
                    <QuestionContainer key={index} question={question}/>
                )
            )}
            */}
        </div>

    )
}
