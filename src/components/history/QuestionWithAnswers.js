import {useEffect, useState} from "react";
import {getAnswer, getQuestion} from "../../config/initFirebase";

export function QuestionWithAnswers({answeredQuestion}){
    const [answer, setAnswer] = useState([]);
    const [question, setQuestion] = useState([]);

    useEffect(() => {
        getQuestion(answeredQuestion.parent.parent.id).then(r => setQuestion(r));
        getAnswer(answeredQuestion.path).then(r =>setAnswer(r));
    }, [])

    return (
        <>
            <p>{question.label}</p>
            <p>{answer.label} vaut {answer.point} points</p>
        </>
    )
}