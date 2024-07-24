import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import {
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import useShowToast from "./useShowToast";
import useAuthStore from "../store/authStore";

const useSignUpWithEmailAndPassword = () => {
    const [createUserWithEmailAndPassword, , loading, error] =
        useCreateUserWithEmailAndPassword(auth);

    const showToast = useShowToast();

    const loginUser = useAuthStore((state) => state.login);

    const signUp = async (inputs) => {
        if (!inputs.username || !inputs.email || !inputs.password) {
            showToast("Error", "Please fill in all fields", "error");
            return;
        }

        if (inputs.password !== inputs.confirmPassword) {
            showToast("Error", "Passwords do not match", "error");
            return;
        }

        const usersRef = collection(firestore, "users");

        const q = query(usersRef, where("username", "==", inputs.username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            showToast("Error", "Username already exists", "error");
            return;
        }

        try {
            const newUser = await createUserWithEmailAndPassword(
                inputs.email,
                inputs.password
            );

            if (error) {
                showToast("Error", error.message, "error");
                return;
            }

            if (newUser) {
                const userDoc = {
                    uid: newUser.user.uid,
                    email: inputs.email,
                    username: inputs.username,
                    profilePicURL: "",
                    tasks: [],
                    categories: [],
                    created: new Date(),
                };

                await setDoc(
                    doc(firestore, "users", newUser.user.uid),
                    userDoc
                );

                localStorage.setItem("user-info", JSON.stringify(userDoc));

                loginUser(userDoc);
            }

        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return { signUp, loading, error };
};

export default useSignUpWithEmailAndPassword;
