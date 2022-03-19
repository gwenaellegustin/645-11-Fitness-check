// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {collection, getDocs, getFirestore, query} from "firebase/firestore";
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
