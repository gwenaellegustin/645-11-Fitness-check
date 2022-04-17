/**
 * Component to display a red message if the form hasn't all its questions answered
 *
 * @param isValidForm to only display the message if not valid
 *
 * @author Antony
 */
export function FormError({isValidForm}){
    if(!isValidForm){
        return (
            <p className={"text-danger"}>Please complete all questions before submitting the form.</p>
        )
    } else {
        return '';
    }
}