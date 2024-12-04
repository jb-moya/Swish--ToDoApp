import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import useShowToast from "./useShowToast";
import { auth, firestore } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useLogin = () => {
    const showToast = useShowToast();
    const [signInWithEmailAndPassword, , loading, error] =
        useSignInWithEmailAndPassword(auth);

    const loginUser = useAuthStore((state) => state.login);
    const loginStart = useAuthStore((state) => state.loginStart);
    const loginEnd = useAuthStore((state) => state.loginEnd);

    const login = async (inputs) => {
        if (!inputs.email || !inputs.password) {
            return showToast("Error", "Please fill all the fields", "error");
        }

        try {
            loginStart();
            const userCred = await signInWithEmailAndPassword(
                inputs.email,
                inputs.password
            );

            if (userCred) {
                const docRef = doc(firestore, "users", userCred.user.uid);
                const docSnap = await getDoc(docRef);
                localStorage.setItem(
                    "user-info",
                    JSON.stringify(docSnap.data())
                );
                loginUser(docSnap.data());
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            loginEnd();
        }
    };

    return { loading, error, login };
};

export default useLogin;
