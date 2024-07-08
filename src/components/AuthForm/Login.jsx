import { Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import PasswordInput from "./PasswordInput";

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        console.log("inputs", inputs);
    }, [inputs]);

    return (
        <form>
            <Input
                id="email"
                required
                placeholder="Email"
                type="email"
                value={inputs.email}
                onChange={(e) =>
                    setInputs({ ...inputs, email: e.target.value })
                }
                size="sm"
                variant="filled"
                mb={3}
            />

            <PasswordInput
                showPassword={showPassword}
                setShowPassword={() => setShowPassword(!showPassword)}
                input={inputs.password}
                setInput={(e) => setInputs({ ...inputs, password: e })}
            />

            <Button size="md" width="full" mt={5} type="submit">
                LOGIN
            </Button>
        </form>
    );
};

export default Login;
