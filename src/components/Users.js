import {useEffect, useState} from "react";
import {collection, onSnapshot} from "firebase/firestore";
import db from "../config/Firebase";

function Users(){
    const [users, setUsers] = useState([]);

    useEffect(
        () =>
            onSnapshot(collection(db, "users"),(snapshot) =>
                setUsers(snapshot.docs.map((doc) => doc.data()))
            ),
        []
    );
    
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>
                    <p>{user.name}</p>
                </li>
            ))}
        </ul>
    )
}

export default Users;
