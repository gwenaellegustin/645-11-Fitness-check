
import React, {useState} from "react";
import {
    Button, Card, CardBody,CardTitle,
    Form,
    Modal,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {db, deleteQuestion, editQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";
import {MyModalBody} from "./MyModalBody";

export function EditQuestionContainer({categories, question}) {
    const [editedQuestion] = useState(question);
    const [modal, setModal] =useState(false);
    const [answers, setAnswers] = useState([]);

    // Toggle for Popup
    const handleShowPopup = () => {
        if (!modal) {
            getAnswersByQuestion(editedQuestion.questionRef).then(r => {
                setAnswers(r);
            })
        }
        setModal(!modal)
    };

    //Save
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(editedQuestion.label)
        console.log(editedQuestion.category)
        console.log(editedQuestion)
        console.log(answers.length)
        //editQuestion(editedQuestion)
    }

    const handleDelete = (id) => {
        console.log(id)
        //deleteQuestion(question)
    }

    return (
        <div>
            <Card key={editedQuestion.id} >
                <CardBody>
                        <CardTitle tag="h5">{editedQuestion.label}</CardTitle>
                        {<AnswersContainer question={editedQuestion}
                                           uniqueAnswer={editedQuestion.uniqueAnswer}
                                           isDisplayMode={false}/>}
                        <Button color="danger" style={{margin:5}} onClick={() => console.log("want to delete")/*deleteQuestion(editedQuestion)*/}>Supprimer</Button>
                        <Button color="primary" style={{margin:5}} onClick={handleShowPopup}>Modifier</Button>
                </CardBody>
            </Card>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader>
                        Modifier une question
                    </ModalHeader>
                    <MyModalBody categories={categories} question={editedQuestion} existingAnswers={answers}/>
                    <ModalFooter>
                        <Button color="danger" onClick={handleShowPopup}>Annuler</Button>
                        <Button color="primary" type="submit">Sauvegarder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
}