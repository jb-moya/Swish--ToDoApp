import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useAuthStore from "../store/authStore";
import useTaskStore from "../store/taskStore";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";

function useAddTask() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const { authUser, isGuest } = useAuthStore((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    }));
    const setAuthUser = useAuthStore((state) => state.setUser);
    const { tasks, setTasks, addTask } = useTaskStore();

    const handleAddTask = async (task) => {
        if (isLoading) return;

        setIsLoading(true);

        const newTask = {
            taskName: task.taskName || "",
            description: task.description || "",
            dueDate: task.dueDate || null,
            dueTime: task.dueTime || null,
            priority: task.priority || 0,
            category: task.category || null,
            isCompleted: false,
            createdAt: Date.now(),
            createdBy: authUser.uid,
        };

        try {
            if (!isGuest) {
                // User is logged in, save to Firestore
                const taskDocRef = await addDoc(
                    collection(firestore, "tasks"),
                    newTask
                );
                const userDocRef = doc(firestore, "users", authUser.uid);
                await updateDoc(userDocRef, {
                    tasks: arrayUnion(taskDocRef.id),
                });
                addTask({ ...newTask, id: taskDocRef.id });
                showToast("Success", "Task created successfully", "success");
            } else {
                // User is not logged in, store task locally
                const storedTasks =
                    JSON.parse(localStorage.getItem("tasks")) || [];
                storedTasks.push({ ...newTask, id: Date.now() }); // Use a timestamp as an ID
                localStorage.setItem("tasks", JSON.stringify(storedTasks));
                addTask({ ...newTask, id: Date.now() }); // Optionally update local state
                showToast("Success", "Task created locally", "success");
            }
        } catch (error) {
            console.log("error", error);
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }

        // try {
        //     const taskDocRef = await addDoc(
        //         collection(firestore, "tasks"),
        //         newTask
        //     );

        //     const userDocRef = doc(firestore, "users", authUser.uid);

        //     // console.log("AuthUser Tasks", authUser);

        //     await updateDoc(userDocRef, { tasks: arrayUnion(taskDocRef.id) });

        //     addTask({ ...newTask, id: taskDocRef.id });

        //     showToast("Success", "Task created successfully", "success");
        // } catch (error) {
        //     console.log("error", error);
        //     showToast("Error", error.message, "error");
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return { isAddTaskLoading: isLoading, handleAddTask };
}

export default useAddTask;
