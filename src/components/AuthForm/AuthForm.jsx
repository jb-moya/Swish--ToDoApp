import { useState } from "react";
import { Box, Button, Flex, Text, VStack, Tooltip } from "@chakra-ui/react";
import Login from "./Login";
import SignUp from "./SignUp";
import { GoogleAuth } from "./SocialAuth";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
const AuthForm = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const guestLogin = useAuthStore((state) => state.guestLogin);

    return (
        <>
            <Tooltip label="Your data will be stored locally">
            <Button
                variant={"link"}
                onClick={() => {
                    guestLogin();
                    navigate("/");
                }}
                width={"full"}
                mb={2}
            >
                Continue as a guest
            </Button>
            </Tooltip>

            {isLogin ? <Login /> : <SignUp />}

            <Flex alignItems={"center"} justifyItems={"center"} my={5}>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
                <Text flex={1} textAlign="center" opacity={0.5}>
                    OR
                </Text>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
            </Flex>

            <GoogleAuth prefix={isLogin ? "Login" : "Sign Up"} />

            <VStack mt={7}>
                <Text>
                    {isLogin
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
                    onClick={() => setIsLogin(!isLogin)}
                >
                    <Text>{isLogin ? "SIGN UP" : "LOGIN"}</Text>
                </Button>
            </VStack>
        </>
    );
};

export default AuthForm;
