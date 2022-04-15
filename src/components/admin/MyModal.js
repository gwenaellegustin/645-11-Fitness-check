import {Button, Form, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React, {useEffect, useState} from "react";
import {addQuestion, db, editQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {doc, getDoc} from "firebase/firestore";

export function MyModal({handleShowPopup, categories, question, existingAnswers}){
    const [newAnswerList, setNewAnswerList] = useState([]);
    const [answers, setAnswers] = useState(existingAnswers);

    useEffect( () => {
        if (question.id){
            getAnswersByQuestion(question.questionRef).then(r => {
                setAnswers(r);
            })
        }
    }, [question])

    //Categories
    const changeCategory = (e) => {
        console.log(e)
        question.categoryId = e;
    };

    //Label
    const changeLabel = (e) => {
        question.label = e;
    }

    //Answers
    const changeAnswerLabel = (index, value) => {
        let temp = [...answers];
        temp[index].label = value;
        setAnswers(temp)
        // https://stackoverflow.com/questions/55987953/how-do-i-update-states-onchange-in-an-array-of-object-in-react-hooks
    }

    const changeAnswerPoint = (index, value) => {
        let temp = [...answers];
        temp[index].point = value;
        setAnswers(temp)
    }

    const changeUniqueAnswer = (e) => {
        question.uniqueAnswer = e;
    }

    const handleAddAnswer = () =>{
        console.log("addanswer")
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} index={existingAnswers.length+newAnswerList.length}/>));
        let emptyAnswer = {
            index: existingAnswers.length+newAnswerList.length,
            label: "",
            point: 0
        }
        answers.push(emptyAnswer)
    }
    function NewAnswer({index})  {
        return <div className="row">
            <FormGroup className="col-10">
                <Input type="text" onChange={e => changeAnswerLabel(index, e.target.value)}/>
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number" onChange={e => changeAnswerPoint(index, e.target.value)}/>
            </FormGroup>
        </div>;
    }

    //Save
    const handleFormSubmit = async (e) => {
        console.log(question)
        if (question.label === '' || !question.categoryId) {
            e.preventDefault();
            //TODO: required field
        } else {
            e.preventDefault();
            let categoryDoc = await getDoc(doc(db, "categories", question.categoryId)); //TODO get directly the refin changeCategory()
            question.category = categoryDoc.ref;
            if (question.id) {
                editQuestion(question, answers)
            } else {
                addQuestion(question, answers)
            }
        }
    }

    return(
        <Form onSubmit={handleFormSubmit}>
            <ModalHeader>
                {question.id ? "Modifier une question" : "Ajouter une question"}
            </ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label tag="h5" for="category">Categorie</Label>
                <Input type="select"
                       onChange={e => changeCategory(e.target.value)} defaultValue={question.id ? question.categoryId : null} >
                    <option value=""/>
                    {categories
                        .map(o => (
                            <option key={o.id} value={o.id}>
                                {o.label} {o.highIsGood===true ? "(Haut est bien)" : "(Bas est bien)"}
                            </option>
                        ))}
                </Input>
            </FormGroup>
            <FormGroup>
                <Label tag="h5" for="exampleText">Question</Label>
                <Input type="textarea" defaultValue={question.label} onInput={e => changeLabel(e.target.value)}/>
            </FormGroup>
            <div className="row">
                <div className="col-10">
                    <Label  tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                </div>
                <div className="col-2">
                    <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                </div>
            </div>
            {existingAnswers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(q => (
                    <div className="row" key={q.id}>
                        <FormGroup className="col-10">
                            <Input type="text" id={q.id} defaultValue={q.label}/>
                        </FormGroup>
                        <FormGroup className="col-2">
                            <Input  type="number" defaultValue={q.point}/>
                        </FormGroup>
                    </div>
                ))}
            {newAnswerList}
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" defaultChecked={question.uniqueAnswer} onInput={e => changeUniqueAnswer(e.target.checked)} />{' '}
                    Réponse unique (radio button)
                </Label>
            </FormGroup>
            <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
        </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleShowPopup}>Annuler</Button>
                <Button color="primary" type="submit">Sauvegarder</Button>
            </ModalFooter>
        </Form>
    )

}