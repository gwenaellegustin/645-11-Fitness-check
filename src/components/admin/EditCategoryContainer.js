import {EditQuestionContainer} from "./EditQuestionContainer";
import React from "react";

/**
 * Component to display all questions of a category in questions management
 *
 * @param category used to map each question
 * @param questions of the category to display
 *
 * @author Antony
 */
export function EditCategoryContainer({category, questions}){
    return (<div  className="text-start">
                {questions.length > 0 ?
                        (<div key={category.id}>
                        <legend>{category.label}</legend>
                            <hr/>
                        {questions
                            .map(question => (
                                <EditQuestionContainer key={question.id} question={question}/>
                            ))}
                    </div>) : null
                }
        </div>)
}