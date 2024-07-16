import { create } from "zustand";

const useFilterScheduleStore = create((set) => ({
    filter: { name: "All", value: "all" },
    setFilter: (filter) => set({ filter }),
}));

export default useFilterScheduleStore;
