import { BrowserRouter } from "react-router-dom";
import App from "./App";
//import 'bootstrap/dist/css/bootstrap.min.css';

export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}
