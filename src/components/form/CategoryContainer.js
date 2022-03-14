import {QuestionContainer} from "./QuestionContainer";

export function CategoryContainer({category, questions}){

    //Return a question container with the question object (containing the label, answers, isUniqueAnswer)
    return (
        <div>
            <ul>
                {category.label}
                {questions.map(question => (
                    <QuestionContainer key={question.id} question={question}/>
                ))}
            </ul>
        </div>
    )
}
