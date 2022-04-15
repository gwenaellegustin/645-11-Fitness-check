
import React, {useState} from "react";
import {Button, Modal} from "reactstrap";

import {MyModal} from "./MyModal";

export function NewQuestion({categories}) {
    const [newQuestion] = useState({label: ""});
    const [modal, setModal] =useState(false);

    // Toggle for MyModal
    const handleShowPopup = () => setModal(!modal);

    return (
        <>
            <Button color="success"
                    onClick={handleShowPopup}>Ajouter une question</Button>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                    <MyModal handleShowPopup={handleShowPopup} categories={categories} question={newQuestion} existingAnswers={[]}/>
            </Modal>
        </>
    );
}