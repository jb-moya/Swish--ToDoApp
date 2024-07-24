import {
    EmailAuthProvider,
    getAuth,
    reauthenticateWithCredential,
} from "firebase/auth";

import useShowToast from "./useShowToast";

const useReauthenticateWithCredential = () => {
    const showToast = useShowToast();
    const auth = getAuth();

    const verifyPassword = async (currentPassword) => {
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        try {
            const result = await reauthenticateWithCredential(
                auth.currentUser,
                credential
            );

            return result;
        } catch (error) {
            showToast("Error Validating Password", error.message, "error");
            return false;
        }
    };

    return { verifyPassword };
};

export default useReauthenticateWithCredential;
