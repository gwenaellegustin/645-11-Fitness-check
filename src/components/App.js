import '../styles/App.css';
import firebase from "firebase/compat/app";
import firebaseApp from "../config/initFirebase";
import {Route, Routes} from "react-router-dom";
import {StyledFirebaseAuth} from "react-firebaseui";
import {useEffect, useState} from "react";
import Form from "./Form";
import Chart from "./Chart";
import Login from "./Login";
import Users from "./Users";
import Home from "./Home";

export const db = getFirestore();
export const auth = getAuth();

let createUserFirestore = async () => {
    // If a user is connected (so exist in Authentication), get the UID
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const documentUser = await getDoc(docRef);
        // If the user doesn't exist in Firestore, creation
        if (!documentUser.exists()){
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                name: auth.currentUser.displayName
            });
        }
}

function App() {
    // Local signed-in state.
    const [isSignedIn, setIsSignedIn] = useState(null);

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user); // if there is a user, set to true
            });
        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unregisterAuthObserver();
    }, []);

    // Not initialized yet - Render loading message
    if (isSignedIn === null) {
        return (
            <div className="App">
                <p>Loading...</p>
            </div>
        );
    }

    // Not signed in - Render auth screen
    if (!isSignedIn){
        return (
            <div className="App">
                <Login/>
            </div>
        );
    // Signed in - Create user in Firestore if not already exist
    } else {
        createUserFirestore().then(r =>{} ) // TODO: obligé de mettre en async
        // TODO: ne devrait pas aller plus loin avant création dans firestore ?
        // TODO: je n'arrive pas à mettre ca dans le use effect de App
    }


    // Signed in - Render app
    return (
        <div className="App">
            <Navbar>
                <p>UID current user : {auth.currentUser.uid}</p>
            </Navbar>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/form" element={<Form />} />
                <Route path="/users" element={<Users />} /> // Test page TODO: delete when no more needed
                <Route path="/chart" element={<Chart />} />
            </Routes>
        </div>
    );
}

export default App;