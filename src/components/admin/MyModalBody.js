import {Button, FormGroup, Input, Label, ModalBody} from "reactstrap";
import React, {useEffect, useState} from "react";
import {getAnswersByQuestion} from "../../config/initFirebase";

export function MyModalBody({categories, question, existingAnswers}){
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
        console.log("category changed: "+ e)
        question.category = e;
    };

    //Label
    const changeLabel = (e) => {
        console.log("label changed: "+ e)
        question.label = e;
    }

    const changeAnswerLabel = (index, value) => {
        //function changeAnswerLabel(index, value) {
        console.log(index + " " +value)
        // https://stackoverflow.com/questions/55987953/how-do-i-update-states-onchange-in-an-array-of-object-in-react-hooks

        //setNewAnswers([...newAnswers, ...newAnswers[newAnswers.length].label=value])
        //console.log(answers)
        //answers[newAnswers.length].answer.label = value;
    }

    const changeAnswerPoint = (index, value) => {
        //function changeAnswerPoint(index, value) {
        console.log(index + " " +value)
        //existingAnswers[index].answer.point = value;
    }

    //New answer
    const handleAddAnswer = () => {
        setNewAnswerList(newAnswerList.concat(<NewAnswer key={newAnswerList.length} index={newAnswerList.length}/>));
        let emptyAnswer = {
            id: newAnswerList.length,
            label: "",
            point: 0
        }
        //console.log(answers)
        answers.push(emptyAnswer)
        console.log(answers)
        //console.log(answers.existingAnswers)
        //console.log(answers.newAnswers)

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

    return(
        <ModalBody>
            <FormGroup>
                <Label tag="h5" for="category">Categorie</Label>
                <Input type="select"
                       onChange={e => changeCategory(e.target.value)} defaultValue={question.categoryId}>
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
            <Button color="success" style={{width:'auto', margin:'auto'}}
                    onClick={handleAddAnswer}>Ajouter une réponse</Button>
        </ModalBody>
    )

}