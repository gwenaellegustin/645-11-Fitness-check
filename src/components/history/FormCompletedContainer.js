import React, {useContext, useEffect, useState} from "react";
import {getQuestionsByIds} from "../../config/initFirebase";
import {CategoryContainer} from "../form/CategoryContainer";
import {HistoryContext} from "./History";
import {ChartContainer} from "./ChartContainer";
import {Loading} from "../Loading";

export function FormCompletedContainer({completedForm}){
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [answeredAnswersIds, setAnsweredAnswersIds] = useState([]);
    const [formIsReady, setFormIsReady] = useState(false);
    const { categories} = useContext(HistoryContext);

    //Answered questions
    useEffect(() => {
        setFormReady(false);
        const questionsId = [];
            completedForm.answeredQuestions.forEach(answeredQuestion => (
                questionsId.push(answeredQuestion.question.id)
            ))

            getQuestionsByIds(questionsId).then(r => {
                setAnsweredQuestions(r);
                setFormReady(true);
            })
    }, [completedForm.answeredQuestions.length > 0])

    //Answered answers
    useEffect(() => {
        const answersId = [];
            completedForm.answeredQuestions.forEach(answeredQuestion => (
                answeredQuestion.answers.forEach(answer => (
                    answersId.push(answer.id)
                ))
            ))
            setAnsweredAnswersIds(answersId);
    }, [completedForm.answeredQuestions])

    const setFormReady = (value) => {
        setFormIsReady(value);
    }

    return (
        <>
            {formIsReady ? <>
                <div className="col-lg-6 col-md-12">
                    {categories.map(category => (
                        <CategoryContainer key={category.id} category={category} questions={answeredQuestions.filter(question => question.category.id === category.id)} isDisplayMode={true} completedAnswersId={answeredAnswersIds}/>
                    ))}
                </div>
                <div className="col-lg-6 col-md-12">
                    <ChartContainer pointsByCategory={completedForm.pointsByCategory}/>
                </div>
            </>
                : <Loading/>}
        </>
    )
}