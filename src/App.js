import logo from './logo.svg';
import './App.css';
import './assets/css/bootstrap.min.css'
import Route from "./components/Route";
import Partida from "./pages/Partida";

function App() {
    return (
        <div>
            <Route path={"/SP/WSBrGames/"}>
                <Partida></Partida>
            </Route>
            <Route path={"/SP/WSBrGames"}>
                <Partida></Partida>
            </Route>
        </div>
    );
}

export default App;
