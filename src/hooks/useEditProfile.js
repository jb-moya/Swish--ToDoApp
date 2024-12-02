import { useState } from "react";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useUserProfileStore from "../store/userProfileStore";
import { useShallow } from "zustand/shallow";

const useEditProfile = () => {
    const [isProfileUpdating, setIsProfileUpdating] = useState(false);

    const { authUser, isGuest } = useAuthStore(useShallow((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    })));
    const setAuthUser = useAuthStore((state) => state.setUser);
    const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

    const showToast = useShowToast();

    const editProfile = async (inputs, selectedFile) => {
        if (isProfileUpdating || !authUser) return;
        setIsProfileUpdating(true);

        try {
            const updatedUser = {
                ...authUser,
                categories: inputs.categories || authUser.categories,
            };

            if (!isGuest) {
                const storageRef = ref(storage, `profilePics/${authUser.uid}`);
                const userDocRef = doc(firestore, "users", authUser.uid);

                let URL = "";
                if (selectedFile) {
                    await uploadString(storageRef, selectedFile, "data_url");
                    URL = await getDownloadURL(
                        ref(storage, `profilePics/${authUser.uid}`)
                    );
                }

                (updatedUser.username = inputs.username || authUser.username),
                    (updatedUser.profilePicURL = URL || authUser.profilePicURL),
                    await updateDoc(userDocRef, updatedUser);
            }

            localStorage.setItem("user-info", JSON.stringify(updatedUser));
            setAuthUser(updatedUser);
            setUserProfile(updatedUser);
            showToast(
                "Success",
                "User profile updated successfully",
                "success"
            );
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsProfileUpdating(false);
        }
    };

    return { editProfile, isProfileUpdating };
};

export default useEditProfile;
