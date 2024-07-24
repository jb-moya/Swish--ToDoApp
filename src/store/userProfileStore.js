import { create } from "zustand";

const useUserProfileStore = create((set) => ({
    userProfile: null,
    setUserProfile: (userProfile) => set({ userProfile }),
    addTask: (task) =>
        set((state) => ({
            userProfile: {
                ...state.userProfile,
                tasks: [task.id, ...state.userProfile.tasks],
            },
        })),
        
    deletePost: (taskId) =>
        set((state) => ({
            userProfile: {
                ...state.userProfile,
                tasks: state.userProfile.tasks.filter((id) => id !== taskId),
            },
        })),
}));

export default useUserProfileStore;