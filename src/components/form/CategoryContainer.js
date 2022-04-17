import {QuestionContainer} from "./QuestionContainer";
import {FormGroup} from "reactstrap";
import {useEffect} from "react";

export function CategoryContainer({category, questions, isDisplayMode, completedAnswersId}) {

    useEffect(() => {
        //Order question alphabetically
        questions.sort((a, b) => a.label.localeCompare(b.label));
    }, [questions])

    //Return a question container with the question object (containing the label, answers, isUniqueAnswer)
    return (
        <FormGroup>
            <legend>{category.label}</legend>
            {questions.map(question => (
                <QuestionContainer key={question.id} question={question} isDisplayMode={isDisplayMode}
                                   completedAnswersId={completedAnswersId}/>
            ))}
        </FormGroup>
    )
}