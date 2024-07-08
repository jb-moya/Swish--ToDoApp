import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication";
import Navbar from "./components/NavBar";
import { useColorMode, Box } from "@chakra-ui/react";

function App() {
    const { colorMode } = useColorMode();

    const lightGradient = `
    linear-gradient(
      175deg,
      hsl(185deg 69% 82%) 0%,
      hsl(185deg 69% 80%) 20%,
      hsl(185deg 69% 78%) 29%,
      hsl(186deg 69% 76%) 36%,
      hsl(186deg 69% 74%) 43%,
      hsl(186deg 70% 71%) 50%,
      hsl(186deg 69% 69%) 57%,
      hsl(186deg 69% 67%) 64%,
      hsl(186deg 69% 65%) 71%,
      hsl(186deg 69% 63%) 80%,
      hsl(186deg 69% 60%) 100%
    )
  `;

    const darkGradient = `
    linear-gradient(
      175deg,
      hsl(200deg 50% 30%) 0%,
      hsl(200deg 50% 28%) 20%,
      hsl(200deg 50% 26%) 29%,
      hsl(200deg 50% 24%) 36%,
      hsl(200deg 50% 22%) 43%,
      hsl(200deg 50% 20%) 50%,
      hsl(200deg 50% 18%) 57%,
      hsl(200deg 50% 16%) 64%,
      hsl(200deg 50% 14%) 71%,
      hsl(200deg 50% 12%) 80%,
      hsl(200deg 50% 10%) 100%
    )
  `;

    const gradient = colorMode === "light" ? lightGradient : darkGradient;

    return (
        <Box minH="100vh">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Authentication />} />
            </Routes>
        </Box>
    );
}

export default App;
