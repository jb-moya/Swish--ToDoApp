import { create } from "zustand";

const useFilterScheduleStore = create((set) => ({
    filter: { name: "Today", value: "today" },
    setFilter: (filter) => set({ filter }),
}));

export default useFilterScheduleStore;
