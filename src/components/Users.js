import {useEffect, useState} from "react";
import {collection, query, getDocs} from "firebase/firestore";
import {db} from "../config/initFirebase";
import {FormCompletedContainer, FormsCompletedContainer} from "./FormsCompletedContainer";
// Test page TODO: delete when no more needed
function Users(){
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async  function getUsers(){
            let usersCollection = await getDocs(query(collection(db, "users")));
            let usersArray = usersCollection.docs.map((doc) => ({
                ...doc.data(), //Set all attributes found in a user
                id: doc.id, //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
            }))
            setUsers(usersArray);
        }
        getUsers();
        },[]
    );

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <p>{user.name}</p>
                    {user.completedForms && <FormsCompletedContainer completedForms={user.completedForms}/>}
                </li>
            ))}
        </ul>
    )
}

export default Users;
