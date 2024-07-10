import { useState } from "react";
import { firestore } from "../firebase/firebase";
import { arrayRemove, deleteDoc, doc, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";

function useEditTask() {
    const showToast = useShowToast();
    const authUser = useAuthStore((state) => state.user);
    const { tasks, setTasks } = useTaskStore();
    const [isEditing, setIsEditing] = useState(false);

    const handleEditTask = async (task) => {
        if (isEditing) return;
        setIsEditing(true);

        try {
            const taskRef = doc(firestore, "tasks", task.id);

            // Prepare an object with only the fields that are provided in the task parameter
            const updateData = {};
            if (task.taskName !== undefined) {
                updateData.taskName = task.taskName;
            }
            if (task.description !== undefined) {
                updateData.description = task.description;
            }
            if (task.isCompleted !== undefined) {
                updateData.isCompleted = task.isCompleted;
            }

            // Update the document with the fields present in updateData
            await updateDoc(taskRef, updateData);

            showToast("Success", "Task Updated successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsEditing(false);
        }
    };

    return { isEditing, handleEditTask };
}

export default useEditTask;
