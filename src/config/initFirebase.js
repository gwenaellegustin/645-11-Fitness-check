// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query} from "firebase/firestore";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();

export async function getCategories(){
    //Get all categories from database
    let categoriesCollection = await getDocs(query(collection(db, "categories")));
    //Fill categories with objects containing all data from Firestore object + id
    return categoriesCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export async function getCategoriesWithIds(categoriesId){
    const categories = [];

    for (const categoryId of categoriesId){
        let categoryDoc = await getDoc(doc(db, "categories", categoryId));
        let category = {
            ...categoryDoc.data(),
            id: categoryDoc.id
        }
        categories.push(category);
    }

    return categories;
}

export async function getQuestions(){
    //Get all questions from database
    let questionsCollection = await getDocs(query(collection(db, "questions")));
    //Fill questions with objects containing all data from Firestore object + id
    return questionsCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export async function getQuestionsWithIds(questionsId){
    const questions = [];

    for (const questionId of questionsId) {
        let questionDoc = await getDoc(doc(db, "questions", questionId));
        let question = {
            ...questionDoc.data(),
            id: questionDoc.id
        }
        questions.push(question);
    }
    return questions;
}

export async function getAnswer(answerPath){
    // answerPath is for example "/questions/xtoQ5mbOMrhzyoAtXji9/answers/jgs87lCWZTkwYvONFmxA"
    let answerDoc = await getDoc((doc(db, answerPath)));
    return {
        ...answerDoc.data(),
        id: answerDoc.id
    };
}

export async function getCompletedForms(userDoc){
    let completedFormsCollection = await getDocs(query(collection(userDoc.ref, "completedForms")));
    return completedFormsCollection.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }));
}

export async function getCompletedForm(userDoc){
    let completedFormDoc = await getDoc(doc(collection(userDoc.ref, "completedForms"), "DoekfjZKXmnfmemzJ70m"));
    return {
        ...completedFormDoc.data(),
        id: completedFormDoc.id
    };
}
