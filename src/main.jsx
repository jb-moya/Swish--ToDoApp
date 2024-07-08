import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { extendTheme, baseTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(
    {
        colors: {
            brand: baseTheme.colors.cyan,
        },
        components: {
            Alert: {
                defaultProps: {
                    colorScheme: "blue",
                },
            },
        },
    },
    withDefaultColorScheme({ colorScheme: "brand" })
);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </BrowserRouter>
    </React.StrictMode>
);
