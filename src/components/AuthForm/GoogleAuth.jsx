import { Button, Text } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";

const GoogleAuth = () => {
    return (
        <>
            <Button
                align="center"
                variant={"outline"}
                size="md"
                width="full"
                textAlign="center"
                alignItems={"center"}
            >
                <FcGoogle />
                <Text ml={2}>LogIn with Google</Text>
            </Button>
        </>
    );
};

export default GoogleAuth;
