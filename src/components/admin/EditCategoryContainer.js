import {EditQuestionContainer} from "./EditQuestionContainer";
import React from "react";

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