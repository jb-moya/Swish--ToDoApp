import useShowToast from "../hooks/useShowToast";
import { useCallback } from "react";
import { firestore } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useSocialAuth = (signInMethod) => {
    const showToast = useShowToast();
    const loginUser = useAuthStore((state) => state.login);
    const setAuthUser = useAuthStore((state) => state.setUser);

    const handleSocialAuth = useCallback(async () => {
        try {
            const newUser = await signInMethod();
            if (!newUser) {
                return;
            }
            const userRef = doc(firestore, "users", newUser.user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userDoc = userSnap.data();
                localStorage.setItem("user-info", JSON.stringify(userDoc));
                loginUser(userDoc); 
            } else {
                const userDoc = {
                    uid: newUser.user.uid,
                    email: newUser.user.email,
                    username: newUser.user.email.split("@")[0],
                    profilePicURL: newUser.user.photoURL,
                    tasks: [],
                    categories: [],
                    createdAt: Date.now(),
                };
                await setDoc(userRef, userDoc);
                localStorage.setItem("user-info", JSON.stringify(userDoc));
                loginUser(userDoc);
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }, [signInMethod, loginUser, showToast]);

    return handleSocialAuth;
};

export default useSocialAuth;
