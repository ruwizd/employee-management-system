import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import Login from "./components/Login";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
