import {AnswersContainer} from "./AnswersContainer";

export function QuestionContainer({question, isDisplayMode}){
    //For the moment it only display the label, but it should call either a uniqueAnswersContainer or a multipleAnswersContainer
    return (
        <>
            <div>{question.label}</div>
            <AnswersContainer question={question} uniqueAnswer={question.uniqueAnswer} isDisplayMode={isDisplayMode}/>
        </>
    )
}
