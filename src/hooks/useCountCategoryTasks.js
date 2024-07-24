import useTaskStore from "../store/taskStore";
import useAuthStore from "../store/authStore";
import useCategoryStore from "../store/categoryStore";
import { useEffect } from "react";

const useCountCategoryTasks = () => {
    const { tasks } = useTaskStore();
    const { setCategoriesTaskCount } = useCategoryStore();
    const { authUser } = useAuthStore((state) => ({
        authUser: state.user,
    }));

    const countCategoryTasks = () => {
        const categoriesTaskCount = {};
        authUser?.categories &&
            Object.entries(authUser.categories).forEach(([categoryID, _]) => {
                categoriesTaskCount[categoryID] = tasks.reduce((acc, count) => {
                    if (count.category === categoryID) {
                        return acc + 1;
                    }
                    return acc;
                }, 0);
            });


        setCategoriesTaskCount(categoriesTaskCount);
    };

    useEffect(() => {
        countCategoryTasks();
    }, [authUser.categories, tasks]);

    return { countCategoryTasks };
};

export default useCountCategoryTasks;
