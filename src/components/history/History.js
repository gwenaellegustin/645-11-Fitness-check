import '../../styles/App.css';
import React, {useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async'
import Chart from "./Chart";
import {doc, getDoc, query} from "firebase/firestore";
import {auth, db, getCompletedForms} from "../../config/initFirebase";
import {FormCompleted} from "./FormCompleted";
import {Link} from "react-router-dom";
import Select from "react-select/base";

export function History(){
    const [completedForms, setCompletedForms] = useState([])
    const [selectedForm, setSelectedForm] = useState();

    // Get all completed froms of a user
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

    const onchangeSelect = (e) => {
        // TODO: update the value shown on the dropdown
        setSelectedForm(completedForms.find(completedForm => completedForm.id === e.target.value))
    };

    function Dropdown() {
        return (
            <select
                value={selectedForm}
                onChange={onchangeSelect}>
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

    // This is not working, but perhaps better to use Select from react than select from html
    function DropdownReact() {
        return (
            <Select
                value={selectedForm}
                onChange={onchangeSelect}
                options={completedForms}
                getOptionValue={(option) => option.id}
                getOptionLabel={(o) =>
                    (new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleDateString()
                    + " "
                    + (new Date(o.dateTime.seconds * 1000 + o.dateTime.nanoseconds/1000)).toLocaleTimeString()
            }
            />
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
                <p><b>DON'T CLICK ON SECOND DROPDOWN</b></p>
                <Dropdown/>
                <DropdownReact/>
                {selectedForm && <FormCompleted key={selectedForm.id} completedForm={selectedForm}/>}
            </div>
            <div className="column">
                {<Chart/>}
            </div>
        </div>
    )
}