import {useEffect, useState} from "react";
import {getAnswer} from "../../config/initFirebase";

export function QuestionWithAnswers({answeredQuestion}){
    const [question, setQuestion] = useState([]);

    useEffect(() => {
        //getQuestion(answeredQuestion.question.id).then(r => setQuestion(r));
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
        console.log(answerpath)
        getAnswer(answerpath).then(r =>setAnswer(r));
    }, [answerpath])

    return (
        <>
            <p>{myanswer.label} vaut {myanswer.point} points</p>
        </>
    )
}
