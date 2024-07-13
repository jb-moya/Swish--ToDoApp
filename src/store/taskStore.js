import { create } from "zustand";

const useTaskStore = create((set) => ({
    tasks: [],
    sortConfig: { key: "dueDate", direction: "ascending" },

    addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
    deleteTasks: (tasksToDelete) =>
        set((state) => ({
            tasks: state.tasks.filter(
                (task) =>
                    !tasksToDelete.some((delTask) => delTask.id === task.id)
            ),
        })),
    setTasks: (tasks) => set({ tasks }),

    sortTasks: () =>
        set((state) => {
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
            return { sortConfig: { key, direction } };
        }),
}));

export default useTaskStore;
