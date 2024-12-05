import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { auth } from "../firebase/firebase";
import { useUpdatePassword } from "react-firebase-hooks/auth";

const useUpdateUserPassword = () => {
    const [updatePassword, updating, error] = useUpdatePassword(auth);

    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    const updateUserPassword = async (newPassword) => {
        if (updating || !authUser) return;

        try {
            const success = await updatePassword(newPassword);
            if (success) {
                showToast(
                    "Success",
                    "Password updated successfully",
                    "success"
                );
            } else {
                showToast("Error", error.message, "error");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    return { updateUserPassword, isPasswordUpdating: updating, error };
};

export default useUpdateUserPassword;
