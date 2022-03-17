import {Link} from "react-router-dom";
import {firebaseApp} from "../config/initFirebase";

export default function Home() {
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
            <p>
                <Link to="/chart">Go To Chart</Link>
            </p>
            <p>
                <Link to="/users">Go To users</Link>
            </p>
            <button onClick={handleSignOutClick}>Sign Out</button>
        </div>
    );
}
