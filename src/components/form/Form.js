import {QuestionContainer} from "./QuestionContainer";
import {useEffect, useState} from "react";

export function Form(){
    let [questions, setQuestions] = useState([]);

    useEffect(() => {
        //Get questions from firestore
        setQuestions(getQuestionsFromFirestore())
    }, [])

    let getQuestionsFromFirestore = () => {
        //TODO: For the moment, only 1 question
        return ([{
            category: "Marcher sans aides",
            label: "Quels dispositifs d'aide à la marche utilisez vous ?",
            uniqueAnswer: true,
            answers: [{
                label: "Aucune",
                point: 5
            }, {
                label: "Une canne",
                point: 4
            }, {
                label: "Deux cannes",
                point: 3
            }, {
                label: "Déambulateur",
                point: 2
            }, {
                label: "Cadre de marche",
                point: 2
            }, {
                label: "J'ai besoin de l'aide d'une tierce personne",
                point: 1
            }]
        }, {
            category: "Marcher sans aides",
            label: "Quels dispositifs d'aide à la marche utilisez vous ?",
            uniqueAnswer: true,
            answers: [{
                label: "Aucune",
                point: 5
            }, {
                label: "Une canne",
                point: 4
            }, {
                label: "Deux cannes",
                point: 3
            }, {
                label: "Déambulateur",
                point: 2
            }, {
                label: "Cadre de marche",
                point: 2
            }, {
                label: "J'ai besoin de l'aide d'une tierce personne",
                point: 1
            }]
        }])
    }

    return (
        <>
            {/*Render list of questionContainer for each question*/}
            {questions.map((question, index) =>
                (
                <QuestionContainer key={index} question={question}/>
                )
            )}
        </>

    )
}
