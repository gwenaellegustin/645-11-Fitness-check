import {QuestionWithAnswers} from "./QuestionWithAnswers";

export function FormCompletedContainer({completedForm}){

    return (
        <>
            <h3>ID du formulaire: {completedForm.id} <br/> avec le datetime : {completedForm.datetime}</h3>
            <ul>
                {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                    <li key={index}>
                        {<QuestionWithAnswers answeredQuestion={answeredQuestion}/>}
                    </li>
                ))}
            </ul>
        </>
    )

}