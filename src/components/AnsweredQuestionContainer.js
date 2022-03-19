import {AnswersContainer} from "./form/AnswersContainer";

export function AnsweredQuestionContainer({question, index}){
    //For the moment it only display the label, but it should call either a uniqueAnswersContainer or a multipleAnswersContainer
    return (
        <ul>
            <li key={index}>{question.label}</li>
            <p>{question.answers}</p>
            {console.log(question.answers)}
        </ul>
    )
}
