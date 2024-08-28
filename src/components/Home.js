import {Link} from "react-router-dom";
import {Button} from "reactstrap";

/**
 * Component to display the Home page
 */
export default function Home() {
    return (
        <>
                <h1>Bienvenue !</h1>
                <p>
                    <Link to={process.env.PUBLIC_URL +"/form"}>
                        <Button color="primary">
                            Nouveau questionnaire
                        </Button>
                    </Link>
                </p>
                <p>
                    <Link to={process.env.PUBLIC_URL +"/history"}>
                        <Button color="primary">
                            Historique
                        </Button>
                    </Link>
                </p>
        </>
    );
}
