import {
    Button,
    Input,
    Alert,
    AlertIcon,
    FormControl,
    FormLabel,
    useColorModeValue,
    Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const { loading, error, login } = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();

        login(inputs);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack
                spacing={5}
                w={"full"}
                maxW={"md"}
                bg={useColorModeValue("white", "gray.700")}
            >
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
                    placeholder={"Password"}
                    showPassword={showPassword}
                    setShowPassword={() => setShowPassword(!showPassword)}
                    input={inputs.password}
                    setInput={(e) => setInputs({ ...inputs, password: e })}
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

                <Button
                    size="md"
                    width="full"
                    mt={5}
                    type="submit"
                    isLoading={loading}
                >
                    LOGIN
                </Button>
            </Stack>
        </form>
    );
};

export default Login;
