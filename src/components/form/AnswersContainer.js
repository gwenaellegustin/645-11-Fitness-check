export function AnswersContainer({answers}){
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
