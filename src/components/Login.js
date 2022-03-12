import firebaseApp from "../config/initFirebase";
import {StyledFirebaseAuth} from "react-firebaseui";
import firebase from "firebase/compat/app";

// Configure FirebaseUI.
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display email auth
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false,
    },

};

function Login(){
    return (
        <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebaseApp.auth()}
        />
    )
}

export default Login;
