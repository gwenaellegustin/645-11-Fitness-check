import {useEffect, useState} from "react";
import {doc, getDoc, query} from "firebase/firestore";
import {
    auth,
    db,
    getCompletedForms,
} from "../../config/initFirebase";
import {QuestionWithAnswers} from "./QuestionWithAnswers";
import {FormCompleted} from "./FormCompleted";

// WE WILL USE THIS ONE
export function User(){
    const [completedForms, setCompletedForms] = useState([])

    // User
    useEffect(() => {
        getDoc(query(doc(db, "users", auth.currentUser.uid)))
        //getDoc(query(doc(db, "users", '4mnfc4FBnaStGX5jdOoNNCu7ZHp2'))) //TODO: for test
            .then(r => getCompletedForms(r)
            .then(r => setCompletedForms(r)));
    }, [])

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h2>Test on connected user {auth.currentUser.uid}</h2>
            <ul>
                {completedForms.map(completedForm => (
                    <li key={completedForm.id}>
                        <h3>ID du formulaire: {completedForm.id} <br/> avec le datetime : {completedForm.datetime}</h3>
                        <b>Only answer completed</b>
                        <ul>
                            {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                                <li key={index}>
                                    {<QuestionWithAnswers answeredQuestion={answeredQuestion}/>}
                                </li>
                            ))}
                        </ul>
                        <h3>All answers</h3>
                        {<FormCompleted completedForm={completedForm}></FormCompleted>}
                        <hr/>
                    </li>
                ))}
            </ul>


        </>
    )
}
