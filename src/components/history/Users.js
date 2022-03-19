import {useEffect, useState} from "react";
import {collection, query, getDocs, getDoc, doc} from "firebase/firestore";
import {auth, db} from "../../config/initFirebase";
import {FormCompletedContainer, FormsCompletedContainer} from "./FormsCompletedContainer";
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

    async function getUser(id){
        let user = await getDoc(query(doc(db, "users", id)));
        console.log(user.data())
    }

    async function getCompletedForms(userId){
        let user = await getDoc(query(doc(db, "users", userId)));
        let completedFormsCollection = await getDocs(query(collection(user.ref, "completedForms")));
        let completedFormsArray = completedFormsCollection.docs.map((doc) => ({
            ...doc.data(), //Set all attributes found in a user
            id: doc.id, //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
        }))
        setCompletedForms(completedFormsArray)
    }


    useEffect(() => {
        getUsers();
        //getUser(auth.currentUser.uid); // TODO: to delete, is to test user connected
        getUser('IqZpEaqXCn2xfcCjWCza').then(getCompletedForms('IqZpEaqXCn2xfcCjWCza'));
        },[]
    );

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <p>{user.name}</p>
                    <ul>
                        {completedForms.map(completedForm => (
                            <li key={completedForm.id}>
                                <p>{completedForm.datetime.toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                    {/*user.completedForms && <FormsCompletedContainer completedForms={user.completedForms}/>*/}
                </li>
            ))}
        </ul>
    )
}

export default Users;
