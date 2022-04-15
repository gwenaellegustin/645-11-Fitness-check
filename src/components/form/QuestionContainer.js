import {AnswersContainer} from "./AnswersContainer";
import {FormGroup, Label} from "reactstrap";
import {useContext} from "react";
import React from "react";
import {FormContext} from "./FitnessForm";

export function QuestionContainer({question, isDisplayMode, completedAnswersId}){
    const [, invalidQuestionId] = useContext(FormContext);

    //For the moment it only display the label, but it should call either a uniqueAnswersContainer or a multipleAnswersContainer
    return (
        <FormGroup>
            <Label>{question.label}</Label>
            {invalidQuestionId === question.id && <div className={"text-danger"}>Please complete this question.</div>}
            {<AnswersContainer question={question}
                              uniqueAnswer={question.uniqueAnswer}
                              isDisplayMode={isDisplayMode}
                              completedAnswersId={completedAnswersId}/>}
        </FormGroup>
    )
}
