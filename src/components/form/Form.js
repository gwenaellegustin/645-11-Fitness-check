import {createContext, useEffect, useState} from "react";
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

export const FormContext = createContext();

export function Form(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isValidForm, setIsValidForm] = useState(true);
    const [completedForm] = useState({dateTime: null, answeredQuestions : []})
    const [isLoading, setIsLoading] = useState(true);

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

    //TODO: TO DELETE, just to represent the objet inside the array above "answeredQuestions"
    let answeredQuestion = {
        question: "QUESTIONID",
        answers: ["REF"]
    }
    
    useEffect(() => {
        completedForm.pointsByCategory = [];
        categories.forEach(category => {
            completedForm.pointsByCategory.push({
                category: category.categoryRef,
                categoryLabel: category.label,
                points: 0,
                maxPoints: 0,
                finalPoints: 0.0,
                highIsGood: category.HighIsGood
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
        questions.forEach(question => {
            if(question.id === questionId){
                questionRef = question.questionRef;
                categoryId = question.categoryId;
                question.answers.forEach(answer => {
                    if(answer.id === answerId){
                        answerRef = answer.answerRef;
                        answerPoint = answer.point
                        return;
                    }
                })
                return;
            }
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
        e.preventDefault(); //TODO: Needed?

        //Calculate max point by category and store it in comptetedForm
        let points = 0;

        questions.forEach(question => {
            //Check if it is a single or multiple answers question
            //If single, the answer with the max points will be taken
            //If multiple, the max is the total
            if(question.uniqueAnswer === true)
            {
                let pointsTab = [];
                question.answers.forEach(answer => {
                    pointsTab.push(answer.point);
                })
                points = Math.max(...pointsTab);
            }else
            {
                points = 0;
                question.answers.forEach(answer => {
                    points += answer.point;
                })
            }
            completedForm.pointsByCategory.forEach(objectCategory => {
                if(question.categoryId === objectCategory.category.id){
                    objectCategory.maxPoints += points;
                    return;
                }
            })
        })

        //Check all questions have been answered
        if(questions.length === completedForm.answeredQuestions.length){
            setIsValidForm(true);

            //Set pointsByCategory
            //Add points from each question to the correct category
            completedForm.answeredQuestions.forEach(answeredQuestion => {
                completedForm.pointsByCategory.forEach(objectCategory => {
                    if(answeredQuestion.category === objectCategory.category.id){
                        objectCategory.points += answeredQuestion.points;
                        return;
                    }
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

                console.log(objectCategory.finalPoints)
            })

            console.log(completedForm);

            //Set the date and time when submitting the form
            const formDate = new Date();
            completedForm.dateTime = Timestamp.fromDate(formDate);

            addCompletedFormToFirestore(completedForm).then(completedFormRef => {
                if(completedFormRef != null){
                    console.log("ADD COMPLETED FORM SUCCESSFUL, id : " + completedFormRef.id);
                    console.log(completedForm.dateTime)
                    navigate("/history", {state: {formDate: formDate}})
                }
            });
        } else {
            //All answers aren't completed
            setIsValidForm(false);
        }
    }

    if(isLoading){
        return <div>Loading ...</div>
    }

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <FormContext.Provider value={handleFormInputChange}>
            <form onSubmit={handleFormSubmit}>
                {categories.map(category => (
                    <CategoryContainer key={category.id} category={category} questions={questions.filter(question => question.category.id === category.id)} isDisplayMode={false}/>
                ))}
                <FormError isValidForm={isValidForm}/>
                <button type="submit">Submit</button>
            </form>
        </FormContext.Provider>
    )
}
