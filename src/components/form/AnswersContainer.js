export function AnswersContainer({answers}){
    return (
        <ul>
            {answers && answers.length > 0 && answers.map((answer, index) => (
                <li key={index}>
                    <p>{answer.label}</p>
                </li>
            ))}
        </ul>
    )
}
