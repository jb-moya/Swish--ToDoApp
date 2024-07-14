import { useState, useCallback } from "react";
import { firestore } from "../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";

function useDeleteTask() {
    const showToast = useShowToast();

    const authUser = useAuthStore((state) => state.user);
    const { tasks, setTasks, deleteTasks, sortTasks } = useTaskStore();

    const [isDeleting, setIsDeleting] = useState(false);

    // if (!window.confirm("Are you sure you want to delete this post?"))
    //     return;
    const handleDeleteTasks = useCallback(
        async (tasksToDelete) => {
            if (isDeleting) return;

            try {
                setIsDeleting(true);
                const userRef = doc(firestore, "users", authUser.uid);

                // Delete each task and update the user's tasks array
                const deletePromises = tasksToDelete.map(async (task) => {
                    await deleteDoc(doc(firestore, "tasks", task.id));
                    await updateDoc(userRef, {
                        tasks: arrayRemove(task.id),
                    });
                });

                await Promise.all(deletePromises);

                // Update the state to remove the deleted tasks
                setTasks(
                    tasks.filter(
                        (task) =>
                            !tasksToDelete.some(
                                (delTask) => delTask.id === task.id
                            )
                    )
                );

                // deleteTasks(tasksToDelete);
                // sortTasks();


                showToast("Success", "Tasks deleted successfully", "success");
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setIsDeleting(false);
            }
        },
        [authUser, showToast, setTasks, isDeleting, tasks]
    );

    // const handleDeleteTask = useCallback(
    //     async (task) => {
    //         if (isDeleting) return;

    //         try {
    //             setIsDeleting(true);
    //             const userRef = doc(firestore, "users", authUser.uid);
    //             await deleteDoc(doc(firestore, "tasks", task.id));

    //             await updateDoc(userRef, {
    //                 tasks: arrayRemove(task.id),
    //             });

    //             setTasks(tasks.filter((task) => task.id !== task.id));

    //             showToast("Success", "Task deleted successfully", "success");
    //         } catch (error) {
    //             showToast("Error", error.message, "error");
    //         } finally {
    //             setIsDeleting(false);
    //         }
    //     },
    //     [authUser, showToast, setTasks, isDeleting, tasks]
    // );

    return { isDeleting, handleDeleteTasks };
}

export default useDeleteTask;
