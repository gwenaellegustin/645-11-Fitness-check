import {Button, Form, FormFeedback, FormGroup, Input, Label, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React, {useContext, useEffect, useState} from "react";
import {addQuestionFirestore, editQuestionFirestore} from "../../config/initFirebase";
import {AdminContext} from "./Admin";

/**
 * Popup use to add or edit a question
 *
 * @param questionExisting to prefill input (category,label, answers)
 * @param handleModal to close himself
 *
 * @author Gwenaëlle & Antony
 */
export function MyModal({questionExisting, handleModal}){
    const [questionEdited, setQuestionEdited] = useState({})
    const [answersEdited, setAnswersEdited] = useState([]);
    const [categoryInvalid, setCategoryInvalid] = useState(false)
    const [labelInvalid, setLabelInvalid] = useState(false)
    const [answerInvalid, setAnswerInvalid] = useState(false)
    const [noChange, setNoChange] = useState(false)
    const { categories, editQuestion, addQuestion } = useContext(AdminContext);

    // Fill questionEdited and answerEdited with existing data
    useEffect( () => {
        //Reminder : https://javascript.info/object-copy
        let copiedQuestion = {};
        Object.assign(copiedQuestion, questionExisting);

        let copiedAnswers = [];
        if(questionExisting.answers){
            questionExisting.answers.forEach(answer => {
                let copiedAnswer = {};
                Object.assign(copiedAnswer, answer);
                copiedAnswers.push(copiedAnswer);
            })
        }

        copiedQuestion.answers = copiedAnswers;

        setQuestionEdited(copiedQuestion);
        setAnswersEdited(copiedAnswers);
    }, [questionExisting])

    // Handle change category in form
    const changeCategory = (e) => {
        let categoryRef;
        categories.every(category => {
            if(category.id === e.target.value){
                categoryRef = category.categoryRef;
                return false; //Stop the loop, category found
            }
            return true; //Continue the loop
        })
        setQuestionEdited({...questionEdited, category : categoryRef })
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
        setQuestionEdited({...questionEdited, uniqueAnswer: e.target.checked})
    }

    function createUUID() {
        return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Handle adding a new answer
    const handleAddAnswer = () =>{
        let emptyAnswer = {
            id: createUUID(),
            label: "",
            point: ""
        }
        setAnswersEdited([...answersEdited, emptyAnswer])
    }

    // Handle submit
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.debug("FORM VALID ?")
        if (checkFormValid()){
            console.debug("YES !")

            questionEdited.answers = answersEdited;

            if (questionExisting.id) {
                editQuestionFirestore(questionEdited, answersEdited).then(updatedQuestion => {
                    if(updatedQuestion != null){
                        console.debug("EDIT QUESTION SUCCESSFUL, id : " + updatedQuestion.id);
                        updatedQuestion.category = questionEdited.category;
                        editQuestion(updatedQuestion, questionExisting.id);
                        handleModal();
                    }
                });
            } else {
                addQuestionFirestore(questionEdited, answersEdited).then(addedQuestion => {
                    if(addedQuestion != null){
                        console.debug("ADD QUESTION SUCCESSFUL, id : " + addedQuestion.id);
                        addedQuestion.category = questionEdited.category;
                        addQuestion(addedQuestion);
                        handleModal();
                    }
                });
            }
        }
    }

    const checkFormValid = () => {

        // Validation of field category
        if (!questionEdited.category) {
            console.debug("NO: categorie invalid")
            setCategoryInvalid(true)
            return false
        }

        // Validation of field label
        if (!questionEdited.label || questionEdited.label.trim() === '') {
            console.debug("NO: label invalid")
            setLabelInvalid(true)
            return false
        }

        // Delete all empty answer
        for (let i = 0; i < answersEdited.length; i++) {
            if (answersEdited[i].label.trim() === '' && answersEdited[i].point.trim() === '') {
                answersEdited.splice(i, 1)
                i--; // array length reduced by one, we have to check the new answersEdited[i]
            }
        }

        // Check if there is at least one answer
        if (answersEdited.length === 0) {
            console.debug("NO: answers invalid - empty answers")
            setAnswerInvalid(true);
            return false
        }

        // Check if all answer has a label and point valid
        if (!answersEdited.every(answer => {
            return (answer.label.trim() !== '' && answer.point !== ''); //Return false if one answer has empty label or empty point
        })) {
            setAnswerInvalid(true)
            console.debug("NO: answers invalid - point or label empty")
            return false
        }

        // Check if the question is not the same that before (if edit mode)
        if (questionExisting.id) {
            setNoChange(true);

            if (answersEdited.length === questionExisting.answers.length
                && questionEdited.label === questionExisting.label
                && questionEdited.category.id === questionExisting.category.id
                && questionEdited.uniqueAnswer === questionExisting.uniqueAnswer) {
                //Return false if at least one answer doesn't correspond
                let sameAnswers = answersEdited.every(answerEdited => {
                    //Stop if one answer doesn't correspond to any (return false)
                    return !questionExisting.answers.every(answerExisting => {
                            //Stop if label and point match (return false) -> same answers
                            return !(answerEdited.label === answerExisting.label && parseInt(answerEdited.point) === answerExisting.point);
                        });
                })

                setNoChange(sameAnswers);

                //If same sameAnswers, return checkFormValid false
                return !sameAnswers;
            } else {
                //Difference in label, category, uniqueAnswer or number of answers
                setNoChange(false)
                return true
            }
        }
        return true
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
                           onChange={changeCategory} value={(questionEdited && questionEdited.category) ? questionEdited.category.id : ""}>
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
                    <Input invalid={labelInvalid} type="textarea" value={questionEdited ? questionEdited.label : ""} onChange={changeLabel}/>
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
                       <Input type="checkbox" checked={(questionEdited && questionEdited.uniqueAnswer) ? questionEdited.uniqueAnswer : false} onChange={changeUniqueAnswer} />{' '}
                        Réponse unique (radio button)
                   </Label>
               </FormGroup>
                {answersEdited
                    .map((answer,index) => (
                        <div className="row" key={answer.id}>
                            <FormGroup className="col-10">
                                <Input type="text" value={answer ? answer.label : ""} onInput={e => changeAnswerLabel(index, e.target.value)}/>
                            </FormGroup>
                            <FormGroup className="col-2">
                                <Input  type="number" value={answer ? answer.point : ""} onInput={e => changeAnswerPoint(index, e.target.value)}/>
                            </FormGroup>
                        </div>
                    ))}
                {answersEdited.length===0 ? handleAddAnswer() : null}
                <p className="text-danger" style={{fontSize:".875em"}}>{answerInvalid ? "Toutes les réponses ne sont pas valides" : null}</p>
                <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
                <p className="text-danger text-end">{noChange ? "Pas de modification" : null}</p>
            </ModalBody>
            <ModalFooter>
                <Button type="button" color="danger" onClick={handleModal}>Annuler</Button>
                <Button type="submit" color="primary">Sauvegarder</Button>
            </ModalFooter>
        </Form>
    )
}