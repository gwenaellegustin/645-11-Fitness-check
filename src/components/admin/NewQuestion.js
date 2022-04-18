import React, {useState} from "react";
import {Button, Modal} from "reactstrap";
import {MyModal} from "./MyModal";

export function NewQuestion() {
    const [modal, setModal] = useState(false);

    const handleModal = () => {
        setModal(!modal)
    }

    return (
        <>
            <Button color="success"
                    onClick={handleModal}>Ajouter une question</Button>
            <Modal isOpen={modal}
                   toggle={handleModal} animation="false">
                    <MyModal questionExisting={{label: "", uniqueAnswer: false}} handleModal={handleModal}/>
            </Modal>
        </>
    );
}