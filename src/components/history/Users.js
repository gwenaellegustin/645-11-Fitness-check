import {useEffect, useState} from "react";
import {collection, query, getDocs, getDoc, doc} from "firebase/firestore";
import {auth, db} from "../../config/initFirebase";
import {User} from "./User";
import {User2} from "./User2";
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
            <h1>Test with /questions/xtoQ5mbOMrhzyoAtXji9 for TEST 1 and TEST 2
                --------------> we have to create ansers collection inside question</h1>

            <h3>TEST 1: completedForms collection which contains a array of answer reference </h3>
            <User/>
            <hr className="solid"/>
            <h3>TEST 2: completedForms collection which contains a array answeredQuestions, each line contains a array of answers reference and the question </h3>
            <User2/>
            <hr className="solid"/>

            <h1>TEST 3 without subcollection</h1>
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
