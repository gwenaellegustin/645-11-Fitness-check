// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query} from "firebase/firestore";
import {getAuth} from "firebase/auth";
import {useState} from "react";
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
    let categoriesArray = categoriesCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return categoriesArray;
}

export async function getCategory(idCategory){
    let categoryDoc = await getDoc(query(doc(db, "categories", idCategory)));
    let category = {
        ...categoryDoc.data(),
        id: categoryDoc.id
    }
    return category;
}

export async function getQuestion(idQuestion){
    let questionDoc = await getDoc(query(doc(db, "questions", idQuestion)));
    let question = {
        ...questionDoc.data(),
        id: questionDoc.id
    }
    return question;
}

export async function getAnswer(path){
    let answerDoc = await getDoc(query(doc(db, path)));
    let answer = {
        ...answerDoc.data(),
        id: answerDoc.id
    }
    return answer;
}

export async function getCompletedForms(user2){
    let userDoc;
    // TODO: delete for test
    if (user2){
         userDoc = await getDoc(query(doc(db, "users", 'IqZpEaqXCn2xfcCjWCza')));
    } else {
         userDoc = await getDoc(query(doc(db, "users", auth.currentUser.uid)));
    }

    let completedFormsCollection = await getDocs(query(collection(userDoc.ref, "completedForms")));
    let completedFormsArray = completedFormsCollection.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    }))
    return completedFormsArray;
}
