import {useEffect, useState} from "react";
import {getCategories, getQuestion, getQuestions} from "../../config/initFirebase";
import {CategoryContainer} from "../form/CategoryContainer";


export function FormCompleted({completedForm}){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));
    }, [])

    //Questions
    useEffect(() => {
        getQuestions().then(r => setQuestions(r));
    }, [])


    // Answered questions
    useEffect(() => {
        async function getQuestionsFromCompletedFrom() {
            //Get all questions from database
            //let questionsCollection = await getDocs(query(collection(db, "questions")));
            //Fill questions with objects containing all data from Firestore object + id
            console.log(completedForm.answeredQuestions)
            let answeredQuestionsArray = completedForm.answeredQuestions.map(q => ({
                    question : getQuestion(q.question.id)
            }
            ))
            setAnsweredQuestions(answeredQuestionsArray);
        }
        getQuestionsFromCompletedFrom().then(console.log(answeredQuestions))
    }, [])

    return (
            <form>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)} isDisplayMode={true}/>
                ))/*TODO: fitler*/}
                {/*categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={completedForm.answeredQuestions.filter
                    (answeredQuestion =>
                        answeredQuestion.question.category.id === category.id)}/>
                ))*/}
            </form>
    )

}