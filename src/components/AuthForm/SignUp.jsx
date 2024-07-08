import { useEffect, useState } from "react";
import { Input, Button, Alert, AlertIcon } from "@chakra-ui/react";
import PasswordInput from "./PasswordInput";
import useSignUpWithEmailAndPassword from "../../hooks/useSignUpWithEmailAndPassword";

const SignUp = () => {
    const [inputs, setInputs] = useState({
        username: "joebloggs",
        email: "joebloggs@me.com",
        password: "123456",
        confirmPassword: "123456",
    });

    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const { loading, error, signUp } = useSignUpWithEmailAndPassword();

    useEffect(() => {
        console.log("inputs", inputs);
    }, [inputs]);

    useEffect(() => {
        console.log("error rerender", error);
    }, [error]);

    const handleSignUp = (event) => {
        event.preventDefault();
        
        signUp(inputs);
    };

    return (
        <form onSubmit={handleSignUp}>
            <Input
                id="username"
                required
                placeholder="Username"
                type="text"
                value={inputs.username}
                onChange={(e) =>
                    setInputs({ ...inputs, username: e.target.value })
                }
                variant="filled"
                size={"sm"}
                mb={3}
            />

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
                size={"sm"}
                mb={3}
            />

            <PasswordInput
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
                setInput={(e) => setInputs({ ...inputs, confirmPassword: e })}
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
        </form>
    );
};

export default SignUp;
