import { useColorMode, IconButton } from "@chakra-ui/react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeToggler = ({...IconStyle}) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <IconButton
            variant={"ghost"}
            aria-label="Toggle color mode"
            icon={
                colorMode === "light" ? <MdDarkMode /> : <MdOutlineLightMode />
            }
            {...IconStyle}
            onClick={toggleColorMode}
        />
    );
};

export default ThemeToggler;
