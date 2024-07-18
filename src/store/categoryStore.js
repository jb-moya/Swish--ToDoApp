import { create } from "zustand";

const useCategoryStore = create((set) => ({
    selectedCategoryId: -1,

    setSelectedCategoryId: (ID) => set({ selectedCategoryId: ID }),
}));

export default useCategoryStore;
