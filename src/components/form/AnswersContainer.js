export function AnswersContainer({answers}){
    console.log(answers)
    return (
        <ul>
            {answers.map((answer, index) => (
                <li key={index}>
                    <p>{answer.label}</p>
                </li>
            ))}
        </ul>
    )
}
