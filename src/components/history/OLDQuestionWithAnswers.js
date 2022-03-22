import {useEffect, useState} from "react";
import {getQuestion} from "../../config/initFirebase";
import {Answer} from "./OLDUser";

export function OLDQuestionWithAnswers({answeredQuestion}){
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


