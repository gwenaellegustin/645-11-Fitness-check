import React, {createContext, useEffect, useState} from "react"
import { getCategories,
    getForm,
    getQuestionsWithIds
} from "../../config/initFirebase";
import {NewQuestion} from "./NewQuestion";
import {EditQuestionContainer} from "./EditQuestionContainer";

export const FormContext = createContext();

export function Admin(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /*const modalRef = useRef(false)
    // Toggle for MyModalBody
    const HandleShowPopup = () => {
        console.log(modalRef.current)
        modalRef.current = !modalRef.current
        //setModal(!popup.current.props.isOpen)
        //console.log(modal)
    }*/

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
            form.questions.forEach(questionDoc => {
                questionsIds.push(questionDoc.id)
            })

            getQuestionsWithIds(questionsIds).then(r => {
                setQuestions(r);
            })
        })
    }, [])

   useEffect(() => {
        if(questions.length > 0 && categories.length > 0){
            setIsLoading(false);
        }
    }, [questions, categories])

    if(isLoading){
        return <div>Chargement...</div>
    }

    return (
        <div>
            <h1>Gestion des questions</h1>
            <NewQuestion categories={categories}/>
                {categories.map(category => (
                    <div key={category.id} >
                            <legend>{category.label}</legend >
                            {questions.filter(question => question.category.id === category.id).map(question => (
                                <EditQuestionContainer categories={categories} key={question.id} question={question}/>
                            ))}
                    </div>
                ))}
        </div>
    )
}
