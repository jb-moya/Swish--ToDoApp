import { useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";
import useAuthStore from "../store/authStore";
import { useShallow } from "zustand/shallow";

function useEditTask() {
    const showToast = useShowToast();
    const [isEditing, setIsEditing] = useState(false);
    const { editTask } = useTaskStore();
    const { isGuest } = useAuthStore(useShallow((state) => ({
        isGuest: state.isGuest,
    })));

    const handleEditTask = async (task) => {
        if (isEditing) return;
        setIsEditing(true);

        try {
            const updatedTaskInfo = {};
            if (task.taskName !== undefined) {
                updatedTaskInfo.taskName = task.taskName;
            }
            if (task.description !== undefined) {
                updatedTaskInfo.description = task.description;
            }
            if (task.isCompleted !== undefined) {
                updatedTaskInfo.isCompleted = task.isCompleted;
            }
            if (task.dueDate !== undefined) {
                updatedTaskInfo.dueDate = task.dueDate;
            }
            if (task.dueTime !== undefined) {
                updatedTaskInfo.dueTime = task.dueTime;
            }
            if (task.priority !== undefined) {
                updatedTaskInfo.priority = task.priority;
            }
            if (task.category !== undefined) {
                updatedTaskInfo.category = task.category;
            }
            if (task.isPinned !== undefined) {
                updatedTaskInfo.isPinned = task.isPinned;
            }

            if (!isGuest) {
                const taskRef = doc(firestore, "tasks", task.id);
                await updateDoc(taskRef, updatedTaskInfo);
            } else {
                const storedTasks = JSON.parse(localStorage.getItem("tasks"));
                const updatedTasks = storedTasks.map((storedTask) => {
                    if (storedTask.id === task.id) {
                        return { ...storedTask, ...updatedTaskInfo };
                    }
                    return storedTask;
                });
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            }

            editTask({ ...task, ...updatedTaskInfo });

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
