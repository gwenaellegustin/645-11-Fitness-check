import {useEffect, useState} from "react";
import {collection, query, getDocs} from "firebase/firestore";
import {db} from "../config/initFirebase";
// Test page TODO: delete when no more needed
function Users(){
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        return await getDocs(query(collection(db, "users")))
    }

    useEffect(() => {
        getUsers().then(response => {
            setUsers(response.docs.map((doc) => ({
                ...doc.data(), //Set all attributes found in a user
                id: doc.id //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
            })))
        })},[]
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
