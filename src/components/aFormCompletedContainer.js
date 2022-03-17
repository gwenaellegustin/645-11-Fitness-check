export function aFormCompletedContainer({datetime}){
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
