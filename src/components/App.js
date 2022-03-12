import '../styles/App.css';
import firebaseApp from "../config/initFirebase";
import {Route, Routes} from "react-router-dom";
import { Navbar } from 'reactstrap'; // DOC: https://reactstrap.github.io/?path=/docs/components-navbar--navbar

import {useEffect, useState} from "react";
import Form from "./Form";
import Login from "./Login";
import Users from "./Users";
import Home from "./Home";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

export const db = getFirestore();

function App() {
    const auth = getAuth();

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
    if (!isSignedIn)
        return (
            <div className="App">
                <Login/>
            </div>
        );

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
            </Routes>
        </div>
    );
}

export default App;