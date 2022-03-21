import '../styles/App.css';
import React, {useEffect, useState, Fragment } from 'react';
import {FormCompletedContainer} from "./history/FormCompletedContainer";
import Chart from "./Chart";
import {doc, getDoc, query} from "firebase/firestore";
import {auth, db, getCompletedForms} from "../config/initFirebase";

export function History(){
    const [completedForms, setCompletedForms] = useState([])
    const [selectedForm, setSelectedForm] = useState();


    // CompletedForms
    useEffect(() => {
        getDoc(query(doc(db, "users", auth.currentUser.uid)))
            .then(u => getCompletedForms(u)
                .then(f => setCompletedForms(f)));

    }, [])

    // Dropdownlist
    useEffect(() =>{
        if (completedForms.length > 0 ){
            setSelectedForm(completedForms[0])
        }
    },[completedForms])

    /*const HandleOnChangeDropdown = e => {
        setSelectedForm(e.target.value)
    } */

    function Dropdown() {
        return (
            <select
                value={selectedForm}
                onChange={e => setSelectedForm(completedForms.find(completedForm => completedForm.id === e.target.value))}>
                {completedForms.map(o => (
                    <option key={o.id} value={o.id}>
                        {(new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleDateString()
                        + " "
                        + (new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleTimeString()}
                    </option>
                ))}
            </select>
        );
    };

    return(
        <div className="row">
            <div className="column">
                {/*<Dropdown completedForms={completedForms} selectedOption={selectedOption} onChange={HandleOnChangeDropdown}/>*/}
                <Dropdown></Dropdown>
                {selectedForm  && <FormCompletedContainer completedForm={selectedForm}/>}
            </div>
            <div className="column">{<Chart></Chart>}</div>
        </div>
    )
}

function Dropdown({completedForms, selectedOption, onChange}) {

    return (
        <select
            value={selectedOption}
            onChange={onChange}>
            {completedForms.map((o) => (
                <option key={o.id} value={o.id}>{(new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleDateString()}</option>
            ))}
        </select>
    );
}