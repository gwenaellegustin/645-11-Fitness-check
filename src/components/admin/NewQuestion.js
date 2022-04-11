
import React, {useEffect, useRef, useState} from "react";
import {Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {getCategories} from "../../config/initFirebase";

export function NewQuestion() {
    const [categories, setCategories] = useState([]);
    const [newQuestion] = useState({label: ""},{category:categories[0]});

    const onButtonClick = () => {
        console.log(newQuestion)
    };

    // Modal open state
    const [modal, setModal] =useState(false);
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

    const changeLabel = (e) => {
        newQuestion.label = e;
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        console.log(newQuestion)
    }

    return (
        <>
            <Button color="primary"
                    onClick={toggle}>Add question</Button>
            <Modal isOpen={modal}
                   toggle={toggle}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader>
                        Ajouter une question
                    </ModalHeader>
                    <ModalBody>

                            <FormGroup>
                                <Label for="category">Categorie</Label>
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
                                <Label for="exampleText">Question</Label>
                                <Input type="textarea" onInput={e => changeLabel(e.target.value)}/>
                            </FormGroup>
                            <FormGroup className='row'>
                                <FormGroup className="col-10">
                                    <Label for="answer1" className="mr-sm-1">Réponse</Label>
                                    <Input type="text" name="answer1" id="answer1"/>
                                </FormGroup>
                                <FormGroup className="col-2">
                                    <Label for="point1" className="mr-sm-1">Valeur</Label>
                                    <Input type="number" name="point1" id="point1" />
                                </FormGroup>
                                <FormGroup className="col-10">
                                    <Input type="text" name="answer2" id="answer2"/>
                                </FormGroup>
                                <FormGroup className="col-2">
                                    <Input type="number" name="point2" id="point2" />
                                </FormGroup>
                                <FormGroup className="col-10">
                                    <Input type="text" name="answer3" id="answer3"/>
                                </FormGroup>
                                <FormGroup className="col-2">
                                    <Input type="number" name="point3" id="point3" />
                                </FormGroup>
                                <FormGroup className="col-10">
                                    <Input type="text" name="answer4" id="answer4"/>
                                </FormGroup>
                                <FormGroup className="col-2">
                                    <Input type="number" name="point4" id="point4" />
                                </FormGroup>
                                <FormGroup className="col-10">
                                    <Input type="text" name="answer3" id="answer5"/>
                                </FormGroup>
                                <FormGroup className="col-2">
                                    <Input type="number" name="point5" id="point5" />
                                </FormGroup>

                            </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" />{' '}
                                Réponse unique
                            </Label>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">Save changes</Button>
                    </ModalFooter>
            </Form>
            </Modal>
        </>
    );
}