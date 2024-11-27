import { useState, useCallback } from "react";
import { firestore } from "../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";

function useDeleteTask() {
    const showToast = useShowToast();

    const { authUser, isGuest } = useAuthStore((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    }));
    const { tasks, setTasks } = useTaskStore();

    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteTasks = useCallback(
        async (tasksToDelete) => {
            if (isDeleting) return;

            setIsDeleting(true);

            try {
                if (!isGuest) {
                    const userRef = doc(firestore, "users", authUser.uid);

                    // Delete each task and update the user's tasks array
                    const deletePromises = tasksToDelete.map(async (task) => {
                        await deleteDoc(doc(firestore, "tasks", task.id));
                        await updateDoc(userRef, {
                            tasks: arrayRemove(task.id),
                        });
                    });

                    await Promise.all(deletePromises);
                } else {
                    const storedTasks = JSON.parse(
                        localStorage.getItem("tasks")
                    );
                    if (storedTasks) {
                        setTasks(
                            storedTasks.filter(
                                (task) =>
                                    !tasksToDelete.some(
                                        (delTask) => delTask.id === task.id
                                    )
                            )
                        );
                    }

                    localStorage.setItem(
                        "tasks",
                        JSON.stringify(
                            tasks.filter(
                                (task) =>
                                    !tasksToDelete.some(
                                        (delTask) => delTask.id === task.id
                                    )
                            )
                        )
                    );
                }

                // Update the state to remove the deleted tasks
                setTasks(
                    tasks.filter(
                        (task) =>
                            !tasksToDelete.some(
                                (delTask) => delTask.id === task.id
                            )
                    )
                );

                showToast("Success", "Tasks deleted successfully", "success");
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsDeleting(false);
            }
        },
        [authUser, showToast, setTasks, isDeleting, tasks]
    );

    return { isDeleting, handleDeleteTasks };
}

export default useDeleteTask;
