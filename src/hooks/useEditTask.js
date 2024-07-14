import { useState } from "react";
import { firestore } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import useShowToast from "./useShowToast";
import useTaskStore from "../store/taskStore";

function useEditTask() {
    const showToast = useShowToast();
    const [isEditing, setIsEditing] = useState(false);
    const { tasks, editTask } = useTaskStore();

    const handleEditTask = async (task) => {
        if (isEditing) return;
        setIsEditing(true);

        try {
            const taskRef = doc(firestore, "tasks", task.id);

            // Prepare an object with only the fields that are provided in the task parameter
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
            if (task.priority !== undefined) {
                updatedTaskInfo.priority = task.priority;
            }
            if (task.category !== undefined) {
                updatedTaskInfo.category = task.category;
            }

            await updateDoc(taskRef, updatedTaskInfo);

            console.log("oldTasks", tasks);

            editTask({ ...task, ...updatedTaskInfo });

            console.log("newTasks", tasks);
            // sortTasks();

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
