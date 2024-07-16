import { create } from "zustand";

const useCategoryStore = create((set) => ({
    selectedCategoryIndex: -1,

    setSelectedCategoryIndex: (index) => set({ selectedCategoryIndex: index }),
}));

export default useCategoryStore;
