import { useForm } from "react-hook-form";
import {Fragment, useContext, useEffect} from "react";
import {FormContext} from "./Form";
import {FormGroup} from "react-bootstrap";


export function AnswersContainer({question, uniqueAnswer}){
    const register = useContext(FormContext)

    const answerType = uniqueAnswer ? 'radio' : 'checkbox';

    return (
        <FormGroup>
            {question.answers
                .sort((a,b) => a.point-b.point) //Sort by point ascending
                .map((answer, index) => (
                    <>
                        <input
                            {...register(question.id)}
                            type={answerType}
                            name={question.id}
                            id={index}
                            value={answer.label}
                        />
                        <label>
                            {answer.label}
                        </label>
                    </>
            ))}
        </FormGroup>
    )
}
