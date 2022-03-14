import {AnswersContainer} from "./AnswersContainer";

export function QuestionContainer({question}){
    //For the moment it only display the label, but it should call either a uniqueAnswersContainer or a multipleAnswersContainer
    return (
        <>
            <div>{question.label}</div>
            {/*<AnswersContainer answers={question.answers}/>*/}
        </>
    )
}
