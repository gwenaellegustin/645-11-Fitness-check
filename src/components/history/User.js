import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db, getCompletedForm} from "../../config/initFirebase";
import {FormCompleted} from "./FormCompleted";
import {Answer} from "./QuestionWithAnswers";

// WE WILL USE THIS ONE
export function User(){
    const [completedForm, setCompletedForm] = useState({})

    // CompletedForm
    useEffect(() => {
        getDoc((doc(db, "users", auth.currentUser.uid)))
            .then(r => getCompletedForm(r).then(w => {
                setCompletedForm(w);
            }));
    }, [])

    useEffect(() => {
        console.log("Form to display")
        console.log(completedForm)
    }, [completedForm])


    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h2>Test on connected user {auth.currentUser.uid}</h2>
            <h2>ALL ANSWERS</h2>
            {completedForm.answeredQuestions && completedForm.answeredQuestions.map(answeredQuestion => (
                answeredQuestion.answers.map(answer => (
                    <Answer key={answer.id} answerpath={answer.path}/>
                ))
            ))}
            <h2>COMPLETED FORM</h2>
            {<FormCompleted key={completedForm.id} completedForm={completedForm}/>}
        </>
    )
}
