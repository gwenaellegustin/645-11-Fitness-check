import '../styles/App.css';
import Form from "./Form";
import Login from "./Login";
import Users from "./Users";

function App() {
    const isLogged = true;
    let componentToDisplay;

    if (!isLogged) {
        componentToDisplay = <Login/>
    } else {
        componentToDisplay = <Form/>
    }

    return (
        <div className="App">
            <header className="App-header">
                {componentToDisplay}
                <Users></Users>
            </header>

        </div>
    );
}
export default App;
