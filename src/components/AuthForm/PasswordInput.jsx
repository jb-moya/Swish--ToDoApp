import {
    Icon,
    Input,
    Box,
    // FormLabel,
    // FormControl,
} from "@chakra-ui/react";
import { Button } from "../ui/button";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useColorModeValue } from "../ui/color-mode";
import { Field } from "../ui/field";
const PasswordInput = ({
    placeholder,
    showPassword,
    setShowPassword,
    input,
    setInput,
}) => {
    return (
        <Box position={"relative"}>
            <Field
                key={showPassword}
                isRequired
                variant="floating"
                required
                label={placeholder}
            >
                <Input
                    size={"sm"}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={input}
                    variant="flushed"
                    onChange={(e) => setInput(e.target.value)}
                />
            </Field>

            <Button
                position={"absolute"}
                opacity={0.5}
                right={0}
                bottom={0}
                variant={"ghost"}
                size={"sm"}
                fontWeight={"thin"}
                onClick={setShowPassword}
            >
                {showPassword ? (
                    <Icon>
                        <AiFillEye />
                    </Icon>
                ) : (
                    <Icon>
                        <AiFillEyeInvisible />
                    </Icon>
                )}
            </Button>
        </Box>
    );
};

export default PasswordInput;
