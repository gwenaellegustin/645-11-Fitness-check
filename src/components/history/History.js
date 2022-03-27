import React, {useEffect, useState} from 'react';
import {ChartContainer} from "./ChartContainer";
import {doc, getDoc, query} from "firebase/firestore";
import {auth, db, getCompletedForms} from "../../config/initFirebase";
import {FormCompletedContainer} from "./FormCompletedContainer";
import {Link} from "react-router-dom";
import {Button, Col, Row} from "reactstrap";

export function History({justCompletedForm}){
    const [completedForms, setCompletedForms] = useState([])
    const [selectedForm, setSelectedForm] = useState(null);

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
                <p>Chargement...</p>
            </div>
        );
    }

    // No history screen
    if (completedForms.length === 0){
        return (
            <div className="History">
                <p>Pas d'historique</p>
                <p>
                    <Link to="/form">
                        <Button color="primary">
                            Questionnaire
                        </Button>
                    </Link>
                </p>
                <p>
                    <Link to="/">
                        <Button color="primary">
                            Home
                        </Button>
                    </Link>
                </p>
            </div>
        )
    }

    // History screen
    return(
        <>
            <h1>Votre historique</h1>
            <Row>
                <Col className=".col-6">
                    {selectedForm && <><Dropdown/><FormCompletedContainer key={selectedForm.id} completedForm={selectedForm}/></>}
                </Col>
                <Col className=".col-6 p-5">
                    {selectedForm && <ChartContainer pointsByCategory={selectedForm.pointsByCategory}/>}
                </Col>
            </Row>
        </>
    )
}