import '../styles/App.css';
import firebase from "firebase/compat/app";
import firebaseApp from "../config/initFirebase";
import {Route, Routes} from "react-router-dom";
import {StyledFirebaseAuth} from "react-firebaseui";
import {useEffect, useState} from "react";
import {Form} from "./form/Form";
import Login from "./Login";
import Users from "./Users";
import Home from "./Home";


// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    },
};

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
                <StyledFirebaseAuth
                    uiConfig={uiConfig}
                    firebaseAuth={firebaseApp.auth()}
                />
            </div>
        );

    // Signed in - Render app
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/form" element={<Form />} />
            </Routes>
        </div>
    );
}

export default App;
