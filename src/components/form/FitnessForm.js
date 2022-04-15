import {createContext, useContext, useEffect, useState} from "react";
import {Timestamp} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {
    addCompletedFormToFirestore,
    getCategories,
    getForm,
    getQuestionsWithIds
} from "../../config/initFirebase";
import {FormError} from "./FormError";
import {useNavigate} from "react-router-dom";
import {Button, Form} from 'reactstrap';
import {UserContext} from "../App";
import React from "react";

export const FormContext = createContext("");

export function FitnessForm(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isValidForm, setIsValidForm] = useState(true);
    const [completedForm] = useState({dateTime: null, answeredQuestions : []})
    const [isLoading, setIsLoading] = useState(true);

    const [invalidQuestionId, setInvalidQuestionId] = useState();

    const navigate = useNavigate();

    const user = useContext(UserContext);

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
    
    useEffect(() => {
        completedForm.pointsByCategory = [];
        categories.forEach(category => {
            completedForm.pointsByCategory.push({

                category: category.categoryRef,
                categoryLabel: category.label,
                finalPoints: 0.0,
                points: 0,
                maxPoints: 0,
                highIsGood: category.highIsGood
            })
        })

    }, [categories, completedForm])

    const handleFormInputChange = async e => {
        const target = e.target;
        const questionId = target.name;
        const answerId = target.value;

        let questionRef;
        let answerRef;
        let categoryId;
        let answerPoint;

        //As we have all info from the questions, we can set our variables
        questions.every(question => {
            if(question.id === questionId){
                questionRef = question.questionRef;
                categoryId = question.categoryId;
                question.answers.every(answer => {
                    if(answer.id === answerId){
                        answerRef = answer.answerRef;
                        answerPoint = answer.point
                        return false; //No need to continue the loop
                    }
                    return true;
                })
                return false; //No need to continue the loop
            }
            return true;
        })

        //Check if the answeredQuestion object exist in the array, otherwise, create it
        const answeredQuestionAlreadyExist = completedForm.answeredQuestions.find(answeredQuestion => answeredQuestion.question.id === questionId);

        if(answeredQuestionAlreadyExist){
            completedForm.answeredQuestions.forEach((answeredQuestion, index) => {
                if(answeredQuestion.question.id === questionId){
                    //If 'radio', only 1 response and 1 point need to be saved
                    if(target.type === 'radio'){
                        answeredQuestion.answers = [answerRef];
                        answeredQuestion.points = answerPoint;
                    } else {
                        //If 'checkbox'
                        //If checked, add the answer to saved ones and add points
                        if(target.checked){
                            answeredQuestion.answers.push(answerRef);
                            answeredQuestion.points += answerPoint;
                        } else { //Otherwise, remove the answer from saved ones and remove point
                            answeredQuestion.answers = answeredQuestion.answers.filter(answer => answer.id !== answerId);
                            answeredQuestion.points -= answerPoint;

                            //If the answered question doesn't have any checked answer, remove it
                            if(answeredQuestion.answers.length === 0){
                                completedForm.answeredQuestions.splice(index, 1);
                            }
                        }
                    }
                }}
            )
        } else {
            //Otherwise, create the answeredQuestion object
            completedForm.answeredQuestions.push({
                question: questionRef,
                answers: [answerRef],
                points: answerPoint,
                category: categoryId
            })
        }
    }

    const handleFormSubmit = e => {
        e.preventDefault(); //Prevent refresh page

        if(validate(e)){
            setIsValidForm(true);

            calculatePoints();

            saveTheForm();

        } else {
            //All answers aren't completed
            setIsValidForm(false);
        }
    }

    const validate = e => {
        let isValid = true;

        //Get all elements for the form (inputs and button)
        const elements = e.target.elements;
        const mapped = Array.prototype.map.call(elements, (element) => element);

        //Order the question in an array like the display
        let orderedQuestions = [];
        mapped.forEach(input => {
            //Take only INPUT elements
            if(!orderedQuestions.includes(input.name) && input.tagName === "INPUT"){
                orderedQuestions.push(input.name);
            }
        })

        orderedQuestions.every(questionId => {
            //We assume that the question isn't completed
            let questionIsCompleted = false;

            let inputsLinkedToQuestion = [];

            //Get only the inputs linked to the current question in loop
            mapped.every(input => {
                if(input.name === questionId){
                    inputsLinkedToQuestion.push(input);
                }
                return true; //Loop over all inputs
            })

            //Check if at least 1 answer is checked
            inputsLinkedToQuestion.every(input => {
                if(input.checked){
                    questionIsCompleted = true;
                    return false; //Stop the loop, this question as at least 1 answer checked
                }
                return true; //Continue the loop
            })

            if(!questionIsCompleted){
                inputsLinkedToQuestion[0].focus(); //Focus on first answer of the question

                setInvalidQuestionId(questionId); //Allow to display "Please complete this question"

                isValid = false; //Return of the function validate
            }

            //Stop the loop if question isn't completed
            //Or continue to find the next uncompleted question
            return questionIsCompleted;
        })

        return isValid;
    }

    const calculatePoints = () => {
        //Calculate max point by category and store it in comptetedForm
        let points = 0;

        questions.forEach(question => {
            //Check if it is a single or multiple answers question
            //If single, the answer with the max points will be taken
            //If multiple, the max is the total
            if(question.uniqueAnswer === true) {
                let pointsTab = [];
                question.answers.forEach(answer => {
                    pointsTab.push(answer.point);
                })
                points = Math.max(...pointsTab);
            } else {
                points = 0;
                question.answers.forEach(answer => {
                    points += answer.point;
                })
            }
            completedForm.pointsByCategory.every(objectCategory => {
                if(question.categoryId === objectCategory.category.id){
                    objectCategory.maxPoints += points;
                    return false; //No need to continue the loop
                }
                return true; //Continue the loop
            })
        })

        //Set pointsByCategory
        //Add points from each question to the correct category
        completedForm.answeredQuestions.forEach(answeredQuestion => {
            completedForm.pointsByCategory.every(objectCategory => {
                if(answeredQuestion.category === objectCategory.category.id){
                    objectCategory.points += answeredQuestion.points;
                    return false; //No need to continue the loop
                }
                return true; //Continue the loop
            })
        })

        //Calculating final point for the chart in %
        completedForm.pointsByCategory.forEach(objectCategory => {
            let result = 0;
            try {
                result = objectCategory.points / objectCategory.maxPoints * 100;
            }catch (e){
                objectCategory.finalPoints = 0;
            }

            if (objectCategory.highIsGood){
                objectCategory.finalPoints = result;
            }else{
                objectCategory.finalPoints = 100-result;
            }

            //Remove the calculation variables who don't need to be store in the database
            delete objectCategory.points;
            delete objectCategory.highIsGood;
            delete objectCategory.maxPoints;
        })
    }

    const saveTheForm = () => {
        //Set the date and time when submitting the form
        const formDate = new Date();
        completedForm.dateTime = Timestamp.fromDate(formDate);

        addCompletedFormToFirestore(user.userRef, completedForm).then(completedFormRef => {
            if(completedFormRef != null){
                console.log("ADD COMPLETED FORM SUCCESSFUL, id : " + completedFormRef.id);
                console.log(completedForm.dateTime)
                navigate("/history")
            }
        });
    }

    if(isLoading){
        return <div>Chargement...</div>
    }

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <h1>Nouveau questionnaire</h1>
            <FormContext.Provider value={[handleFormInputChange, invalidQuestionId]}>
                <Form onSubmit={handleFormSubmit}>
                    {categories.map(category => (
                        <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)} isDisplayMode={false}/>
                    ))}
                    <FormError isValidForm={isValidForm}/>
                    <Button type="submit" color="primary">Valider</Button>
                </Form>
            </FormContext.Provider>
        </>

    )
}
