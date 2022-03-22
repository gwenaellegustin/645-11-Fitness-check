import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db, getAnswer, getCompletedFormByDate} from "../../config/initFirebase";
import {FormCompleted} from "./FormCompleted";
import {useLocation} from "react-router-dom";

// WE WILL USE THIS ONE
export function User(){
    const [completedForm, setCompletedForm] = useState({})

    const location = useLocation();

    // CompletedForm
    useEffect(() => {
        /*
        getDoc((doc(db, "users", auth.currentUser.uid)))
            .then(r => getCompletedForm(r).then(w => {
                setCompletedForm(w);
            }));

         */

        console.log(location.state.formDate)

        getDoc((doc(db, "users", auth.currentUser.uid)))
            .then(r => getCompletedFormByDate(r, location.state.formDate).then(w => {
                setCompletedForm(w);
            }));
    }, [location.state.formDate])

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

export function Answer({answerpath}){
    const [myanswer, setAnswer] = useState([]);
    useEffect(() => {
        console.log(answerpath)
        getAnswer(answerpath).then(r =>setAnswer(r));
    }, [answerpath])

    return (
        <>
            <p>{myanswer.label} vaut {myanswer.point} points</p>
        </>
    )
}