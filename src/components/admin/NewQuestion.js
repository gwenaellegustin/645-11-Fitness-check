
import React, {useState} from "react";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {addQuestion, db} from "../../config/initFirebase";
import {doc} from "firebase/firestore";

export function NewQuestion({categories}) {
    const [newQuestion] = useState({label: ""},{category:categories[0]});
    const [modal, setModal] =useState(false);
    const [newAnswerList, setNewAnswerList] = useState([]);
    const [answers, setAnswers] = useState([])

    // Toggle for Popup
    const handleShowPopup = () => setModal(!modal);

    //Categories
    const changeCategory = (e) => {
        console.log("category changed: "+ e)
        newQuestion.category = e;
    };

    //Label
    const changeLabel = (e) => {
        console.log("label changed: "+ e)
        newQuestion.label = e;
    }

    //Save
    const handleFormSubmit = e => {
        e.preventDefault();
        console.log(newQuestion.label)
        console.log(newQuestion.category)
        newQuestion.category = doc(db, 'categories', newQuestion.category);
        console.log(newQuestion)
        console.log(answers)
        //addQuestion(newQuestion)
    }

    const changeAnswerLabel = (index, value) => {
    //function changeAnswerLabel(index, value) {
        console.log(index + " " +value)
        console.log(answers[0])
        // https://stackoverflow.com/questions/55987953/how-do-i-update-states-onchange-in-an-array-of-object-in-react-hooks
        //setAnswers([...answers, ...answers[index].])
        //answers[index].answer.label = value;
    }

    const changeAnswerPoint = (index, value) => {
    //function changeAnswerPoint(index, value) {
        console.log(index + " " +value)
        console.log(answers[0])
        //answers[id].answer.point = value;
    }

    //New answer
    function handleAddAnswer() {
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} id={newAnswerList.length}/>));
        let answer = {
            id: newAnswerList.length,
            label: "",
            point: 0
        }
        setAnswers(list => [...list, answer])
        console.log(answers)
    }
    function NewAnswer({index})  {
        return <>
            <FormGroup className="col-10">
                <Input type="text" onChange={e => changeAnswerLabel(index, e.target.value)}/>
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number" onChange={e => changeAnswerPoint(index, e.target.value)}/>
            </FormGroup>
        </>;
    }

    return (
        <>
            <Button color="success"
                    onClick={handleShowPopup}>Ajouter une question</Button>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader>
                        Ajouter une question
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label tag="h5" for="category">Categorie</Label>
                            <Input type="select"
                                   onChange={e => changeCategory(e.target.value)}>
                                {categories
                                    .map(o => (
                                            <option key={o.id} value={o.id}>
                                                {o.label}
                                            </option>
                                    ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label  tag="h5" for="exampleText">Question</Label>
                            <Input type="textarea" onInput={e => changeLabel(e.target.value)}/>
                        </FormGroup>
                        <div className='row'>
                            <div className="col-10">
                                <Label  tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                            </div>
                            <div className="col-2">
                                <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                            </div>
                            {newAnswerList}
                            <Button color="success" style={{width:'auto', margin:'auto'}}
                                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleShowPopup}>Annuler</Button>
                        <Button color="primary" type="submit">Sauvegarder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    );
}