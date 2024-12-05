import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "./components/ui/provider"
import { system } from "./theme.js";
import { Toaster } from "./components/ui/toaster.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider theme={system}>
                <Toaster />
                <App />
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
);
