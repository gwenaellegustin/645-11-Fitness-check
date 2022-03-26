import {useContext, useEffect, useState} from "react";
import {FormContext} from "./Form";
import {FormGroup} from "react-bootstrap";
import {getAnswersByQuestion} from "../../config/initFirebase";
import {Input, Label} from "reactstrap";

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
                    <FormGroup key={answer.id}>
                        <Input
                            disabled={isDisplayMode}
                            name={question.id}
                            type={answerType}
                            id={question.id.concat("-").concat(answer.id)}
                            value={answer.id}
                            onChange={onChange}
                            checked={completedAnswersId && completedAnswersId.includes(answer.id)}
                        />
                        {' '}
                        <Label check>
                            {answer.label}
                        </Label>
                    </FormGroup>
            ))}
        </FormGroup>
    )
}
