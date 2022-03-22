export function FormError({isValidForm}){
    if(!isValidForm){
        return (
            <p className={"text-danger"}>Please complete all fields before submitting</p>
        )
    } else {
        return '';
    }
}
