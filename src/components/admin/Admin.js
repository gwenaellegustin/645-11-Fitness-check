import React, {createContext, useEffect, useState} from "react"
import {
    getCategories,
    getForm,
    getQuestionsWithIds
} from "../../config/initFirebase";
import {NewQuestion} from "./NewQuestion";
import {EditCategoryContainer} from "./EditCategoryContainer";

export const AdminContext = createContext({})

export function Admin(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // TODO: warning message
    // tuto (video + git) :
        //  https://www.youtube.com/watch?v=SmMZqh1xdB4
        // https://github.com/daryanka/react-modal/tree/master/src
    // other example:
        // https://www.smashingmagazine.com/2020/11/react-useref-hook/

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
                getQuestionsWithIds(questionsIds).then(r => {
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

   useEffect(() => {
        if(questions !== null && categories.length > 0){
            setIsLoading(false);
        }
    }, [questions, categories])

    if(isLoading){
        return <div>Chargement...</div>
    }

    return (
        <AdminContext.Provider value={{categories: categories, editQuestion: editQuestion, addQuestion: addQuestion, deleteQuestion: deleteQuestion}}>
            <h1>Gestion des questions</h1>
            <NewQuestion/>
            {categories.map(category => (<EditCategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)}/>))}
        </AdminContext.Provider>
    )
}