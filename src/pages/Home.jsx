import Navbar from "../components/NavBar";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Box,
    Container,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import TaskContainer from "../components/TaskContainer";
import ProjectContainer from "../components/ProjectContainer";

const Home = () => {
    return (
        <>
            <Box h="60px">
                <Navbar />
            </Box>
            <Container maxW="5xl" centerContent>
                <ProjectContainer />
                <Button width="full" variant="ghost">
                    Add Project
                </Button>
            </Container>
        </>
    );
};

export default Home;
