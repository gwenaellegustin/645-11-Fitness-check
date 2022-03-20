import '../styles/App.css';
import React, {useEffect, useState} from 'react';
import {FormCompletedContainer} from "./history/FormCompletedContainer";
import Chart from "./Chart";
import {doc, getDoc, query} from "firebase/firestore";
import {auth, db, getCompletedForms} from "../config/initFirebase";

export function History(){
    const [completedForms, setCompletedForms] = useState()


    // CompletedForms
    useEffect(() => {
        getDoc(query(doc(db, "users", auth.currentUser.uid)))
            .then(u => getCompletedForms(u)
                .then(f => setCompletedForms(f)));
    }, [])

    return(
        <div className="row">
            <div className="column">
                <select>
                    {completedForms && completedForms.length > -1 && completedForms.map(completedForm => (
                        <option
                            key={completedForm.id}
                            value={completedForm.datetime}
                        >
                            {completedForm.datetime}
                        </option>
                    ))}
                </select>
                {completedForms && completedForms.length > -1  && <FormCompletedContainer completedForm={completedForms[0]}/>}</div>
            <div className="column">{<Chart></Chart>}</div>
        </div>
    )
}