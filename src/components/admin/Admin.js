import React, {createContext, useEffect, useState} from "react"
import {getCategories, getForm, getQuestionsByIds} from "../../config/initFirebase";
import {NewQuestionContainer} from "./NewQuestionContainer";
import {EditCategoryContainer} from "./EditCategoryContainer";
import {Loading} from "../Loading";

export const AdminContext = createContext({})

/**
 *  Component to display the Admin page:
 *  Use to manage questions
 *
 * @author Gwenaëlle
 */
export function Admin(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    //Categories
    useEffect(() => {
        getCategories().then(r => {
            setCategories(r)
        });
    }, [])

    //Questions from Form collection
    useEffect(() => {
        let questionsIds = [];
        getForm().then(form => {
            if(form.questions !== undefined){
                form.questions.forEach(questionDoc => {
                    questionsIds.push(questionDoc.id)
                })
                getQuestionsByIds(questionsIds).then(r => {
                    setQuestions(r);
                })
            } else {
                setQuestions([]);
            }
        })
    }, [])

    // Functions to update the display (passed in context)
    const addQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion] )
    }
    const editQuestion = (editedQuestion, oldQuestionId) => {
        const index = questions.findIndex(question => question.id === oldQuestionId);
        let temp = [...questions];
        temp[index] = editedQuestion;
        setQuestions(temp);
    }
    const deleteQuestion = (deletedQuestion) => {
        const index = questions.findIndex(question => question.id === deletedQuestion.id);
        let temp = [...questions];
        temp.splice(index,1)
        setQuestions(temp)
    }

    // Loading message if categories or questions not loaded
   useEffect(() => {
        if(questions !== null && categories.length > 0){
            setIsLoading(false);
        }
    }, [questions, categories])
    if(isLoading){
        return <Loading/>
    }

    return (
        <AdminContext.Provider value={{categories: categories, editQuestion: editQuestion, addQuestion: addQuestion, deleteQuestion: deleteQuestion}}>
            <h1>Gestion des questions</h1>
            <NewQuestionContainer/>
            {categories.map(category => (<EditCategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)}/>))}
        </AdminContext.Provider>
    )
}