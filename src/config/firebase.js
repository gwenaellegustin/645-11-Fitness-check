// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjFinschyWco3_1oaoSc68aMHPa9hwCfY",
    authDomain: "fitnesscheck-4820e.firebaseapp.com",
    databaseURL: "https://fitnesscheck-4820e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fitnesscheck-4820e",
    storageBucket: "fitnesscheck-4820e.appspot.com",
    messagingSenderId: "234255121985",
    appId: "1:234255121985:web:7f891cba7d8633bf9410c0",
    measurementId: "G-7MJ39EHPTL"
};

const app = initializeApp(firebaseConfig);
export default getFirestore();
