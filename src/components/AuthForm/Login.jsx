import { Input, Stack } from "@chakra-ui/react";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { useState } from "react";
import PasswordInput from "./PasswordInput";
import useLogin from "../../hooks/useLogin";
import { useColorModeValue } from "../ui/color-mode";
import { Field } from "../ui/field";
import useSocialAuth from "../../hooks/useSocialAuth";
import { FiAlertCircle } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
    const { loading: loginLoading, error, login } = useLogin();

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
                <Field id="email" required variant="floating" label="Email">
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
                </Field>

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
                        title="Error logging in"
                        fontSize={"sm"}
                        rounded={"sm"}
                        p={2}
                        my={3}
                    >
                        {/* <FiAlertCircle /> */}
                        {error.message}
                    </Alert>
                )}

                <Button
                    size="md"
                    width="full"
                    mt={5}
                    type="submit"
                    loading={loginLoading}
                    disabled={loginLoading || isLoggingIn}
                    loadingText="Signing in"
                >
                    LOGIN
                </Button>
            </Stack>
        </form>
    );
};

export default Login;
