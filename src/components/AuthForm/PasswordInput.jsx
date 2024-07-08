import {
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Button,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const PasswordInput = ({ placeholder, showPassword, setShowPassword, input, setInput }) => {
    return (
        <InputGroup key={showPassword} size={"sm"} mb={3}>
            <Input
                required
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder={placeholder ? placeholder : "Password"}
                value={input}
                variant="filled"
                onChange={(e) => setInput(e.target.value)}
            />
            <InputRightElement h="full">
                <Button
                    opacity={0.5}
                    variant={"ghost"}
                    fontWeight={"thin"}
                    onClick={setShowPassword}
                >
                    {showPassword ? (
                        <Icon as={ViewIcon} />
                    ) : (
                        <Icon as={ViewOffIcon} />
                    )}
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};

PasswordInput.propTypes = {
    placeholder: PropTypes.string,
    showPassword: PropTypes.bool.isRequired,
    setShowPassword: PropTypes.func.isRequired,
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
};

export default PasswordInput;
