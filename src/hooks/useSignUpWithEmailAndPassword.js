import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
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

        try {
            const newUser = await createUserWithEmailAndPassword(
                inputs.email,
                inputs.password
            );

            // if (!newUser && error) {
            //     showToast("Error", error.message, "error");
            //     return;
            // }

            if (error) {
                showToast("Error", error.message, "error");
                return;
            }

            if (newUser) {
                const userDoc = {
                    username: inputs.username,
                    email: inputs.email,
                    profilePicURL: "",
                    uid: newUser.user.uid,
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

            console.log(newUser);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return { signUp, loading, error };
};

export default useSignUpWithEmailAndPassword;
