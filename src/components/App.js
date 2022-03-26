import '../styles/App.css';
import {auth, db, firebaseApp} from "../config/initFirebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Route, Routes} from "react-router-dom";
import { Navbar } from 'reactstrap'; // DOC: https://reactstrap.github.io/?path=/docs/components-navbar--navbar
import {useEffect, useState} from "react";
import {Form} from "./form/Form";
import Login from "./Login";
import Home from "./Home";
import {History} from "./history/History";

export let documentUser;

let createUserFirestore = async (uid) => {
    // If a user is connected (so exist in Authentication), get the UID
        const docRef = doc(db, 'users', uid);
        documentUser = await getDoc(docRef);
        // If the user doesn't exist in Firestore, creation
        if (!documentUser.exists()){
            await setDoc(doc(db, 'users', uid), {
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
                if(user !== null){
                    createUserFirestore(user.uid)
                }
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
                <Route path="/history" element={<History />} />
            </Routes>
        </div>
    );
}

export default App;
