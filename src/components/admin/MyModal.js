import {
    Button,
    Form,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "reactstrap";
import React, {useEffect, useState} from "react";
import {addQuestion, db, editQuestion, getAnswersByQuestion} from "../../config/initFirebase";
import {doc, getDoc} from "firebase/firestore";

export function MyModal({handleShowPopup, categories, question, existingAnswers}){
    const [questionEdited, setQuestionEdited] = useState(question)
    const [newAnswerFieldList, setNewAnswerFieldList] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [categoryInvalid, setCategoryInvalid] = useState(false)
    const [labelInvalid, setLabelInvalid] = useState(false)
    const [answerInvalid, setAnswerInvalid] = useState(false)
    const [noChange, setNoChange] = useState(false)

    useEffect( () => {
        questionEdited.label = question.label;
        questionEdited.categoryId = question.categoryId;
        questionEdited.uniqueAnswer = question.uniqueAnswer;
        if (question.id){
            getAnswersByQuestion(question.questionRef).then(r => {
                setAnswers(r);
            })
        }
    }, [question])

    //Categories
    const changeCategory = (e) => {
        questionEdited.categoryId = e;
    };

    //Label
    const changeLabel = (e) => {
        questionEdited.label = e;
    }

    //Answers
    const changeAnswerLabel = (index, value) => {
        let temp = [...answers];
        temp[index].label = value;
        setAnswers(temp)
    }

    const changeAnswerPoint = (index, value) => {
        let temp = [...answers];
        temp[index].point = value;
        setAnswers(temp)
    }

    const changeUniqueAnswer = (e) => {
        questionEdited.uniqueAnswer = e;
    }

    const handleAddAnswer = () =>{
        setNewAnswerFieldList(newAnswerFieldList.concat(<NewAnswer key={newAnswerFieldList.length} index={existingAnswers.length+newAnswerFieldList.length}/>));
        let emptyAnswer = {
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

    const handleCancel = () => {
        //setQuestionEdited({label: ''}) // TODO: try to clean field when cancel
        handleShowPopup()
    }


    //Save
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!question.categoryId){
            console.log("categorie invalide")
            setCategoryInvalid(true)
            return
        } else {
            setCategoryInvalid(false)
        }
        if (question.label === '') {
            console.log("label invalide")
            setLabelInvalid(true)
            return
        } else {
            setLabelInvalid(false)
        }
        answers.forEach(answer => {
            if(answer.label===''){
                console.log('answerinvalid')
                setAnswerInvalid(true)
                return false
            }
        })


        if (question.id){ // edit mode
            if(questionEdited.label === question.label
                && questionEdited.categoryId === question.categoryId
                && questionEdited.uniqueAnswer === question.uniqueAnswer){
                    if (answers === existingAnswers){
                        console.log("found no difference")
                        for (let i = 0; i < answers.length; i++) {
                            console.log(answers[i].label + " " + existingAnswers[i].label)
                            console.log(answers[i].point+ " " + existingAnswers[i].point)
                            if(answers[i].label === existingAnswers[i].label && answers[i].point === existingAnswers[i].point){
                                //TODO: can't validate if not modification
                            }else {
                                console.log("found difference")
                            }
                        }
                    }
                    setNoChange(true)
                    return
            }
        }

        if(!categoryInvalid || !labelInvalid || !answerInvalid) {
            console.log("ok")
            e.preventDefault();
            let categoryDoc = await getDoc(doc(db, "categories", question.categoryId)); //TODO get directly the ref in changeCategory()
            questionEdited.category = categoryDoc.ref;
            if (question.id) {
                //editQuestion(questionEdited, answers) // TODO: commented for tests
            } else {
                //addQuestion(questionEdited, answers) // TODO: commented for tests
            }
        }
        //TODO: reload page
    }

    return(
        <Form onSubmit={handleFormSubmit}>
            <ModalHeader>
                {question.id ? "Modifier une question" : "Ajouter une question"}
            </ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label tag="h5" for="category">Categorie</Label>
                <Input invalid={categoryInvalid} type="select"
                       onChange={e => changeCategory(e.target.value)} defaultValue={question.categoryId ? questionEdited.categoryId : null} >
                    <option value=""/>
                    {categories
                        .map(o => (
                            <option key={o.id} value={o.id}>
                                {o.label} {o.highIsGood===true ? "(Haut est bien)" : "(Bas est bien)"}
                            </option>
                        ))}
                </Input>
                <FormFeedback>La catégorie est obligatoire</FormFeedback>
            </FormGroup>
            <FormGroup>
                <Label tag="h5" for="exampleText">Question</Label>
                    <Input invalid={labelInvalid} type="textarea" defaultValue={questionEdited.label} onInput={e => changeLabel(e.target.value)}/>
                    <FormFeedback >Le question est obligatoire</FormFeedback>
                </FormGroup>
            <div className="row">
                <div className="col-10">
                    <Label  tag="h5" for="answer" className="mr-sm-1">Réponse</Label>
                </div>
                <div className="col-2">
                    <Label tag="h5" for="point" className="mr-sm-1">Valeur</Label>
                </div>
            </div>
            <p className="text-danger">{answerInvalid ? "Toutes les réponses ne sont pas valides" : null}</p>
                {existingAnswers
                .sort((a,b) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <div className="row" key={answer.id}>
                        <FormGroup className="col-10">
                            <Input type="text" id={answer.id} defaultValue={answer.label}/>
                            {/*TODO: can we change existing answer ?*/}
                        </FormGroup>
                        <FormGroup className="col-2">
                            <Input type="number" defaultValue={answer.point}/>
                            {/*TODO: can we change existing answer ?*/}
                        </FormGroup>
                    </div>
                ))}
            {answers.length===0 ? handleAddAnswer() : null}
            {newAnswerFieldList}
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" defaultChecked={question.id ? questionEdited.uniqueAnswer : changeUniqueAnswer(false)} onInput={e => changeUniqueAnswer(e.target.checked)} />{' '}
                    Réponse unique (radio button)
                </Label>
            </FormGroup>
            <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                <p className="text-danger text-end">{noChange ? "Pas de modification" : null}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleCancel}>Annuler</Button>
                <Button color="primary" type="submit">Sauvegarder</Button>
            </ModalFooter>
        </Form>
    )

}