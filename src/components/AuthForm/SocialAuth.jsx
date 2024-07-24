import { FcGoogle} from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";

import {
    useSignInWithFacebook,
    useSignInWithGithub,
    useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";

import SocialAuthButton from "../SocialAuthButton";

const GoogleAuth = ({prefix}) => {
    const [signInWithGoogle] = useSignInWithGoogle(auth);

    return (
        <SocialAuthButton
            prefix={prefix}
            signInMethod={signInWithGoogle}
            icon={<FcGoogle />}
            provider="Google"
        />
    );
};

const FacebookAuth = ({prefix}) => {
    const [signInWithFacebook] = useSignInWithFacebook(auth);

    return (
        <SocialAuthButton
            prefix={prefix}
            signInMethod={signInWithFacebook}
            icon={<FaFacebook />}
            provider="Facebook"
        />
    );
};

const GithubAuth = ({prefix}) => {
    const [signInWithGithub] = useSignInWithGithub(auth);

    return (
        <SocialAuthButton
            prefix={prefix}
            signInMethod={signInWithGithub}
            icon={<FaGithub />}
            provider="Github"
        />
    );
};

export { GoogleAuth, FacebookAuth, GithubAuth };
