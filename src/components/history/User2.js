import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
import {auth, db, getCategories, getQuestion, getCompletedForms, getAnswer} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";
import {QuestionWithAnswers} from "./QuestionWithAnswers";
import {QuestionWithAnswers2} from "./QuestionWithAnswers2";


export function User2(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [user, setUser] = useState([])
    let userDoc;
    const [completedForms, setCompletedForms] = useState([])


    // User
    useEffect(() => {
        async function getUser(){ // TODO: move to context ?
            //userDoc = await getDoc(query(doc(db, "users", auth.currentUser.uid)));
            userDoc = await getDoc(query(doc(db, "users", 'IqZpEaqXCn2xfcCjWCza'))); //TODO: for test
            let user = {
                ...userDoc.data(), //Set all attributes found in a user
                id: userDoc.id, //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
            }
            setUser(user);
        }
        getUser().then(getCompletedForms(true)
            .then(r => setCompletedForms(r)));
    }, [])

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));

    }, [])


    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h3>sur le user {user.id} {user.name}</h3>
            <ul>
                {completedForms.map(completedForm => (
                    <li key={completedForm.id}>
                        <p>{completedForm.datetime.toLocaleString()}</p>
                        <ul>
                            {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                                <li key={index}>
                                    {<QuestionWithAnswers2 answeredQuestion={answeredQuestion}/>}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </>
    )
}
