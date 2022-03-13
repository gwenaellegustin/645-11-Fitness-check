import {AnswersContainer} from "./AnswersContainer";

export function QuestionContainer({question}){
    return (
        <>
            <div>{question.category}</div>
            <div>{question.label}</div>
            <AnswersContainer answers={question.answers}/>
        </>
    )
}
