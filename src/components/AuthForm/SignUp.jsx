import { useState } from "react";
import { Input, Alert, Stack } from "@chakra-ui/react";
import { Button } from "../ui/button";
import PasswordInput from "./PasswordInput";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";
import { useColorModeValue } from "../ui/color-mode";
import useAuthStore from "../../store/authStore";
import { Field } from "../ui/field";

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
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
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
                <Field
                    id="username"
                    required
                    variant="floating"
                    label={"Username"}
                >
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
                </Field>

                <Field id="email" required variant="floating" label={"Email"}>
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
                        {error.message}
                    </Alert>
                )}

                <Button
                    width="full"
                    type="submit"
                    loading={loading}
                    disabled={isLoggingIn}
                    loadingText="Signing up..."
                >
                    SIGN UP
                </Button>
            </Stack>
        </form>
    );
};

export default SignUp;
