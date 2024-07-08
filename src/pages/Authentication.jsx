import React from "react";

// import { Box, Container } from "@chakra-ui/react";
import {
    Box,
    Flex,
    Heading,
    Button,
    VStack,
    useColorMode,
} from "@chakra-ui/react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import AuthForm from "../components/AuthForm";

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
                >
                    <Flex mb={16} align="center" justify="space-between">
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
