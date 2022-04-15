
import React, {useState} from "react";
import {Button, Card, CardBody,CardTitle,Modal,} from "reactstrap";
import {deleteQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";
import {MyModal} from "./MyModal";

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
                        <Button color="danger" style={{margin:5}} onClick={() => deleteQuestion(editedQuestion)}>Supprimer</Button>
                        <Button type="submit" color="primary" style={{margin:5}} onClick={handleShowPopup}>Modifier</Button>
                </CardBody>
            </Card>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                    <MyModal handleShowPopup={handleShowPopup} categories={categories} question={editedQuestion} existingAnswers={answers}/>
            </Modal>
        </div>
    );
}