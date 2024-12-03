import { useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import { Tooltip } from "../ui/tooltip";
import Login from "./Login";
import SignUp from "./SignUp";
import { GoogleAuth } from "./SocialAuth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

const AuthForm = () => {
    const navigate = useNavigate();
    const [isLoginPage, setIsLoginPage] = useState(true);
    const guestLogin = useAuthStore((state) => state.guestLogin);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

    return (
        <>
            <Tooltip content="Your data will be stored locally">
                <Button
                    variant={"outline"}
                    onClick={() => {
                        guestLogin();
                        navigate("/");
                    }}
                    width={"full"}
                    mb={2}
                    disabled={isLoggingIn}
                >
                    Continue as a guest
                </Button>
            </Tooltip>

            {isLoginPage ? <Login /> : <SignUp />}

            <Flex alignItems={"center"} justifyItems={"center"} my={5}>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
                <Text flex={1} textAlign="center" opacity={0.5}>
                    OR
                </Text>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
            </Flex>

            <GoogleAuth prefix={isLoginPage ? "Login" : "Sign Up"} />

            <VStack mt={7}>
                <Text>
                    {isLoginPage
                        ? "Don't have an account?"
                        : "Already have an account?"}
                </Text>

                <Button
                    variant="ghost"
                    align="center"
                    size="sm"
                    width="full"
                    textAlign="center"
                    alignItems={"center"}
                    onClick={() => setIsLoginPage(!isLoginPage)}
                >
                    <Text>{isLoginPage ? "SIGN UP" : "LOGIN"}</Text>
                </Button>
            </VStack>
        </>
    );
};

export default AuthForm;
