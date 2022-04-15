
import React, {useState} from "react";
import {
    Button, Card, CardBody,CardTitle,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import {db, deleteQuestion, editQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";
import {doc} from "firebase/firestore";

export function EditQuestionContainer({categories, question}) {
    const [editedQuestion] = useState(question);
    const [modal, setModal] =useState(false);
    const [newAnswerList, setNewAnswerList] = useState([]);
    const [answers, setAnswers] = useState([]);

    // Toggle for Popup
    const handleShowPopup = async () => {
        if (!modal) {
            await getAnswersByQuestion(editedQuestion.questionRef).then(r => {
                setAnswers(r);
            })
        }
        setModal(!modal)
    };

    //Categories
    const changeCategory = (e) => {
        console.log("category changed: "+ e)
        editedQuestion.category = e;
    };

    //Label
    const changeLabel = (e) => {
        console.log("label changed: "+ e)
        editedQuestion.label = e;
    }

    //Answers
    //useEffect(() => {
    //    getAnswersByQuestion(editedQuestion.questionRef).then(r => {
    //        setAnswers(r);
    //    })
    //}, [])

    //Save
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log(editedQuestion.label)
        console.log(editedQuestion.category)
        editedQuestion.category = doc(db, 'categories', editedQuestion.category);
        console.log(editedQuestion)
        console.log(answers)
        //editQuestion(editedQuestion)
    }

    //New answer
    function handleAddAnswer() {
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} />));
    }
    const NewAnswer = () => {
        return <div className='row'>
            <FormGroup className="col-10">
                <Input type="text" />
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number"/>
            </FormGroup>
        </div>;
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
                    <ModalBody>
                        <FormGroup>
                            <Label tag="h5" for="category">Categorie</Label>
                            <Input type="select"
                                   onChange={e => changeCategory(e.target.value)} defaultValue={editedQuestion.categoryId}>
                                {categories
                                    .map(o => (
                                        <option key={o.id} value={o.id}>
                                            {o.label + " (Haut est bien: " + o.highIsGood + ")"}
                                        </option>
                                    ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label tag="h5" for="exampleText">Question</Label>
                            <Input type="textarea" defaultValue={editedQuestion.label} onInput={e => changeLabel(e.target.value)}/>
                        </FormGroup>
                        <div className='row'>
                            <div className="col-10">
                                <Label  tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                            </div>
                            <div className="col-2">
                                <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                            </div>
                        </div>
                            {answers
                                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                                .map(q => (
                                    <div className='row' key={q.id}>
                                        <FormGroup className="col-10">
                                            <Input type="text" id={q.id} defaultValue={q.label}/>
                                        </FormGroup>
                                        <FormGroup className="col-2">
                                            <Input  type="number" defaultValue={q.point}/>
                                        </FormGroup>
                                    </div>
                                ))}
                            {newAnswerList}
                            <Button color="success" style={{width:'auto', margin:'auto'}}
                                    onClick={handleAddAnswer}>Ajouter une réponse</Button>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={handleShowPopup}>Annuler</Button>
                        <Button color="primary" type="submit">Sauvegarder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </div>
    );
}