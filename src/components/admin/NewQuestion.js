
import React, {useState} from "react";
import {Button, Form, Modal,  ModalFooter, ModalHeader} from "reactstrap";

import {MyModalBody} from "./MyModalBody";

export function NewQuestion({categories}) {
    const [newQuestion] = useState({label: ""},{category:categories[0]});
    const [modal, setModal] =useState(false);
    const [answers, setAnswers] = useState([])

    // Toggle for MyModalBody
    const handleShowPopup = () => setModal(!modal);

    //Save
    const handleFormSubmit = e => {
        e.preventDefault();
        console.log(newQuestion)
        console.log(answers)
        //addQuestion(newQuestion)
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
                    <MyModalBody categories={categories} question={newQuestion} existingAnswers={answers}/>
                    <ModalFooter>
                        <Button color="danger" onClick={handleShowPopup}>Annuler</Button>
                        <Button color="primary" type="submit">Ajouter</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    );
}