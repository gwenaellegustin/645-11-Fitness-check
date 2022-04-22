/**
 * Component to display a red message if the form hasn't all its questions answered
 *
 * @author Antony
 */
export function FormError(){
    return (
        <p className={"text-danger"}>Veuillez remplir toutes les questions avant de valider votre questionnaire.</p>
    )
}