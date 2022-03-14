import {AnswersContainer} from "./AnswersContainer";

export function QuestionContainer({question}){
    return (
        <>
            <div>{question.label}</div>
            {/*<AnswersContainer answers={question.answers}/>*/}
        </>
    )
}
