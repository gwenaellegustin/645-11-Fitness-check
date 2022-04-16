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
import {forEach} from "react-bootstrap/ElementChildren";

export function MyModal({handleShowPopup, categories, questionExisting, answersExisting}){
    const [questionEdited, setQuestionEdited] = useState(questionExisting)
    //const [newAnswerFieldList, setNewAnswerFieldList] = useState([]);
    const [answersEdited, setAnswersEdited] = useState(answersExisting);
    const [categoryInvalid, setCategoryInvalid] = useState(false)
    const [labelInvalid, setLabelInvalid] = useState(false)
    const [answerInvalid, setAnswerInvalid] = useState(false)
    //const [noChange, setNoChange] = useState(false)

    useEffect( () => {
        console.log(questionExisting)
        console.log(answersExisting)
        if (answersExisting){
            setAnswersEdited(answersExisting.map(answer => ({
                ...answer,
                key: answer.key
            })));
        } else {
            setAnswersEdited([])
        }
    }, [questionExisting, answersExisting])

    //Categories
    const changeCategory = (e) => {
        setQuestionEdited({categoryId: e})
    };

    //Label
    const changeLabel = (e) => {
        setQuestionEdited({label: e})
    }

    //Answers
    const changeAnswerLabel = (index, value) => {
        let temp = [...answersEdited];
        temp[index].label = value;
        setAnswersEdited({temp})
    }

    const changeAnswerPoint = (index, value) => {
        let temp = [...answersEdited];
        temp[index].point = value;
        setAnswersEdited(temp)
    }

    const changeUniqueAnswer = (e) => {
        setQuestionEdited({uniqueAnswer: e})
    }

    const handleAddAnswer = () =>{
        //setNewAnswerFieldList(newAnswerFieldList.concat(<NewAnswer key={newAnswerFieldList.length} index={existingAnswers.length+newAnswerFieldList.length}/>));
        let emptyAnswer = {
            key: answersEdited.length,
            label: "",
            point: ""
        }
        setAnswersEdited(answersEdited.concat(emptyAnswer))
        //answersEdited.push(emptyAnswer)

    }

    /*function NewAnswer({index})  {
        return <div className="row">
            <FormGroup className="col-10">
                <Input type="text" value={answers[index].label} onChange={e => changeAnswerLabel(index, e.target.value)}/>
            </FormGroup>
            <FormGroup className="col-2">
                <Input  type="number" value={answers[index].point} onChange={e => changeAnswerPoint(index, e.target.value)}/>
            </FormGroup>
        </div>;
    }*/

    const handleCancel = (e) => {
        //setQuestionEdited({label: ''}) // TODO: try to clean field when cancel
        handleShowPopup()
    }


    //Save
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        console.log(questionEdited)
        console.log(answersExisting)
        console.log(answersEdited)

        if (!questionEdited.categoryId){
            console.log("categorie invalide")
            setCategoryInvalid(true)
            return
        } else {
            setCategoryInvalid(false)
        }
        if (questionEdited.label === '') {
            console.log("label invalide")
            setLabelInvalid(true)
            return
        } else {
            setLabelInvalid(false)
        }
        answersEdited.forEach(answer => {
            if(answer.label===''){
                console.log('answerinvalid')
                setAnswerInvalid(true)
                return false
            }
            if(answer.point===''){
                console.log('answerinvalid')
                setAnswerInvalid(true)
                return false
            }
        })


        /*if (questionExisting.id){ // edit mode
            if(questionEdited.label === questionExisting.label
                && questionEdited.categoryId === questionExisting.categoryId
                && questionEdited.uniqueAnswer === questionExisting.uniqueAnswer){
                    if (answersEdited === answersExisting){
                        console.log("found no difference")
                        for (let i = 0; i < answersEdited.length; i++) {
                            console.log(answersEdited[i].label + " " + answersExisting[i].label)
                            console.log(answersEdited[i].point+ " " + answersExisting[i].point)
                            if(answersEdited[i].label === answersExisting[i].label && answersEdited[i].point === answersExisting[i].point){
                                //TODO: can't validate if not modification
                            }else {
                                console.log("found difference")
                            }
                        }
                    }
                    //setNoChange(true)
                    return
            }
        }

        if(!categoryInvalid || !labelInvalid || !answerInvalid) {
            console.log("ok, question:")
            console.log(questionEdited)
            e.preventDefault();
            let categoryDoc = await getDoc(doc(db, "categories", questionEdited.categoryId)); //TODO get directly the ref in changeCategory()
            questionEdited.category = categoryDoc.ref;
            if (questionExisting.id) {
                //editQuestion(questionEdited, answers) // TODO: commented for tests
            } else {
                //addQuestion(questionEdited, answers) // TODO: commented for tests
            }
        }*/
        //TODO: reload page
    }

    return(
        <Form onSubmit={handleFormSubmit}>
            <ModalHeader>
                {questionExisting.id ? "Modifier une question" : "Ajouter une question"}
            </ModalHeader>
            <ModalBody>
            <FormGroup>
                <Label tag="h5" for="category">Categorie</Label>
                <Input invalid={categoryInvalid} type="select"
                       onChange={e => changeCategory(e.target.value)} value={questionEdited.categoryId}>
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
                    <Input invalid={labelInvalid} type="textarea" value={questionEdited.label} onInput={e => changeLabel(e.target.value)}/>
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
                {/*answersExisting
                .sort((b,a) => a.point - b.point) //Sort the answers by point, ascending
                .map(answer => (
                    <div className="row" key={answer.id}>
                        <FormGroup className="col-10">
                            <Input type="text" id={answer.id} defaultValue={answer.label}/>
                            {TODO: can we change existing answer ?}
                        </FormGroup>
                        <FormGroup className="col-2">
                            <Input type="number" defaultValue={answer.point}/>
                            {TODO: can we change existing answer ?}
                        </FormGroup>
                    </div>
                ))*/}
                {answersEdited.map(answer => (
                        <div className="row" key={answer.key}>
                            <FormGroup className="col-10">
                                <Input type="text" value={answer.label} onInput={e => changeAnswerLabel(answer.index, e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="col-2">
                                <Input  type="number" value={answer.point} onInput={e => changeAnswerPoint(answer.index, e.target.value)}/>
                            </FormGroup>
                        </div>
                    ))}
            {/*answers.length===0 ? handleAddAnswer() : null}
            {newAnswerFieldList*/}
            <FormGroup check>
                <Label check>
                    <Input type="checkbox" checked={questionEdited.uniqueAnswer} onChange={e => changeUniqueAnswer(e.target.checked)} />{' '}
                    Réponse unique (radio button)
                </Label>
            </FormGroup>
            <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                <p className="text-danger text-end">{/*noChange ? "Pas de modification" : null*/}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleCancel}>Annuler</Button>
                <Button color="primary" type="submit">Sauvegarder</Button>
            </ModalFooter>
        </Form>
    )

}