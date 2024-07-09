// import { Button, Text } from "@chakra-ui/react";
// import { FcGoogle } from "react-icons/fc";
// import { useSignInWithGoogle } from "react-firebase-hooks/auth";
// import { auth, firestore } from "../../firebase/firebase";
// import useShowToast from "../../hooks/useShowToast";
// import useAuthStore from "../../store/authStore";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const GoogleAuth = ({ prefix }) => {
//     const [signInWithGoogle, , , error] = useSignInWithGoogle(auth);
//     const showToast = useShowToast();
//     const loginUser = useAuthStore((state) => state.login);

//     const handleGoogleAuth = async () => {
//         try {
//             const newUser = await signInWithGoogle();
//             if (!newUser && error) {
//                 showToast("Error", error.message, "error");
//                 return;
//             }
//             const userRef = doc(firestore, "users", newUser.user.uid);
//             const userSnap = await getDoc(userRef);

//             if (userSnap.exists()) {
//                 // login
//                 const userDoc = userSnap.data();
//                 localStorage.setItem("user-info", JSON.stringify(userDoc));
//                 loginUser(userDoc);
//             } else {
//                 // signup
//                 const userDoc = {
//                     uid: newUser.user.uid,
//                     email: newUser.user.email,
//                     username: newUser.user.email.split("@")[0],
//                     profilePicURL: newUser.user.photoURL,
//                     tasks: [],
//                     categories: [],
//                     createdAt: Date.now(),
//                 };
//                 await setDoc(
//                     doc(firestore, "users", newUser.user.uid),
//                     userDoc
//                 );
//                 localStorage.setItem("user-info", JSON.stringify(userDoc));
//                 loginUser(userDoc);
//             }
//         } catch (error) {
//             showToast("Error", error.message, "error");
//         }
//     };

//     return (
//         <>
//             <Button
//                 align="center"
//                 variant={"outline"}
//                 size="md"
//                 width="full"
//                 textAlign="center"
//                 alignItems={"center"}
//                 onClick={handleGoogleAuth}
//             >
//                 <FcGoogle />
//                 <Text ml={2}>{prefix} with Google</Text>
//             </Button>
//         </>
//     );
// };

// export default GoogleAuth;

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
