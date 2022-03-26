
import {auth, db, firebaseApp} from "../config/initFirebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Route, Routes} from "react-router-dom";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Navbar,
    NavbarBrand,
    UncontrolledDropdown
} from 'reactstrap';
import {useEffect, useState} from "react";
import {FitnessForm} from "./form/Form";
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
                    // Create user in Firestore if not already exist
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
                <p>Chargement...</p>
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
    }

    // Sign out
    const handleSignOutClick = async () => {
        await firebaseApp.auth().signOut();
    };


    // Signed in - Render app
    return (
        <div className="col-md-12" >
            <Navbar color="light" light>
                <NavbarBrand href="/">
                   Fitness check
                </NavbarBrand>
                <UncontrolledDropdown inNavbar>
                <DropdownToggle caret >
                    {auth.currentUser.displayName}
                </DropdownToggle>
                <DropdownMenu end>
                    <DropdownItem onClick={handleSignOutClick}>
                        Se déconnecter
                    </DropdownItem>
                </DropdownMenu>
                </UncontrolledDropdown>
            </Navbar>
            <div className="px-5 m-3 text-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/form" element={<FitnessForm />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
