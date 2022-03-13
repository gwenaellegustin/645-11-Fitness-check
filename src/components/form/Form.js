import {useEffect, useState} from "react";
import {collection, getDocs, query} from "firebase/firestore";
import {CategoryContainer} from "./CategoryContainer";
import {db} from "../../config/initFirebase";

export function Form(){
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        return await getDocs(query(collection(db, "categories")))
    }

    useEffect(() => {
        getCategories().then(response => {
            setCategories(response.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })))
        })
    }, [])

    return (
        <div>
            {categories.map(category => (
                <CategoryContainer key={category.id} category={category}/>
            ))}
        </div>
    )
}
