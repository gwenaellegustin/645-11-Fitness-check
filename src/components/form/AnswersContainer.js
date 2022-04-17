import React, {useContext} from "react";
import {FormContext} from "./FitnessForm";
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

    const answerType = uniqueAnswer ? 'radio' : 'checkbox';

    return (
        <div>
            {question.answers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <div key={answer.id}>
                        <Input
                            disabled={isDisplayMode} //Differentiate between new form and history
                            name={question.id} //Answers with same question need to be regrouped
                            type={answerType} //Either radio or checkbox
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