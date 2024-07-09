import useSocialAuth from "../hooks/useSocialAuth";
import { Button, Text } from "@chakra-ui/react";

const SocialAuthButton = ({ prefix, signInMethod, icon, provider }) => {
    const handleSocialAuth = useSocialAuth(signInMethod);

    return (
        <Button
            align="center"
            variant={"outline"}
            size="md"
            width="full"
            textAlign="center"
            alignItems={"center"}
            onClick={handleSocialAuth}
        >
            {icon}
            <Text ml={2}>
                {prefix} with {provider}
            </Text>
        </Button>
    );
};

export default SocialAuthButton;
