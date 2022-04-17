
import React, {useContext, useState} from "react";
import {Button, Card, CardBody,CardTitle,Modal,} from "reactstrap";
import {deleteQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";
import {MyModal} from "./MyModal";
import {AdminContext} from "./Admin";

export function EditQuestionContainer({question}) {
    const [editedQuestion] = useState(question);
    const [modal, setModal] =useState(false);
    const [answers, setAnswers] = useState([]);
    const { reload, forceReload  } = useContext(AdminContext);

    // Toggle for Popup
    const handleShowPopup = () => {
        if (!modal) {
            getAnswersByQuestion(editedQuestion.questionRef).then(r => {
                setAnswers(r.map(answer => ({
                    ...answer,
                    key: answer.id
                })).sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                );
            })
        }
        setModal(!modal)
    };

    const handleDelete = async (editedQuestion) => {
        await deleteQuestion(editedQuestion)
        forceReload(reload+1);
    }

    const handleReload = () => {
        forceReload(reload+1);
        setModal(!modal)
    }

    return (
        <div>
            <Card key={editedQuestion.id} >
                <CardBody>
                        <CardTitle tag="h5">{editedQuestion.label}</CardTitle>
                        {<AnswersContainer question={editedQuestion}
                                           uniqueAnswer={editedQuestion.uniqueAnswer}
                                           isDisplayMode={false}/>}
                        <Button color="danger" style={{margin:5}} onClick={() => handleDelete(editedQuestion)}>Supprimer</Button>
                        <Button type="submit" color="primary" style={{margin:5}} onClick={handleShowPopup}>Modifier</Button>
                </CardBody>
            </Card>
            <Modal isOpen={modal}
                   toggle={handleShowPopup}>
                    <MyModal handleShowPopup={handleShowPopup} questionExisting={editedQuestion} answersExisting={answers} handleReload={handleReload}/>
            </Modal>
        </div>
    );
}