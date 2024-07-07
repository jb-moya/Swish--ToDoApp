import React from "react";

// import { Box, Container } from "@chakra-ui/react";
import {
    Box,
    Flex,
    Heading,
    Input,
    Button,
    Text,
    Divider,
    IconButton,
    VStack,
    HStack,
    useColorMode,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const Authentication = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <>
            <Flex
                align="center"
                justify="center"
                height="100vh"
                // bgGradient="linear(to-r, purple.500, blue.500)"
            >
                <Box
                    // bg="white"
                    p={6}
                    rounded="md"
                    width="sm"
                    boxShadow="lg"
                    textAlign="center"
                >
                    <Flex mb={16} align="center" justify="space-between">
                        <Heading>Swish</Heading>
                        <Button onClick={toggleColorMode}>
                            {colorMode === "light" ? (
                                <MdDarkMode />
                            ) : (
                                <MdOutlineLightMode />
                            )}
                        </Button>
                    </Flex>
                    <VStack spacing={4} align="stretch">
                        <Input placeholder="Email" variant="filled" />
                        <Input
                            placeholder="Password"
                            type="password"
                            variant="filled"
                        />
                        <Button colorScheme="teal" size="md" width="full">
                            LOGIN
                        </Button>
                        <Text>Or</Text>
                        <Button
                            colorScheme="red"
                            align="center"
                            size="md"
                            width="full"
                            textAlign="center"
                            alignItems={"center"}
                        >
                            <FaGoogle />
                            <Text ml={2}>LogIn with Google</Text>
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </>
    );
};

export default Authentication;
