import React, {useContext, useEffect, useState} from "react";
import {FormContext} from "./FitnessForm";
import {getAnswersByQuestion} from "../../config/initFirebase";
import {Input, Label} from "reactstrap";

/**
 * Component to display all answers concerning a question
 *
 * @param question to display answers from
 * @param uniqueAnswer for radio or checkbox input
 * @param isDisplayMode for edit or read-only mode
 * @param completedAnswersId for read-only mode in order to select answered answers
 *
 * @author Antony
 */
export function AnswersContainer({question, uniqueAnswer, isDisplayMode, completedAnswersId}){
    const [onChange] = useContext(FormContext);
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
        <div>
            {answers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <div key={answer.id}>
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
                    </div>
                ))}
        </div>

    )
}
