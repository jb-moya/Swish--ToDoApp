import { useState, useCallback } from "react";
import { firestore } from "../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";

function useDeleteTask() {
    const showToast = useShowToast();

    const authUser = useAuthStore((state) => state.user);
    const { tasks, setTasks } = useTaskStore();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteTask = useCallback(async (task) => {
        // if (!window.confirm("Are you sure you want to delete this post?"))
        //     return;
        if (isDeleting) return;

        try {
            console.log("tasks ni user", task);

            setIsDeleting(true);
            const userRef = doc(firestore, "users", authUser.uid);
            await deleteDoc(doc(firestore, "tasks", task.id));

            await updateDoc(userRef, {
                tasks: arrayRemove(task.id),
            });

            setTasks(authUser.tasks.filter((id) => id !== task.id));

            showToast("Success", "Task deleted successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsDeleting(false);
        }
    }, [authUser, showToast, setTasks, isDeleting]);

    return { isDeleting, handleDeleteTask };
}

export default useDeleteTask;
