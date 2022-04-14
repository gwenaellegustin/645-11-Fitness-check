
import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {getCategories} from "../../config/initFirebase";

export function NewQuestion() {
    const [categories, setCategories] = useState([]);
    const [newQuestion] = useState({label: ""},{category:categories[0]});
    const [modal, setModal] =useState(false);
    const [newAnswerList, setNewAnswerList] = useState([]);

    // Toggle for Modal
    const toggle = () => setModal(!modal);

    //Categories
    useEffect(() => {
        getCategories().then(r => {
            setCategories(r);
        });
    }, [])
    const changeCategory = (e) => {
        newQuestion.category = e.value;
    };

    //Label
    const changeLabel = (e) => {
        newQuestion.label = e;
    }

    //Save
    const handleFormSubmit = e => {
        e.preventDefault();
        console.log(newQuestion)
    }

    //New answer
    const NewAnswer = () => {
        return <>
            <FormGroup className="col-10">
                <Input type="text" />
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number"/>
            </FormGroup>
        </>;
    };
    function handleAddAnswer() {
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} />));
    }

    return (
        <>
            <Button color="success"
                    onClick={toggle}>Ajouter une question</Button>
            <Modal isOpen={modal}
                   toggle={toggle}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader>
                        Ajouter une question
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label tag="h5" for="category">Categorie</Label>
                            <Input type="select"
                                   onChange={changeCategory}>
                                {categories
                                    .map(o => (
                                        <option key={o.id} value={o.id}>
                                            {o.label + " (Haut est bien: " + o.highIsGood + ")"}
                                        </option>
                                    ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label  tag="h5" for="exampleText">Question</Label>
                            <Input type="textarea" onInput={e => changeLabel(e.target.value)}/>
                        </FormGroup>
                        <FormGroup className='row'>
                            <FormGroup className="col-10">
                                <Label  tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                            </FormGroup>
                            <FormGroup className="col-2">
                                <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                            </FormGroup>
                            {newAnswerList}
                            <Button color="success" style={{width:'auto', margin:'auto'}}
                                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={toggle}>Annuler</Button>
                        <Button color="primary" type="submit">Sauvegarder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    );
}