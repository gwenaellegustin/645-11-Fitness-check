import '../styles/App.css';
import Form from "./Form";
import Login from "./Login";

import { onSnapshot, collection } from "firebase/firestore";
import {useEffect} from "react";
import {useState} from "react";
import db from "../config/firebase"

function App() {
    const isLogged = true;
    let componentToDisplay;

    // test Firestore
    const [users, setUsers] = useState([]);
    useEffect(
        () =>
        onSnapshot(collection(db, "users"),(snapshot) =>
            setUsers(snapshot.docs.map((doc) => doc.data()))
            ),
        []
    );

    if (!isLogged) {
        componentToDisplay = <Login/>
    } else {
        componentToDisplay = <Form/>
    }

    return (
        <div className="App">
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <p>{user.name}</p>
                    </li>
                ))}
            </ul>
            <header className="App-header">
                {componentToDisplay}
            </header>
        </div>
    );
}
// Get a list of cities from your database
/*function getUsers(db) {
    const usersCol = collection(db, 'users');
    const userSnapshot = getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => doc.data());
    console.log(userList)
    //return userList;
}*/
export default App;
