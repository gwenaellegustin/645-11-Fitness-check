import {OLDQuestionWithAnswers} from "./OLDQuestionWithAnswers";

export function OLDFormCompletedContainer({completedForm}){

    return (
        <>
            <h3>ID du formulaire: {completedForm.id} <br/> avec le datetime : {(new Date(completedForm.dateTime.seconds * 1000 + completedForm.dateTime.nanoseconds/1000)).toLocaleDateString()}</h3>
            <ul>
                {completedForm.answeredQuestions.map((answeredQuestion, index) => (
                    <li key={index}>
                        {<OLDQuestionWithAnswers answeredQuestion={answeredQuestion}/>}
                    </li>
                ))}
            </ul>
        </>
    )

}
