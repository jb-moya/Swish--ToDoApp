import { useEffect, useState } from "react";
import useTaskStore from "../store/taskStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { convertFirestoreTimestampToDate } from "../components/utils/dateFormat";

const useGetAllTasks = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { tasks, setTasks } = useTaskStore();
    const setAuthUser = useAuthStore((state) => state.setUser);
    const authUser = useAuthStore((state) => state.user);
    const showToast = useShowToast();

    const getAllTasks = async () => {
        setIsLoading(true);
        setTasks([]);

        const q = query(
            collection(firestore, "tasks"),
            where("createdBy", "==", authUser.uid)
        );

        try {
            const querySnapshot = await getDocs(q);
            const tasks = [];

            querySnapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });

            const updatedUserInfo = {
                ...authUser,
                tasks: tasks.map((task) => task.id),
            };

            localStorage.setItem("user-info", JSON.stringify(updatedUserInfo));
            setAuthUser(updatedUserInfo);

            console.log("Task", tasks)
            
            tasks.forEach((task) => {
                task.dueDate = convertFirestoreTimestampToDate(task.dueDate);
            });
            
            tasks.sort((a, b) => b.createdAt - a.createdAt);
            setTasks(tasks);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // console.log("getting on load");
        getAllTasks();
    }, []);

    return { isLoading, tasks };
};

export default useGetAllTasks;
