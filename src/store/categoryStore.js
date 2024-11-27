import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCategoryStore = create(
    persist(
        (set) => ({
            categoriesTaskCount: {},
            selectedCategoryId: -1,

            setSelectedCategoryId: (ID) => set({ selectedCategoryId: ID }),

            setCategoriesTaskCount: (categoriesTaskCount) =>
                set({ categoriesTaskCount }),
        }),
        { name: "category-store" } // Key to persist state
    )
);

export default useCategoryStore;
