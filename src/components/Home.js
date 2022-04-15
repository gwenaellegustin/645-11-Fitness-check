import {Link} from "react-router-dom";
import {Button} from "reactstrap";

export default function Home() {

    return (
        <>
                <h1>Bienvenue !</h1>
                <p>
                    <Link to="/form">
                        <Button color="primary">
                            Nouveau formulaire
                        </Button>
                    </Link>
                </p>
                <p>
                    <Link to="/history">
                        <Button color="primary">
                            Historique
                        </Button>
                    </Link>
                </p>
        </>
    );
}
