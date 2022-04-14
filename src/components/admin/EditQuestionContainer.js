
import React, {useEffect, useState} from "react";
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
import {getAnswersByQuestion, getCategories} from "../../config/initFirebase";
import {AnswersContainer} from "../form/AnswersContainer";

export function EditQuestionContainer(question) {
    const [categories, setCategories] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [editedQuestion] = useState(question.question);
    const [modal, setModal] =useState(false);
    const [newAnswerList, setNewAnswerList] = useState([]);

    // Toggle for Modal
    const toggle = () => setModal(!modal);

    //Categories
    useEffect(() => {
        getCategories().then(r => {
            setCategories(r);
        });
    }, [])
    const changeCategory = (e) => {
        editedQuestion.category = e.value;
    };

    //Label
    const changeLabel = (e) => {
        editedQuestion.label = e;
    }

    //Answers
    useEffect(() => {
        getAnswersByQuestion(editedQuestion.questionRef).then(r => {
            setAnswers(r);
        })
    }, [question])

    //Save
    const handleFormSubmit = e => {
        e.preventDefault();
        console.log(question)
        console.log(editedQuestion)
    }

    //New answer
    const NewAnswer = () => {
        return <>
            <FormGroup className="col-10">
                <Input type="text" />
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number"/>
            </FormGroup>
        </>;
    };
    function handleAddAnswer() {
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} />));
    }

    return (
        <>
            <Card key={editedQuestion.id} >
                <CardBody>
                    <CardTitle tag="h5">{editedQuestion.label}</CardTitle>
                    {<AnswersContainer question={editedQuestion}
                                       uniqueAnswer={editedQuestion.uniqueAnswer}
                                       isDisplayMode={false}/>}
                    <Button color="danger" style={{margin:5}}>Supprimer</Button>
                    <Button color="primary" style={{margin:5}} onClick={toggle}>Modifier</Button>
                </CardBody>
            </Card>
            <Modal isOpen={modal}
                   toggle={toggle}>
                <Form onSubmit={handleFormSubmit}>
                    <ModalHeader>
                        Modifier une question
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label tag="h5" for="category">Categorie</Label>
                            <Input type="select"
                                   onChange={changeCategory} defaultValue={editedQuestion.categoryId}>
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
                        <FormGroup className='row'>
                            <FormGroup className="col-10">
                                <Label tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                            </FormGroup>
                            <FormGroup className="col-2">
                                <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                            </FormGroup>
                            {answers
                                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                                .map(q => (
                                    <>
                                        <FormGroup className="col-10">
                                            <Input type="text" id={q.id} defaultValue={q.label}/>
                                        </FormGroup>
                                        <FormGroup className="col-2">
                                            <Input  type="number" defaultValue={q.point}/>
                                        </FormGroup>
                                    </>
                                ))}
                            {newAnswerList}
                            <Button color="success" style={{width:'auto', margin:'auto'}}
                                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={toggle}>Annuler</Button>
                        <Button color="primary" type="submit">Sauvegarder</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    );
}