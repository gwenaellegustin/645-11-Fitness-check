import {AnswersContainer} from "./AnswersContainer";
import {FormGroup, Label} from "reactstrap";

export function QuestionContainer({question, isDisplayMode, completedAnswersId}){

    //For the moment it only display the label, but it should call either a uniqueAnswersContainer or a multipleAnswersContainer
    return (
        <FormGroup>
            <Label>{question.label}</Label>
            {<AnswersContainer question={question}
                              uniqueAnswer={question.uniqueAnswer}
                              isDisplayMode={isDisplayMode}
                              completedAnswersId={completedAnswersId}/>}
        </FormGroup>
    )
}
