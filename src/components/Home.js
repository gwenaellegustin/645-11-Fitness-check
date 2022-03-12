import { Link } from "react-router-dom";
import firebaseApp from "../config/initFirebase";
import {auth, db} from "./App";
import {doc, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
    // Create user in Firestore
    const handleCreateUserFirestore = async () => {
        if (auth.currentUser){
            const docRef = doc(db, 'users', auth.currentUser.uid);
            const documentUser = await getDoc(docRef);
            if (!documentUser.exists()){
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    name: auth.currentUser.displayName
                });
            }
        }
    };

    // Sign out
    const handleSignOutClick = async () => {
        await firebaseApp.auth().signOut();
    };

    return (
        <div>
            <h1>Welcome to the Fitness Check!</h1>
            <p>
                <Link to="/form">Go To Form</Link>
            </p>
            <button onClick={handleCreateUserFirestore}>Create user in Firestore</button>
            <button onClick={handleSignOutClick}>Sign Out</button>
        </div>
    );
}
