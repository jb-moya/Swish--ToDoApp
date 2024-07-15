import { create } from "zustand";

const useCategoryStore = create((set) => ({
    selectedCategoryIndex: 0,

    setSelectedCategoryIndex: (index) => set({ selectedCategoryIndex: index }),
}));

export default useCategoryStore;
