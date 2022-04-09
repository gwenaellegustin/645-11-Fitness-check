
import {auth, db, firebaseApp, getUserByUID} from "../config/initFirebase";
import {doc, getDoc, setDoc} from "firebase/firestore";
import {Route, Routes} from "react-router-dom";
import {Nav,Navbar,NavbarBrand,NavLink} from 'reactstrap';
import {createContext,  useEffect, useState} from "react";
import {FitnessForm} from "./form/FitnessForm";
import Login from "./Login";
import Home from "./Home";
import {History} from "./history/History";
import {NavDropdown} from "react-bootstrap";
import {Admin} from "./Admin";

export let documentUser;
export const UserContext = createContext()

let createUserFirestore = async (uid) => {
    // If a user is connected (so exist in Authentication), get the UID
        const docRef = doc(db, 'users', uid);
        documentUser = await getDoc(docRef);
        // If the user doesn't exist in Firestore, creation
        if (!documentUser.exists()){
            await setDoc(doc(db, 'users', uid), {
                name: auth.currentUser.displayName,
                admin: false
            });
        }
}

function App() {
    const [user, setUser] = useState();

    // Local signed-in state.
    const [isSignedIn, setIsSignedIn] = useState(null);

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp
            .auth()
            .onAuthStateChanged( async (user) => {
                setIsSignedIn(!!user); // if there is a user, set to true
                if (user !== null){
                    // Create user in Firestore if not already exist
                    createUserFirestore(user.uid);
                    await getUserByUID(user.uid).then(u => setUser(u));
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
        <UserContext.Provider value={user}>
        <div className="col-md-12" >
            <Navbar color="light" light  expand="md">
                <NavbarBrand href="/">
                   Fitness check
                </NavbarBrand>
                <Nav
                    className="me-auto"
                    navbar
                >
                    <NavLink href="/Form">
                        Nouveau formulaire
                    </NavLink>

                    <NavLink href="/History">
                        Historique
                    </NavLink>
                    {user && user.admin ?
                        <NavLink href="/Admin">
                            Gestion
                        </NavLink> : null}
                </Nav>
                <NavDropdown title={auth.currentUser.displayName}>
                    <NavDropdown.Item onClick={handleSignOutClick}>Se déconnecter</NavDropdown.Item>
                </NavDropdown>
            </Navbar>

            <div className="px-3 m-3 text-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/form" element={<FitnessForm />} />
                    <Route path="/history" element={<History />} />
                    {user && user.admin ?
                        <Route path="/admin" element={<Admin />} /> : null}
                </Routes>
            </div>
        </div>
        </UserContext.Provider>
    );
}

export default App;
