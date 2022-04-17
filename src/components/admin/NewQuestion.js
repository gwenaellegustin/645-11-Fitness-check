import React, {useContext, useState} from "react";
import {Button, Modal} from "reactstrap";
import {MyModal} from "./MyModal";
import {AdminContext} from "./Admin";

export function NewQuestion() {
    const [newQuestion] = useState({label: "", uniqueAnswer: false});
    const [modal, setModal] =useState(false);
    const {reload, forceReload } = useContext(AdminContext);

    // Toggle for MyModal
    const handleShowPopup = () => setModal(!modal);

    // After add, close the modal and reload the page (get info from Firestore)
    const handleReload = () => {
        forceReload(reload+1);
        setModal(!modal)
    }

    return (
        <>
            <Button color="success"
                    onClick={handleShowPopup}>Ajouter une question</Button>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                    <MyModal handleShowPopup={handleShowPopup} questionExisting={newQuestion} answersExisting={[]} handleReload={handleReload}/>
            </Modal>
        </>
    );
}