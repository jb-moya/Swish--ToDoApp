import { create } from "zustand";

const useTaskStore = create((set) => ({
    tasks: [],
    addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
    setTasks: (tasks) => set({ tasks }),
    addComment: (taskId, comment) =>
        set((state) => ({
            tasks: state.tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        comments: [...task.comments, comment],
                    };
                }
                return task;
            }),
        })),
}));

export default useTaskStore;
