import {BrowserRouter} from "react-router-dom";
import App from "./App";

/**
 * Component enclosing the app component use for routes browser
 */
export default function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}