import {QuestionContainer} from "./QuestionContainer";

export function CategoryContainer({category, questions, isDisplayMode}){
    //Return a question container with the question object (containing the label, answers, isUniqueAnswer)
    return (
        <div>
            <ul>
                <b>{category.label}</b>
                {questions.map(question => (
                    <QuestionContainer key={question.id} question={question} isDisplayMode={isDisplayMode}/>
                ))}
            </ul>
        </div>
    )
}
