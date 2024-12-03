import { IconButton } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeToggler = ({ ...IconStyle }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton
            variant={"ghost"}
            aria-label="Toggle color mode"
            {...IconStyle}
            onClick={toggleColorMode}
        >
            {colorMode === "light" ? <MdDarkMode /> : <MdOutlineLightMode />}
        </IconButton>
    );
};

export default ThemeToggler;
