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

// Db path
const dbForm = "form" // change in testfrom for test data
const dbQuestions = "questions" // change in testquestions for test data

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

function addAnswers(questionRef, answers){
    let updatedAnswers = [];

    // Add Answers to new question
    let isAllAnswersAdded = answers.every(async answer => {
        let newAnswer = {
            label: answer.label,
            point: parseInt(answer.point)
        }
        let answerRef = await addDoc(collection(questionRef, "answers"), newAnswer);
        let answerDoc = await getDoc(answerRef);

        if(answerDoc != null){
            updatedAnswers.push({
                ...answerDoc.data(),
                id: answerDoc.id,
                answerRef: answerDoc.ref
            })

            return true; //continue if answer added in firestore
        }

        return false; //Stop if the answer isn't added in firestore
    })

    if(isAllAnswersAdded){
        return updatedAnswers;
    }

    return null;
}

async function getAnswersByQuestion(questionRef){
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

    let formCollection = await getDocs(query(collection(db, dbForm)));
    let formArray = formCollection.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        formRef: doc.ref
    }))

    //There's only 1 form
    //console.log(formArray[0])

    return formArray[0];
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

export async function getQuestionsWithIds(questionsId){
    console.log("Firestore called getQuestionsWithIds");
    const questions = [];
    for (const questionId of questionsId) {
        let questionDoc = await getDoc(doc(db, dbQuestions, questionId));
        let question = {
            ...questionDoc.data(),
            id: questionDoc.id,
            questionRef: questionDoc.ref,
            categoryId: questionDoc.data().category.id
        }

        question.answers = await getAnswersByQuestion(questionDoc.ref);

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

export async function deleteQuestionFirestore(question){
    console.log("Firestore called deleteQuestion");

    const docRef = doc(db, dbQuestions, question.id);
    const form = (await getForm()).formRef;
    await updateDoc(form, {
        questions: arrayRemove(docRef)
    });
    return docRef;
}

export async function addQuestionFirestore(newQuestion, answers){
    console.log("Firestore called addQuestionFirestore");

    // Get only information required for Firestore
    let questionToCreate = {
        label: newQuestion.label,
        category: newQuestion.category,
        uniqueAnswer: newQuestion.uniqueAnswer
    }

    // Add the question in Firestore
    let questionRef = await addDoc(collection(db, dbQuestions), questionToCreate);

    let updatedQuestion = null;

    if(questionRef != null){
        let updatedAnswers = addAnswers(questionRef, answers);

        if(updatedAnswers != null){
            // Add the new reference in Form collection
            const form = (await getForm()).formRef;

            await updateDoc(form, {
                questions: arrayUnion(questionRef)
            });

            let questionDoc = await getDoc(questionRef);

            updatedQuestion = {
                ...updatedQuestion,
                ...questionDoc.data(),
                id: questionDoc.id,
                questionRef: questionDoc.ref,
                answers: updatedAnswers
            }
        }
    }

    return updatedQuestion;
}

export async function editQuestionFirestore(editedQuestion, answers){
    console.log("Firestore called editQuestion");
    const editedQuestionRef = doc(db, dbQuestions, editedQuestion.id);

    // Get data form reference question and edit label
    let questionToCreate = {
        label: editedQuestion.label,
        category: editedQuestion.category,
        uniqueAnswer: editedQuestion.uniqueAnswer
    }

    // Add the question in Firestore
    let questionRef = await addDoc(collection(db, dbQuestions), questionToCreate);

    let updatedQuestion = null;

    if(questionRef != null){
        let updatedAnswers = addAnswers(questionRef, answers);

        if(updatedAnswers != null){
            // Add the new reference in Form collection
            const form = (await getForm()).formRef;

            await updateDoc(form, {
                questions: arrayUnion(questionRef)
            });

            // Delete the old reference in Form collection
            await updateDoc(form, {
                questions: arrayRemove(editedQuestionRef)
            });

            let questionDoc = await getDoc(questionRef);

            updatedQuestion = {
                ...updatedQuestion,
                ...questionDoc.data(),
                id: questionDoc.id,
                questionRef: questionDoc.ref,
                answers: updatedAnswers
            }
        }
    }

    return updatedQuestion;
}

export async function createUserFirestore(uid){
    // If a user is connected (so exist in Authentication), get the UID
    const docRef = doc(db, "users", uid);
    let documentUser = await getDoc(docRef);
    // If the user doesn't exist in Firestore, creation
    if (!documentUser.exists()){
        await setDoc(doc(db, "users", uid), {
            name: auth.currentUser.displayName,
            admin: false
        });
    }
}