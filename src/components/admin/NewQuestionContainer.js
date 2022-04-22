import React, {useState} from "react";
import {Button, Modal} from "reactstrap";
import {MyModal} from "./MyModal";

/**
 * Button add question with modal call
 *
 * @author Gwenaëlle
 */
export function NewQuestionContainer() {
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