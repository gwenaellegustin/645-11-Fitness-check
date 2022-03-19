import {useContext, useEffect, useState} from "react";
import {FormContext} from "./Form";
import {FormGroup} from "react-bootstrap";
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
import {db} from "../../config/initFirebase";

export function AnswersContainer({question, uniqueAnswer}){
    const onChange = useContext(FormContext)
    const [answers, setAnswers] = useState([]);

    const answerType = uniqueAnswer ? 'radio' : 'checkbox';

    useEffect(() => {
        async function getAnswers(){
            let questionDoc = await getDoc(query(doc(db, "questionsTest", question.id)));

            //Get all answers for that question from database
            let answersCollection = await getDocs(query(collection(questionDoc.ref, "answersTest")));
            //Fill answers with objects containing all data from Firestore object + id
            let answersArray = answersCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setAnswers(answersArray)
        }
        getAnswers();
    }, [])

    return (
        <FormGroup>
            {answers
                .map((answer, index) => (
                    <>
                        <input
                            type={answerType}
                            name={question.id}
                            id={index}
                            value={answer.id}
                            onChange={onChange}
                        />
                        <label>
                            {answer.label}
                        </label>
                    </>
            ))}
        </FormGroup>
    )
}
