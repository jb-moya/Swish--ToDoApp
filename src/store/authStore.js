import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user-info")) || { categories: {} },
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    isGuest: JSON.parse(localStorage.getItem("isGuest")) || false,

    login: (user) => {
        localStorage.setItem("user-info", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", JSON.stringify(true));
        localStorage.setItem("isGuest", JSON.stringify(false));
        set({ user, isLoggedIn: true, isGuest: false });
    },

    logout: () => {
        localStorage.removeItem("user-info");
        localStorage.setItem("isLoggedIn", JSON.stringify(false));
        localStorage.setItem("isGuest", JSON.stringify(false));
        set({ user: null, isLoggedIn: false, isGuest: false });
    },

    guestLogin: () => {
        localStorage.removeItem("user-info");
        localStorage.setItem("isLoggedIn", JSON.stringify(false));
        localStorage.setItem("isGuest", JSON.stringify(true));
        set({ user: {}, isLoggedIn: false, isGuest: true });
    },

    setUser: (user) => {
        localStorage.setItem("user-info", JSON.stringify(user));
        set({ user });
    },
}));

export default useAuthStore;
