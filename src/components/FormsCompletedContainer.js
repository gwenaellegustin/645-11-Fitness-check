import {AnsweredQuestionContainer} from "./AnsweredQuestionContainer";
import {collection, getDoc, getDocs, query} from "firebase/firestore";
import {db} from "../config/initFirebase";

export function FormsCompletedContainer({completedForms}){

    async  function getQuestion(id){
        let questionDoc = await getDoc(query(db, "questions", id));
        let question = questionDoc.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))

        console.log(question.label);
       return question;
    }

    async function getQuestions(){
        //Get all questions from database
        let questionsCollection = await getDocs(query(collection(db, "questions")));
        //Fill questions with objects containing all data from Firestore object + id
        let questionsArray = questionsCollection.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }))
        return questionsArray
    }

    //Return a question container with the question object (containing the label, answers, isUniqueAnswer)
    return (
        <ul>
            {completedForms.length>0 && completedForms.map((form, index) => (
                <li key={index}>
                    <p>{form.datetime.toLocaleString()}</p>
                    {form.questions.map(question => (
                        <AnsweredQuestionContainer key={question.id} question={getQuestions()}/>
                    ))}
                </li>
            ))}
        </ul>
    )
}