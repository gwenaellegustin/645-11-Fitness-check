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
        //setCurrentCountry(null);
        //setRegion(item);
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

    if (completedForms === null){
        return (
            <div className="App">
                <p>Loading...</p>
            </div>
        );
    }

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


    return(
        <div className="row">
            <div className="column">
                <Dropdown/>
                <DropdownReact/>
                {selectedForm && <FormCompleted key={selectedForm.id} completedForm={selectedForm}/>}
            </div>
            <div className="column">{<Chart/>}</div>
        </div>
    )
}