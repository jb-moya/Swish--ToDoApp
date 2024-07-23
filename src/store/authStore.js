import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user-info")) || {
        categories: {},
    },
    isLoggedIn: false,
    login: (user) => {
        set({ user, isLoggedIn: true });
    },
    logout: () => {
        set({ user: null, isLoggedIn: false });
    },
    guestLogin: () => {
        set({ user: {}, isLoggedIn: false });
    },
    setUser: (user) => set({ user }),
}));

export default useAuthStore;
