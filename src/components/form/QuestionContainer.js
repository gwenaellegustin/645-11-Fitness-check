import {AnswersContainer} from "./AnswersContainer";
import {FormGroup, Label} from "reactstrap";
import {useContext} from "react";
import React from "react";
import {FormContext} from "./FitnessForm";

/**
 * Component to display a question with the answers
 *
 * @param question linked to this container
 * @param isDisplayMode for edit or read-only mode
 * @param completedAnswersId for read-only mode in order to select answered answers
 *
 * @author Antony
 */
export function QuestionContainer({question, isDisplayMode, completedAnswersId}){
    //When submitting the form, will indicate which question isn't answered in order to display a red message
    const [, invalidQuestionId] = useContext(FormContext);

    return (
        <FormGroup>
            <Label tag="h6">{question.label}</Label>
            {invalidQuestionId === question.id && <div className={"text-danger"}>Veuillez compléter cette question.</div>}
            {<AnswersContainer question={question}
                              uniqueAnswer={question.uniqueAnswer}
                              isDisplayMode={isDisplayMode}
                              completedAnswersId={completedAnswersId}/>}
        </FormGroup>
    )
}