import useSocialAuth from "../hooks/useSocialAuth";
import { Text } from "@chakra-ui/react";
import { Button } from "./ui/button";
import useLogin from "../hooks/useLogin";
import useAuthStore from "../store/authStore";

const SocialAuthButton = ({ prefix, signInMethod, icon, provider }) => {
    const { handleSocialAuth, isLogging } = useSocialAuth(signInMethod);
    const isLoggingIn = useAuthStore((state) => state.isLoggingIn);

    return (
        <Button
            align="center"
            variant={"outline"}
            size="md"
            width="full"
            textAlign="center"
            alignItems={"center"}
            onClick={handleSocialAuth}
            loading={isLogging}
            loadingText={"Signing in..."}
            disabled={isLogging || isLoggingIn}
        >
            {icon}
            <Text ml={2}>
                {prefix} with {provider}
            </Text>
        </Button>
    );
};

export default SocialAuthButton;
