/**
 * Component to display a red message if the form hasn't all its questions answered
 *
 * @author Antony
 */
export function FormError(){
    return (
        <p className={"text-danger"}>Please complete all questions before submitting the form.</p>
    )
}