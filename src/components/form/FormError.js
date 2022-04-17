export function FormError({isValidForm}){
    if(!isValidForm){
        return (
            <p className={"text-danger"}>Please complete all questions before submitting the form.</p>
        )
    } else {
        return '';
    }
}