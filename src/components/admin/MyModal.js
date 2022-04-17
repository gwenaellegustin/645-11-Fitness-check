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
import React, {useContext, useEffect, useState} from "react";
import { addQuestionFirestore, db, editQuestionFirestore} from "../../config/initFirebase";
import {doc, getDoc} from "firebase/firestore";
import {AdminContext} from "./Admin";

export function MyModal({questionExisting, handleModal}){
    const [questionEdited, setQuestionEdited] = useState(questionExisting)
    const [answersEdited, setAnswersEdited] = useState([]);
    const [categoryInvalid, setCategoryInvalid] = useState(false)
    const [labelInvalid, setLabelInvalid] = useState(false)
    const [answerInvalid, setAnswerInvalid] = useState(false)
    const [noChange, setNoChange] = useState(false)
    const { categories, editQuestion, addQuestion } = useContext(AdminContext);

    useEffect( () => {
        if (questionExisting.answers){
            setAnswersEdited(questionExisting.answers.map(answer => ({
                ...answer,
                key: answer.id
            })));
        } else {
            setAnswersEdited([])
        }

    }, [questionExisting])

    // Handle change category in form
    const changeCategory = (e) => {
        setQuestionEdited({...questionEdited, categoryId : e.target.value })
        if (e.target.value){
            setCategoryInvalid(false)
        } else {
            setCategoryInvalid(true)
        }
    };
    // Handle change label in form
    const changeLabel = (e) => {
        setQuestionEdited({...questionEdited, label: e.target.value })
        if (e.target.value){
            setLabelInvalid(false)
        }else {
            setLabelInvalid(true)
        }
    }
    // Handle change answers in form
    const changeAnswerLabel = (index, value) => {
        let temp = [...answersEdited];
        temp[index].label = value;
        setAnswersEdited(temp)
    }
    const changeAnswerPoint = (index, value) => {
        let temp = [...answersEdited];
        temp[index].point = value;
        setAnswersEdited(temp)
    }
    const changeUniqueAnswer = (e) => {
        setQuestionEdited({...questionEdited, uniqueAnswer: e})
    }

    // Handle adding a new answer
    const handleAddAnswer = () =>{
        let emptyAnswer = {
            key: answersEdited.length,
            label: "",
            point: ""
        }
        setAnswersEdited(answersEdited.concat(emptyAnswer))
    }

    const checkFormValid = () => {

        // Validation of field
        if (!questionEdited.categoryId) {
            console.log("NO: categorie invalid")
            setCategoryInvalid(true)
            return false
        }
        if (!questionEdited.label || questionEdited.label.trim() === '') {
            console.log("NO: label invalid")
            setLabelInvalid(true)
            return false
        }

        for (let i = 0; i < answersEdited.length; i++) {
            if (answersEdited[i].label.trim() === '' && answersEdited[i].point.trim() === '') {
                answersEdited.splice(i, 1)
                i--; // array length diminue form one, we have to check the new answersEdited[i]
            }
        }

        if (answersEdited.length === 0) {
            console.log("NO: answers invalid")
            setAnswerInvalid(true);
            return false
        }

        if (!answersEdited.every(answer => {
            return (answer.label !== '' && answer.point !== '')
        })) {
            setAnswerInvalid(true)
            console.log("NO: answers invalid")
            return false
        }

        // Check if the question is not the same that before (if edit mode)
        if (questionExisting.id) {
            setNoChange(true)
            if (questionEdited.label === questionExisting.label
                && questionEdited.categoryId === questionExisting.categoryId
                && questionEdited.uniqueAnswer === questionExisting.uniqueAnswer
                && answersEdited.length === questionExisting.answers.length) {
                let i = 0;
                do {
                    if (answersEdited[i].label !== questionExisting.answers[i].label
                        || answersEdited[i].point !== questionExisting.answers[i].point) {
                        //Difference in label or point of a answer
                        i = answersEdited.length //stop while
                        setNoChange(false)
                        return true
                    } else {
                        i++
                    }
                } while (i < answersEdited.length);
                // No difference in label, categoryId, unique answer or answers
                console.log("NO : no difference")
                return false
            } else {
                //Difference in label, category, uniqueAnswer or number of answers
                setNoChange(false)
                return true
            }
        }
        return true
    }

    //Save
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log("FORM VALID ?")
        if (checkFormValid()){
            console.log("YES !")
            e.preventDefault();
            let categoryDoc = await getDoc(doc(db, "categories", questionEdited.categoryId)); //TODO get directly the ref in changeCategory()
            questionEdited.category = categoryDoc.ref;

            answersEdited.forEach(answer => {
                answer.point = parseInt(answer.point);
            })

            if (questionExisting.id) {
                editQuestionFirestore(questionEdited, answersEdited).then(questionRef => {
                    if(questionRef != null){
                        console.log("EDIT QUESTION SUCCESSFUL, id : " + questionRef.id);
                        handleModal()
                        questionEdited.id = questionRef.id;
                        questionEdited.answers = answersEdited;
                        editQuestion(questionEdited, questionExisting.id);
                    }
                });
            } else {
                addQuestionFirestore(questionEdited, answersEdited).then(questionRef => {
                    if(questionRef != null){
                        console.log("ADD QUESTION SUCCESSFUL, id : " + questionRef.id);
                        handleModal()
                        questionEdited.id = questionRef.id;
                        questionEdited.answers = answersEdited;
                        addQuestion(questionEdited);
                    }
                });
            }
        }
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
                           onChange={changeCategory} value={questionEdited.categoryId}>
                        <option value=""/>
                        {categories.map(o => (
                            <option key={o.id} value={o.id}>
                                    {o.label} {o.highIsGood===true ? "(Haut est bien)" : "(Bas est bien)"}
                            </option>
                        ))}
                    </Input>
                    <FormFeedback>La catégorie est obligatoire</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label tag="h5" for="exampleText">Question</Label>
                    <Input invalid={labelInvalid} type="textarea" value={questionEdited.label} onChange={changeLabel}/>
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
               <FormGroup check>
                   <Label check>
                       <Input type="checkbox" value={questionEdited.uniqueAnswer} onChange={e => changeUniqueAnswer(e.target.checked)} />{' '}
                        Réponse unique (radio button)
                   </Label>
               </FormGroup>
                {answersEdited
                    .map((answer,index) => (
                        <div className="row" key={answer.key}>
                            <FormGroup className="col-10">
                                <Input type="text" value={answer.label} onInput={e => changeAnswerLabel(index, e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="col-2">
                                <Input  type="number" value={answer.point} onInput={e => changeAnswerPoint(index, e.target.value)}/>
                            </FormGroup>
                        </div>
                    ))}
                {answersEdited.length===0 ? handleAddAnswer() : null}
                <p className="text-danger">{answerInvalid ? "Toutes les réponses ne sont pas valides" : null}</p>
                <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                <p className="text-danger text-end">{noChange ? "Pas de modification" : null}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={handleModal}>Annuler</Button>
                <Button color="primary" type="submit">Sauvegarder</Button>
            </ModalFooter>
        </Form>
    )
}