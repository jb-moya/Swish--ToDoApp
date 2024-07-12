import { useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useShowToast from "./useShowToast";

function useEditTask() {
    const showToast = useShowToast();
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
            if (task.dueDate !== undefined) {
                updateData.dueDate = task.dueDate;
            }
            if (task.priority !== undefined) {
                updateData.priority = task.priority;
            }
            if (task.category !== undefined) {
                updateData.category = task.category;
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
