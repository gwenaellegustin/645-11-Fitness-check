import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
import {auth, db, getCategories, getQuestion, getCompletedForms, getAnswer} from "../../config/initFirebase";
import {QuestionWithAnswers} from "./QuestionWithAnswers";
import {CategoryContainer} from "../form/CategoryContainer";
import {FormCompleted} from "./FormCompleted";

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
        getDoc(query(doc(db, "users", '4mnfc4FBnaStGX5jdOoNNCu7ZHp2'))) //TODO: for test
            .then(r => getCompletedForms(r)
            .then(r => setCompletedForms(r)));
    }, [])

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));
    }, [])

    //Questions
    useEffect(() => {
        async function getQuestions(){
            //Get all questions from database
            let questionsCollection = await getDocs(query(collection(db, "questions")));
            //Fill questions with objects containing all data from Firestore object + id
            let questionsArray = questionsCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setQuestions(questionsArray);
            console.log(questionsArray)
        }

        getQuestions();
    }, [])



    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h2>Test sur le user 4mnfc4FBnaStGX5jdOoNNCu7ZHp2 Antony</h2>
            <ul>
                {completedForms.map(completedForm => (
                    <li key={completedForm.id}>
                        <h3>ID du formulaire: {completedForm.id} <br/> avec le datetime : {completedForm.datetime}</h3>
                        <ul>
                            {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                                <li key={index}>
                                    {<QuestionWithAnswers answeredQuestion={answeredQuestion}/>}

                                </li>
                            ))}
                        </ul>
                        {completedForm.id === 'KKnFzEfmeATa1lqSswVi' && <FormCompleted completedForm={completedForm}></FormCompleted>}
                        <hr/>
                    </li>
                ))}
            </ul>


        </>
    )
}
