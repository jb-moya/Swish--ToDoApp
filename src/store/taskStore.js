import { create } from "zustand";

const useTaskStore = create((set, get) => ({
    tasks: [],
    sortConfig: { key: "taskName", direction: "ascending" },

    addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
    deleteTasks: (tasksToDelete) =>
        set((state) => ({
            tasks: state.tasks.filter(
                (task) =>
                    !tasksToDelete.some((delTask) => delTask.id === task.id)
            ),
        })),
    editTask: (editedTask) => {
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === editedTask.id ? editedTask : task
            ),
        }));
    },

    getTasks: (schedule = "all", category = -1, isCompleted = false) => {
        let tasks = get().tasks;

        if (isCompleted) {
            tasks = tasks.filter((task) => task.isCompleted);
        }

        if (category !== -1) {
            tasks = tasks.filter((task) => task.category === category);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        tasks = tasks.filter((task) => {
            if (schedule === "all") {
                return true;
            } else if (schedule === "overdue") {
                return task.dueDate && new Date(task.dueDate) < today;
            } else if (schedule === "today") {
                return (
                    task.dueDate &&
                    new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                        today.getTime()
                );
            } else if (schedule === "tomorrow") {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return (
                    task.dueDate &&
                    new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                        tomorrow.getTime()
                );
            } else if (schedule === "upcoming") {
                return (
                    task.dueDate &&
                    new Date(task.dueDate).setHours(0, 0, 0, 0) >
                        today.getTime()
                );
            } else if (schedule === "unscheduled") {
                return !task.dueDate;
            }
            return false; // Default case to handle unexpected values
        });

        return tasks;
    },

    setTasks: (tasks) => set({ tasks }),

    sortTasks: () =>
        set((state) => {
            console.log("statee e", state);
            const sortedTasks = [...state.tasks];
            const { key, direction } = state.sortConfig;
            sortedTasks.sort((a, b) => {
                let aValue = a[key];
                let bValue = b[key];

                // Convert to lowercase for case-insensitive comparison if the key is taskName
                if (key === "taskName") {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                // Convert to Date objects if the key is dueDate
                if (key === "dueDate") {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }

                if (aValue < bValue) {
                    return direction === "ascending" ? -1 : 1;
                }
                if (aValue > bValue) {
                    return direction === "ascending" ? 1 : -1;
                }
                return 0;
            });

            console.log("sortedTasks", sortedTasks);
            return { tasks: sortedTasks };
        }),

    setSortConfig: (key) =>
        set((state) => {
            let direction = "ascending";
            if (
                state.sortConfig.key === key &&
                state.sortConfig.direction === "ascending"
            ) {
                direction = "descending";
            }
            console.log("keyy", key, direction);
            return { sortConfig: { key, direction } };
        }),
}));

export default useTaskStore;
