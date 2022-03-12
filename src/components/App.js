import '../styles/App.css';
import firebaseApp from "../config/initFirebase";
import {Route, Routes} from "react-router-dom";

import {useEffect, useState} from "react";
import Form from "./Form";
import Login from "./Login";
import Users from "./Users";
import Home from "./Home";
import {getFirestore} from "firebase/firestore";

export const db = getFirestore();

function App() {
    // Local signed-in state.
    const [isSignedIn, setIsSignedIn] = useState(null);

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user); // si il y a un user, met à true sinon à false
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
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/form" element={<Form />} />
                <Route path="/users" element={<Users />} /> // Test page TODO: delete when no more needed
            </Routes>
        </div>
    );
}

export default App;