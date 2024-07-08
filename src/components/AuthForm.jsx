import React, { useEffect, useState } from "react";
import {
    Box,
    Input,
    Button,
    Flex,
    Text,
    VStack,
    LightMode,
    InputGroup,
    InputRightElement,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { FaGoogle } from "react-icons/fa";

const PasswordInput = ({ showPassword, setShowPassword, input, setInput }) => {
    return (
        <InputGroup key={showPassword} size="md">
            <Input
                required
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={input}
                variant="filled"
                mb={5}
                onChange={(e) => setInput(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button
                    opacity={0.5}
                    h="1.75rem"
                    variant={"ghost"}
                    size="sm"
                    onClick={setShowPassword}
                >
                    {showPassword ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

PasswordInput.propTypes = {
    showPassword: PropTypes.bool.isRequired,
    setShowPassword: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
};

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        console.log("inputs", inputs);
    }, [inputs]);

    const handleAuth = () => {
        console.log("handleAuth");

        if (!isLogin && inputs.password !== inputs.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("success", inputs);
    };

    return (
        <>
            <form onSubmit={handleAuth}>
                <Input
                    id="email"
                    required
                    placeholder="Email"
                    type="email"
                    value={inputs.email}
                    onChange={(e) =>
                        setInputs({ ...inputs, email: e.target.value })
                    }
                    variant="filled"
                    mb={5}
                />

                <PasswordInput
                    id="password"
                    showPassword={showPassword.password}
                    setShowPassword={() =>
                        setShowPassword({
                            ...showPassword,
                            password: !showPassword.password,
                        })
                    }
                    input={inputs.password}
                    setInput={(e) => setInputs({ ...inputs, password: e })}
                />

                {!isLogin && (
                    <PasswordInput
                        showPassword={showPassword.confirmPassword}
                        setShowPassword={() =>
                            setShowPassword({
                                ...showPassword,
                                confirmPassword: !showPassword.confirmPassword,
                            })
                        }
                        input={inputs.confirmPassword}
                        setInput={(e) =>
                            setInputs({ ...inputs, confirmPassword: e })
                        }
                    />
                )}
                <Button size="md" width="full" mt={5} type="submit">
                    {isLogin ? "LOGIN" : "SIGN UP"}
                </Button>
                <Flex alignItems={"center"} justifyItems={"center"} my={5}>
                    <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
                    <Text flex={1} textAlign="center" fontWeight="bold">
                        OR
                    </Text>
                    <Box flex={2} h={"1px"} bg="teal.500" opacity={0.5} />
                </Flex>
                <LightMode>
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
                </LightMode>
                <VStack mt={7}>
                    <Text>
                        {isLogin
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </Text>
                    <Button
                        p={0}
                        variant="ghost"
                        align="center"
                        size="md"
                        width="full"
                        textAlign="center"
                        alignItems={"center"}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        <Text>{isLogin ? "SIGN UP" : "LOGIN"}</Text>
                    </Button>
                </VStack>
            </form>
        </>
    );
};

export default AuthForm;
