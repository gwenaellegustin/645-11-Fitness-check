import '../../styles/App.css';
import React, {useEffect, useState} from 'react';
import Chart from "./Chart";
import {doc, getDoc, query} from "firebase/firestore";
import {auth, db, getCompletedForms} from "../../config/initFirebase";
import {FormCompleted} from "./FormCompleted";
import {Link} from "react-router-dom";

export function History({justCompletedForm}){
    const [completedForms, setCompletedForms] = useState([])
    const [selectedForm, setSelectedForm] = useState();

    // Get all completed forms of a user
    useEffect(() => {
        getDoc(query(doc(db, "users", auth.currentUser.uid)))
            .then(u => getCompletedForms(u)
                .then(f => setCompletedForms(f)));

    }, [])

    // Dropdownlist
    useEffect(() =>{
        if (justCompletedForm){
            setSelectedForm(justCompletedForm)
        } else if(completedForms.length > 0 ){
            setSelectedForm(completedForms[0])
        }
    },[completedForms])

    const onchangeSelect = (e) => {
        setSelectedForm(completedForms.find(completedForm => completedForm.id === e.target.value))
    };

    function Dropdown() {
        return (
            <select
                value={selectedForm.id}
                onChange={onchangeSelect}
                >
                {completedForms.map(o => (
                    <option key={o.id} value={o.id}>
                        {(new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleDateString()
                        + " "
                        + (new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleTimeString()}
                    </option>
                ))}
            </select>
        );
    }

    // Loading screen
    if (selectedForm === null){
        return (
            <div className="App">
                <p>Loading...</p>
            </div>
        );
    }

    // No history screen
    if (completedForms.length === 0){
        return (
            <div className="History">
                <p>No history</p>
                <p>
                    <Link to="/form">Go To Form</Link>
                </p>
                <p>
                    <Link to="/">Go To Home</Link>
                </p>
            </div>
        )
    }

    // History screen
    return(
        <div className="row">
            <div className="column">
                {selectedForm && <><Dropdown/><FormCompleted key={selectedForm.id} completedForm={selectedForm}/></>}
            </div>
            <div className="column">
                {<Chart/>}
            </div>
        </div>
    )
}