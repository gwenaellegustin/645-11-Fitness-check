import {createContext, useEffect, useState} from "react"
import { editQuestion,
    getCategories,
    getForm,
    getQuestionsWithIds
} from "../config/initFirebase";
import {useNavigate} from "react-router-dom";
import {Button, Form, FormGroup, Input} from 'reactstrap';

export const FormContext = createContext();

export function Admin(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    let editedQuestions = [];
    const navigate = useNavigate();

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

    const handleFormInputChange = e => {
        let questionAlreadyEdited = false;
        editedQuestions.forEach(question => {
            if (question.id === e.target.name){
                    question.id = e.target.name;
                    question.newLabel = e.target.value;
                    questionAlreadyEdited = true;
                }
        })
        if (questionAlreadyEdited === false){
            editedQuestions.push({
                id: e.target.name,
                newLabel: e.target.value
            })
        }
        console.log(editedQuestions)

    }

    const handleFormSubmit = async e => {
        e.preventDefault();
        for (const editedQuestion of editedQuestions) {
            await editQuestion(editedQuestion);
        }
        navigate("/form")
    }

    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h1>Gestion des questions</h1>
            {<FormContext.Provider value={handleFormInputChange}>
                <Form onSubmit={handleFormSubmit}>
                    {categories.map(category => (
                        <FormGroup key={category.id}>
                            <legend>{category.label}</legend >
                            {questions.filter(question => question.category.id === category.id).map(question => (
                                <FormGroup key={question.id}>
                                    <Input type="textarea" name={question.id}  defaultValue={question.label}  onChange={handleFormInputChange}>
                                    </Input>
                                </FormGroup>
                            ))}
                        </FormGroup>
                    ))}
                    <Button type="submit" color="primary">Enregistrer</Button>
                </Form>
            </FormContext.Provider>}
        </>

    )
}
