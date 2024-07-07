import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import Navbar from "./components/NavBar";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Authentication />} />
            </Routes>
        </>
    );
}

export default App;
