import {useEffect, useState} from "react";
import {getCategoriesWithIds, getQuestionsWithIds} from "../../config/initFirebase";
import {CategoryContainer} from "../form/CategoryContainer";


export function FormCompleted({completedForm}){
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [answeredCategories, setAnsweredCategories] = useState([]);
    const [answeredAnswersIds, setAnsweredAnswersIds] = useState([]);

    //Answered questions
    useEffect(() => {
        const questionsId = [];
        if(completedForm.answeredQuestions && completedForm.answeredQuestions.length > 0){
            completedForm.answeredQuestions.forEach(answeredQuestion => (
                questionsId.push(answeredQuestion.question.id)
            ))

            getQuestionsWithIds(questionsId).then(r => {
                setAnsweredQuestions(r);
            })
        }
    }, [completedForm.answeredQuestions])

    //Answered categories
    useEffect(() => {
        const categoriesId = [];
        answeredQuestions.forEach(question => {
            if (!categoriesId.includes(question.category.id)) {
                categoriesId.push(question.category.id);
            }
        })

        getCategoriesWithIds(categoriesId).then(r => {
            setAnsweredCategories(r);
        })
    }, [answeredQuestions])

    //Answered answers
    useEffect(() => {
        const answersId = [];

        if(completedForm.answeredQuestions){
            completedForm.answeredQuestions.forEach(answeredQuestion => (
                answeredQuestion.answers.forEach(answer => (
                    answersId.push(answer.id)
                ))
            ))
            setAnsweredAnswersIds(answersId);
        }
    }, [completedForm.answeredQuestions])

    return (
        <form>
            <h3>Date : {(new Date(completedForm.dateTime.seconds * 1000 + completedForm.dateTime.nanoseconds/1000)).toLocaleDateString()
                + " "
                + (new Date(completedForm.dateTime.seconds * 1000 + completedForm.dateTime.nanoseconds/1000)).toLocaleTimeString()}</h3>
            {answeredCategories.map(category => (
                <CategoryContainer key={category.id} category={category} questions={answeredQuestions.filter(question => question.category.id === category.id)} isDisplayMode={true} completedAnswersId={answeredAnswersIds}/>
            ))}
        </form>
    )
}
