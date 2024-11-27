import { useState } from "react";
import {
    Input,
    Button,
    Alert,
    AlertIcon,
    Stack,
    FormLabel,
    FormControl,
    useColorModeValue,
} from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const { loading, error, signUp } = useSignUpWithEmailAndPassword();

    const handleSignUp = (event) => {
        event.preventDefault();

        signUp(inputs);
    };

    return (
        <form onSubmit={handleSignUp}>
            <Stack
                spacing={5}
                w={"full"}
                maxW={"md"}
                bg={useColorModeValue("white", "gray.700")}
            >
                <FormControl id="username" isRequired variant="floating">
                    <Input
                        size={"sm"}
                        placeholder=" "
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        variant="flushed"
                        value={inputs.username}
                        onChange={(e) =>
                            setInputs({ ...inputs, username: e.target.value })
                        }
                    />
                    <FormLabel
                        fontWeight={"thin"}
                        size={"sm"}
                        bg={useColorModeValue("#fff", "#2d3748")}
                    >
                        Username
                    </FormLabel>
                </FormControl>

                <FormControl id="email" isRequired variant="floating">
                    <Input
                        size={"sm"}
                        placeholder=" "
                        _placeholder={{ color: "gray.500" }}
                        type="email"
                        variant="flushed"
                        value={inputs.email}
                        onChange={(e) =>
                            setInputs({ ...inputs, email: e.target.value })
                        }
                    />
                    <FormLabel
                        fontWeight={"thin"}
                        size={"sm"}
                        bg={useColorModeValue("#fff", "#2d3748")}
                    >
                        Email
                    </FormLabel>
                </FormControl>

                <PasswordInput
                    placeholder="Password"
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

                <PasswordInput
                    placeholder="Confirm Password"
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

                {error && (
                    <Alert
                        status="error"
                        fontSize={"sm"}
                        rounded={"sm"}
                        p={2}
                        my={3}
                    >
                        <AlertIcon />
                        {error.message}
                    </Alert>
                )}

                <Button width="full" type="submit" isLoading={loading}>
                    SIGN UP
                </Button>
            </Stack>
        </form>
    );
};

export default SignUp;
