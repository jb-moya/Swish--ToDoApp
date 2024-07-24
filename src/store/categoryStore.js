import { create } from "zustand";

const useCategoryStore = create((set) => ({
    categoriesTaskCount: {},
    selectedCategoryId: -1,

    setSelectedCategoryId: (ID) => set({ selectedCategoryId: ID }),

    setCategoriesTaskCount: (categoriesTaskCount) =>
        set({ categoriesTaskCount }),
}));

export default useCategoryStore;
