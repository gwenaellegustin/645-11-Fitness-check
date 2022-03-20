import {useEffect, useState} from "react";
import {doc, getDoc, query} from "firebase/firestore";
import {
    auth,
    db,
    getCompletedForms,
} from "../../config/initFirebase";
import {QuestionWithAnswers} from "./QuestionWithAnswers";
import {FormCompleted2} from "./FormCompleted2";
import {FormCompletedContainer} from "./FormCompletedContainer";

// WE WILL USE THIS ONE
export function User(){
    const [completedForms, setCompletedForms] = useState([])

    // CompletedForms
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
                        <h3>Only answer completed</h3>
                        {<FormCompletedContainer completedForm={completedForm}/>}
                        <h3>All answers</h3>
                        {<FormCompleted2 completedForm={completedForm}></FormCompleted2>}
                        <hr/>
                    </li>
                ))}
            </ul>


        </>
    )
}
