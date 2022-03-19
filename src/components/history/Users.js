import {useEffect, useState} from "react";
import {collection, query, getDocs, getDoc, doc} from "firebase/firestore";
import {auth, db} from "../../config/initFirebase";
import {User} from "./User";
// Test page TODO: delete when no more needed
function Users(){
    const [users, setUsers] = useState([]);
    const [completedForms, setCompletedForms] = useState([])

    async  function getUsers(){
        let usersCollection = await getDocs(query(collection(db, "users")));
        let usersArray = usersCollection.docs.map((doc) => ({
            ...doc.data(), //Set all attributes found in a user
            id: doc.id, //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
        }))
        setUsers(usersArray);
    }

    useEffect(() => {
        getUsers();
        //getUser(auth.currentUser.uid); // TODO: to delete, is to test user connected
        //getUser('IqZpEaqXCn2xfcCjWCza').then(getCompletedForms('IqZpEaqXCn2xfcCjWCza'));
        },[]
    );

    return (
        <>
            <hr className="solid"/>
            <User/>
            <hr className="solid"/>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p>{user.name}</p>
                        {/*user.completedForms && <FormsCompletedContainer completedForms={user.completedForms}/>*/}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Users;
