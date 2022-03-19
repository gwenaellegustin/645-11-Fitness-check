import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs, query} from "firebase/firestore";
import {auth, db, getCategories} from "../../config/initFirebase";

export function User(){
    const [categories, setCategories] = useState([]);
    const [questions, setQuestions] = useState([]);

    const [user, setUser] = useState([])
    let userDoc;
    const [completedForms, setCompletedForms] = useState([])


    // User
    useEffect(() => {
        async function getUser(){
            //userDoc = await getDoc(query(doc(db, "users", auth.currentUser.uid)));
            userDoc = await getDoc(query(doc(db, "users", 'IqZpEaqXCn2xfcCjWCza'))); //TODO: for test
            let user = {
                ...userDoc.data(), //Set all attributes found in a user
                id: userDoc.id, //The id isn't set on the user object in Firestore, it's the document that has it, used for key in <li>
            }
            setUser(user);
        }
        getUser().then(getCompletedForms);
    }, [])

    //Categories
    useEffect(() => {
        getCategories().then(r => setCategories(r));
    }, [])

    async function getCompletedForms(){
        let completedFormsCollection = await getDocs(query(collection(userDoc.ref, "completedForms")));
        let completedFormsArray = completedFormsCollection.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        }))
        setCompletedForms(completedFormsArray)
    }

    async function getCategory(idCategory){
        let categoryDoc = await getDoc(query(doc(db, "categories", idCategory)));
        let cat = {
            ...categoryDoc.data(),
            id: categoryDoc.id
        }
        return cat;
    }

    //Return a category container with only the questions related to this category (in order to sort it by category)
    //The filter method returns another array filling the condition (= true)
    return (
        <>
            <p>User id : IqZpEaqXCn2xfcCjWCza</p>
            <p>User name : {user.name}</p>
            <ul>
                {completedForms.map(completedForm => (
                    <li key={completedForm.id}>
                        <p>{completedForm.datetime.toLocaleString()}</p>
                        <ul>
                            {completedForm.pointsByCategory.map((pointsByCategory, index) => (
                                <li key={index}>
                                    <p>{pointsByCategory.category.id}</p>
                                    <p>{console.log(getCategory(pointsByCategory.category.id))}</p>
                                    <p>{pointsByCategory.points}</p>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </>
    )
}
