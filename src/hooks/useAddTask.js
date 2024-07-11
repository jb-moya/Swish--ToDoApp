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
    const authUser = useAuthStore((state) => state.user);
    const setAuthUser = useAuthStore((state) => state.setUser);
    const { tasks, setTasks } = useTaskStore();

    const handleAddTask = async (task) => {
        if (isLoading) return;

        setIsLoading(true);

        const newTask = {
            taskName: task.taskName || "",
            description: task.description || "",
            dueDate: task.dueDate || null,
            priority: task.priority || 0,
            isCompleted: false,
            createdAt: Date.now(),
            createdBy: authUser.uid,
        };

        try {
            const taskDocRef = await addDoc(
                collection(firestore, "tasks"),
                newTask
            );

            const userDocRef = doc(firestore, "users", authUser.uid);

            // console.log("AuthUser Tasks", authUser);

            await updateDoc(userDocRef, { tasks: arrayUnion(taskDocRef.id) });

            setTasks([...tasks, { ...newTask, id: taskDocRef.id }]);

            showToast("Success", "Task created successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return { isAddTaskLoading: isLoading, handleAddTask };
}

export default useAddTask;
