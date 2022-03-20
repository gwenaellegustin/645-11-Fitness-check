import {Fragment, useContext, useEffect, useState} from "react";
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
            let questionDoc = await getDoc(query(doc(db, "questions", question.id)));

            //Get all answers for that question from database
            let answersCollection = await getDocs(query(collection(questionDoc.ref, "answers")));
            //Fill answers with objects containing all data from Firestore object + id
            let answersArray = answersCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setAnswers(answersArray)
        }
        getAnswers();
    }, [question.id])

    return (
        <FormGroup key={question.id}>
            {answers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <Fragment key={answer.id}>
                        <input
                            type={answerType}
                            name={question.id} //Need to be same for all grouped answers
                            id={question.id.concat("-").concat(answer.id)}
                            value={answer.id}
                            onChange={onChange}
                        />
                        <label>
                            {answer.label}
                        </label>
                        <br/>
                    </Fragment>
            ))}
        </FormGroup>
    )
}
