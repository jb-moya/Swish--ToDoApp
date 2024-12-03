

import {
    Box,
    Flex,
    Heading,
    VStack,
} from "@chakra-ui/react";
import { Button } from "../components/ui/button";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import AuthForm from "../components/AuthForm/AuthForm";
import { useColorMode } from "../components/ui/color-mode";

const Authentication = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Flex align="center" justify="center" height="100vh">
                <Box
                    p={6}
                    rounded="md"
                    width="sm"
                    boxShadow="2xl"
                    textAlign="center"
                    bg={colorMode === "light" ? "white" : "gray.700"}
                >
                    <Flex mb={10} align="center" justify="space-between">
                        <Heading>Swish</Heading>
                        <Button variant={"outline"} onClick={toggleColorMode}>
                            {colorMode === "light" ? (
                                <MdDarkMode />
                            ) : (
                                <MdOutlineLightMode />
                            )}
                        </Button>
                    </Flex>
                    <VStack spacing={4} align="stretch">
                        <AuthForm />
                    </VStack>
                </Box>
            </Flex>
        </>
    );
};

export default Authentication;
