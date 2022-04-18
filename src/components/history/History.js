import React, {createContext, useContext, useEffect, useState} from 'react';
import {getCategories, getCompletedForms} from "../../config/initFirebase";
import {FormCompletedContainer} from "./FormCompletedContainer";
import {Link} from "react-router-dom";
import {Button} from "reactstrap";
import {UserContext} from "../App";
import {Loading} from "../Loading";

export const HistoryContext = createContext("");

export function History(){
    const [completedForms, setCompletedForms] = useState("")
    const [selectedForm, setSelectedForm] = useState(null);
    const [categories, setCategories] = useState([]);

    const user = useContext(UserContext);

    //Categories
    useEffect(() => {
        getCategories().then(r => {
            setCategories(r)
        });
    }, [])

    // Get all completed forms of a user
    useEffect(() => {
        if(user !== undefined){
            getCompletedForms(user.userRef).then(f => setCompletedForms(f));
        }
    }, [user])

    // Dropdownlist
    useEffect(() =>{
         if(completedForms.length > 0 ) {
             setSelectedForm(completedForms[completedForms.length-1])
         }
    },[completedForms])

    const onchangeSelect = (e) => {
        setSelectedForm(completedForms.find(completedForm => completedForm.id === e.target.value))
    };

    function DateDropdown() {
        return (
            <select className="form-select form-select-lg w-auto mx-auto my-2"
                value={selectedForm.id}
                onChange={onchangeSelect}
                >
                {completedForms
                    .map(o => (
                    <option key={o.id} value={o.id}>
                        {o.dateTime.toDate().toLocaleDateString()
                            + " " +
                        o.dateTime.toDate().toLocaleTimeString()}
                    </option>
                ))}
            </select>
        );
    }

    if(completedForms !== "" && completedForms.length === 0){ // No history screen
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
    } else if(selectedForm === null){ // Loading screen
        return <Loading/>
    } else { // History screen
        return (
            <HistoryContext.Provider value={{categories}}>
                <h1>Votre historique</h1>
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <DateDropdown/>
                    </div>
                        <FormCompletedContainer className="col-lg-12 col-md-12" key={selectedForm.id} completedForm={selectedForm}/>
                    {/*formIsReady ?
                    <div className="col-lg-6 col-md-12">
                        <ChartContainer pointsByCategory={selectedForm.pointsByCategory}/>
                    </div>
                    : <Loading/>*/}
                </div>
            </HistoryContext.Provider>
        )
    }
}