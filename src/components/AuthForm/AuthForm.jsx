import { useState } from "react";
import { Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import Login from "./Login";
import SignUp from "./SignUp";
// import GoogleAuth from "./GoogleAuth";
import { GoogleAuth, FacebookAuth, GithubAuth } from "./SocialAuth";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);

    // onSubmit = { handleAuth };

    return (
        <>
            {isLogin ? <Login /> : <SignUp />}
            <Flex alignItems={"center"} justifyItems={"center"} my={5}>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
                <Text flex={1} textAlign="center" opacity={0.5}>
                    OR
                </Text>
                <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
            </Flex>
            {/* <GoogleAuth prefix={isLogin ? "Login" : "Sign Up"}/> */}

            {/* <FacebookAuth prefix={isLogin ? "Login" : "Sign Up"} /> */}

            {/* <GithubAuth prefix={isLogin ? "Login" : "Sign Up"} /> */}

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
