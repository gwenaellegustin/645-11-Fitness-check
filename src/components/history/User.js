import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
import {auth, db, getCategories, getQuestion, getCompletedForms, getAnswer} from "../../config/initFirebase";
import {QuestionWithAnswers} from "./QuestionWithAnswers";

// WE WILL USE THIS ONE
export function User(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [user, setUser] = useState([])
    let userDoc;
    const [completedForms, setCompletedForms] = useState([])

    // User
    useEffect(() => {
        // getDoc(query(doc(db, "users", auth.currentUser.uid)))
        getDoc(query(doc(db, "users", 'IqZpEaqXCn2xfcCjWCza'))) //TODO: for test
            .then(r => getCompletedForms(r)
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
            <h3>Test sur le user IqZpEaqXCn2xfcCjWCza Gwen</h3>
            <ul>
                {completedForms.map(completedForm => (
                    <li key={completedForm.id}>
                        <p>{completedForm.datetime.toLocaleString()}</p>
                        <ul>
                            {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                                <li key={index}>
                                    {<QuestionWithAnswers answeredQuestion={answeredQuestion}/>}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </>
    )
}
