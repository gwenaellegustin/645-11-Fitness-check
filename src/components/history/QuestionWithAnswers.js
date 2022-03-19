import {useEffect, useState} from "react";
import {getAnswer, getQuestion} from "../../config/initFirebase";
import {CategoryContainer} from "../form/CategoryContainer";

export function QuestionWithAnswers({answeredQuestion}){
    const [question, setQuestion] = useState([]);

    useEffect(() => {
        getQuestion(answeredQuestion.question.id).then(r => setQuestion(r));
    }, [])

    return (
        <ul>
            <p>{question.label}</p>
            {answeredQuestion.answers.map((answer, index) => (
                <li key={index}>
                    {<Answer answerpath={answer.path}/>}
                </li>
            ))}
        </ul>
    )
}

export function Answer({answerpath}){
    const [myanswer, setAnswer] = useState([]);
    useEffect(() => {
        getAnswer(answerpath).then(r =>setAnswer(r));
    }, [])

    return (
        <>
            <p>{myanswer.label} vaut {myanswer.point} points</p>
        </>
    )
}