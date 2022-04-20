import {createContext, useContext, useEffect, useState} from "react";
import {Timestamp} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {addCompletedFormToFirestore, getCategories, getForm, getQuestionsWithIds} from "../../config/initFirebase";
import {FormError} from "./FormError";
import {useNavigate} from "react-router-dom";
import {Button, Form} from 'reactstrap';
import {UserContext} from "../App";
import React from "react";
import {Loading} from "../Loading";

export const FormContext = createContext("");

/**
 * Component to display the form sorted by categories
 */
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
        //https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm
        let mounted = true;
        getCategories().then(r => {
            if(mounted){
                setCategories(r);
            }
        });

        return () => {mounted = false}
    }, [])

    //Questions from Form collection
    useEffect(() => {
        //https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm
        let mounted = true;
        let questionsIds = [];
        getForm().then(form => {
            if(mounted){
                form.questions.forEach(questionDoc => {
                    questionsIds.push(questionDoc.id)
                })

                getQuestionsWithIds(questionsIds).then(r => {
                    setQuestions(r);
                })
            }
        })

        return () => {mounted = false}
    }, [])

    //Is not more loading when questions and categories are fetched
    useEffect(() => {
        //https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm
        let mounted = true;
        if(questions.length > 0 && categories.length > 0){
            if(mounted){
                setIsLoading(false);
            }
        }

        return () => {mounted = false}
    }, [questions, categories])

    //When categories are fetched, build completedForm
    useEffect(() => {
        completedForm.pointsByCategory = [];
        categories.forEach(category => {
            //Check if the category exists in the questions
           questions.every(question => {
                if(question.categoryId === category.id){
                    completedForm.pointsByCategory.push({
                        category: category.categoryRef,
                        categoryLabel: category.label,
                        finalPoints: 0.0,
                        points: 0,
                        maxPoints: 0,
                        highIsGood: category.highIsGood
                    })
                    return false; //Category exist, test ok
                }
                return true; //Continue the loop
            })
        })
    }, [questions])

    //Event handler on input change
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

        //Check if the answeredQuestion object exist in the array
        const answeredQuestionAlreadyExist = completedForm.answeredQuestions.find(answeredQuestion => answeredQuestion.question.id === questionId);

        if(answeredQuestionAlreadyExist){
            completedForm.answeredQuestions.forEach((answeredQuestion, index) => {
                if(answeredQuestion.question.id === questionId){
                    //If 'radio'
                    //Only 1 answer and 1 point need to be saved
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
                points: answerPoint
            })
        }
    }

    //Event handler on form submit
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

    //Check that all questions have been answered
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

    //Calculate max, answered points and percentage
    const calculatePoints = () => {
        //Calculate max point by category and store it in comptetedForm
        let points = 0;

        //Set max points by category
        questions.forEach(question => {
            //Check if it is a single or multiple answers question
            //If single, the answer with the max points will be taken
            if(question.uniqueAnswer === true) {
                let pointsTab = [];
                question.answers.forEach(answer => {
                    pointsTab.push(answer.point);
                })
                points = Math.max(...pointsTab);
            } else { //If multiple, the max is the total
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

        //Set answered points by category
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
            console.log(objectCategory.label)
            let result = 0;
            try {
                result = objectCategory.points / objectCategory.maxPoints * 100;
            } catch (e){
                console.log("Can't divide by 0. Final points will be 0.")
                objectCategory.finalPoints = 0;
            }

            if (objectCategory.highIsGood){
                objectCategory.finalPoints = result;
            } else{
                objectCategory.finalPoints = 100-result;
            }

            //Remove the calculation variables who don't need to be store in the database
            delete objectCategory.points;
            delete objectCategory.highIsGood;
            delete objectCategory.maxPoints;
        })
    }

    //Save the form in Firestore and redirect to History
    const saveTheForm = () => {
        //Set the date and time when submitting the form
        const formDate = new Date();
        completedForm.dateTime = Timestamp.fromDate(formDate);

        addCompletedFormToFirestore(user.userRef, completedForm).then(completedFormRef => {
            if(completedFormRef != null){ //Ensure the form has been correctly saved
                navigate("/history")
            } else {
                console.error("The form can't be saved in Firestore.")
            }
        });
    }

    if(isLoading){
        return <Loading/>
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
                    {!isValidForm && <FormError/>}
                    <Button type="submit" color="primary">Valider</Button>
                </Form>
            </FormContext.Provider>
        </>
    )
}