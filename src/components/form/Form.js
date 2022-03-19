import {createContext, useEffect, useState} from "react";
import {collection, getDocs, query} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db} from "../../config/initFirebase";
import {useForm} from "react-hook-form";

export const FormContext = createContext();

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    const { register, handleSubmit } = useForm();

    //Categories
    useEffect(() => {
        async function getCategories(){
            //Get all categories from database
            let categoriesCollection = await getDocs(query(collection(db, "categories")));
            //Fill categories with objects containing all data from Firestore object + id
            let categoriesArray = categoriesCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setCategories(categoriesArray);
        }
        getCategories();
    }, [])

    //Questions
    useEffect(() => {
        async function getQuestions(){
            //Get all questions from database
            let questionsCollection = await getDocs(query(collection(db, "questions")));
            //Fill questions with objects containing all data from Firestore object + id
            let questionsArray = questionsCollection.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setQuestions(questionsArray);
        }
        getQuestions();
    }, [])

    const onSubmit = data => {console.log(data)}; //https://www.react-hook-form.com/api/useform/

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <FormContext.Provider value={register}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)}/>
                ))}
                <input type="submit" />
            </form>
        </FormContext.Provider>

    )
}
