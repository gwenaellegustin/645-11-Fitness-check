import {QuestionContainer} from "./QuestionContainer";
import {FormGroup} from "reactstrap";

export function CategoryContainer({category, questions, isDisplayMode, completedAnswersId}) {

    //Return a question container with the question object (containing the label, answers, isUniqueAnswer)
    return (
        <FormGroup>
            <legend>{category.label}</legend>
            {questions
                .sort((a, b) => a.label.localeCompare(b.label)) //Sort alphabetically by label
                .map(question => (
                <QuestionContainer key={question.id} question={question} isDisplayMode={isDisplayMode}
                                   completedAnswersId={completedAnswersId}/>
            ))}
        </FormGroup>
    )
}