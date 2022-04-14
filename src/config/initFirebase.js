// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    query,
    setDoc,
    updateDoc
} from "firebase/firestore";
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

export async function getUserByUID(userUID){
    console.log("Firestore called getUserByUID");

    let userDoc = await getDoc(doc(db, "users", userUID));
    return {
        ...userDoc.data(),
        id: userDoc.id,
        userRef: userDoc.ref
    };
}

export async function getForm(){
    console.log("Firestore called getForm");

    let formCollection = await getDocs(query(collection(db, "form")));
    let formArray = formCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))

    //There's only 1 form
    //console.log(formArray[0])

    return formArray[0];
}

export async function getAnswersByQuestion(questionRef){
    console.log("Firestore called getAnswers");

    //Get all answers for that question from database
    let answersCollection = await getDocs(query(collection(questionRef, "answers")));
    //Fill answers with objects containing all data from Firestore object + id
    return answersCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        answerRef: doc.ref
    }));
}

export async function getCategories(){
    console.log("Firestore called getCategories");

    //Get all categories from database
    let categoriesCollection = await getDocs(query(collection(db, "categories")));
    //Fill categories with objects containing all data from Firestore object + id
    return categoriesCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        categoryRef: doc.ref
    }));
}

export async function getCategoriesWithIds(categoriesId){
    console.log("Firestore called getCategoriesWithIds");

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
    console.log("Firestore called getQuestions");

    //Get all questions from database
    let questionsCollection = await getDocs(query(collection(db, "questions")));
    //Fill questions with objects containing all data from Firestore object + id
    return questionsCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }));
}

export async function getQuestionsWithIds(questionsId){
    console.log("Firestore called getQuestionsWithIds");

    const questions = [];

    for (const questionId of questionsId) {
        let questionDoc = await getDoc(doc(db, "questions", questionId));
        let question = {
            ...questionDoc.data(),
            id: questionDoc.id,
            questionRef: questionDoc.ref,
            categoryId: questionDoc.data().category.id
        }
        questions.push(question);
    }
    return questions;
}

export async function getCompletedForms(userRef){
    console.log("Firestore called getCompletedForms");

    let completedFormsCollection = await getDocs(query(collection(userRef, "completedForms")));
    return completedFormsCollection.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
    })).sort((a, b) => a.dateTime - b.dateTime);
}

export async function addCompletedFormToFirestore(userRef, completedForm){
    return await addDoc(collection(userRef, "completedForms"), completedForm);
}

export async function addQuestion(newQuestion){
    // Add the question in Firestore
    let questionAdded = await addDoc(collection(db, "questions"), newQuestion);

    // Add the new reference in Form collection
    //const form = doc(db, "form", "KbrDb6pas1c6hIbXxwx1");
    //await updateDoc(form, {
    //    questions: arrayUnion(questionAdded)
    //});
}


export async function editQuestion(editedQuestion){
    const docRef = doc(db, 'questions', editedQuestion.id);
    let documentQuestion = await getDoc(docRef);

    // Get data form reference question and edit label
    let questionToCreate = {
        ...documentQuestion.data(),
        label: editedQuestion.newLabel
    }

    // Add the question in Firestore
    let newQuestion = await addDoc(collection(db, "questions"), questionToCreate);

    // Get Answers of the model question
    let answers = await getAnswersByQuestion(docRef);
    // Add Answers to new question$
    for (const answer of answers) {
        let newAnswer = {
            label: answer.label,
            point: answer.point
        }
        await addDoc(collection(newQuestion, "answers"), newAnswer);
    }

    // Add the new reference in Form collection
    const form = doc(db, "form", "KbrDb6pas1c6hIbXxwx1");
    await updateDoc(form, {
        questions: arrayUnion(newQuestion)
    });
    // Delete the old reference in Form collection
    await updateDoc(form, {
        questions: arrayRemove(docRef)
    });

    return newQuestion;
}

export async function createUserFirestore(uid){
    // If a user is connected (so exist in Authentication), get the UID
    const docRef = doc(db, 'users', uid);
    let documentUser = await getDoc(docRef);
    // If the user doesn't exist in Firestore, creation
    if (!documentUser.exists()){
        await setDoc(doc(db, 'users', uid), {
            name: auth.currentUser.displayName,
            admin: false
        });
    }
}
