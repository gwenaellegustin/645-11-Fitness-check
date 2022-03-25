import {Fragment, useContext, useEffect, useState} from "react";
import {FormContext} from "./Form";
import {FormGroup} from "react-bootstrap";
import {getAnswersByQuestion} from "../../config/initFirebase";

export function AnswersContainer({question, uniqueAnswer, isDisplayMode, completedAnswersId}){
    const onChange = useContext(FormContext)
    const [answers, setAnswers] = useState([]);

    const answerType = uniqueAnswer ? 'radio' : 'checkbox';

    useEffect(() => {
        getAnswersByQuestion(question.questionRef).then(r => {
            setAnswers(r);
        })
    }, [question.questionRef])
    
    useEffect(() => {
        question.answers = answers;
    }, [answers, question])

    return (
        <FormGroup key={question.id}>
            {answers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <Fragment key={answer.id}>
                        <input
                            disabled={isDisplayMode}
                            type={answerType}
                            name={question.id} //Need to be same for all grouped answers
                            id={question.id.concat("-").concat(answer.id)}
                            value={answer.id}
                            onChange={onChange}
                            checked={completedAnswersId && completedAnswersId.includes(answer.id)}
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
