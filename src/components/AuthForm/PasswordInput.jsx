import {
    Icon,
    Input,
    Button,
    Box,
    FormLabel,
    FormControl,
    useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const PasswordInput = ({
    placeholder,
    showPassword,
    setShowPassword,
    input,
    setInput,
}) => {
    return (
        <Box position={"relative"}>
            <FormControl
                key={showPassword}
                isRequired
                variant="floating"
            >
                <Input
                    size={"sm"}
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    value={input}
                    variant="flushed"
                    onChange={(e) => setInput(e.target.value)}
                />

                <FormLabel
                    fontWeight={"thin"}
                    size={"sm"}
                    bg={useColorModeValue("#fff", "#2d3748")}
                >
                    {placeholder}
                </FormLabel>
            </FormControl>

            <Button
                position={"absolute"}
                opacity={0.5}
                right={0}
                top={0}
                variant={"ghost"}
                size={"sm"}
                fontWeight={"thin"}
                onClick={setShowPassword}
            >
                {showPassword ? (
                    <Icon as={ViewIcon} />
                ) : (
                    <Icon as={ViewOffIcon} />
                )}
            </Button>
        </Box>
    );
};

export default PasswordInput;
