import {useEffect, useState} from "react";
import {getAnswer, getQuestion} from "../../config/initFirebase";

export function QuestionWithAnswers2({answeredQuestion}){
    const [question, setQuestion] = useState([]);

    useEffect(() => {
        getQuestion(answeredQuestion.question.id).then(r => setQuestion(r));
        //getAnswer(answeredQuestion.path).then(r =>setAnswer(r));
    }, [])

    return (
        <ul>
            <p>{question.label}</p>
            {answeredQuestion.answers.map((answer, index) => (
                <li key={index}>
                    {<Answer2 answerpath={answer.path}/>}
                </li>
            ))}
        </ul>
    )
}

export function Answer2({answerpath}){
    const [myanswer, setAnswer] = useState([]);
    useEffect(() => {
        getAnswer(answerpath).then(r =>setAnswer(r));
    }, [])

    return (
        <p>{myanswer.label} vaut {myanswer.point} points</p>
    )
}