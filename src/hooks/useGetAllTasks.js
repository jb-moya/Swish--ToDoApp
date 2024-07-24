import { useEffect, useState } from "react";
import useTaskStore from "../store/taskStore";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { convertFirestoreTimestampToDate } from "../components/utils/dateFormat";

const useGetAllTasks = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { tasks, setTasks, sortTasks } = useTaskStore();
    // const setAuthUser = useAuthStore((state) => state.setUser);
    const { authUser, isGuest } = useAuthStore((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    }));

    const showToast = useShowToast();

    const getAllTasks = async () => {
        setIsLoading(true);
        setTasks([]);

        try {
            if (!isGuest) {
                const q = query(
                    collection(firestore, "tasks"),
                    where("createdBy", "==", authUser.uid)
                );

                const querySnapshot = await getDocs(q);
                const tasks = [];

                querySnapshot.forEach((doc) => {
                    tasks.push({ id: doc.id, ...doc.data() });
                });

                tasks.forEach((task) => {
                    task.dueDate = convertFirestoreTimestampToDate(
                        task.dueDate
                    );
                    task.dueTime = convertFirestoreTimestampToDate(
                        task.dueTime
                    );
                });

                setTasks(tasks);
                sortTasks();
            } else {
                const storedTasks = JSON.parse(localStorage.getItem("tasks"));
                if (storedTasks) {
                    setTasks(storedTasks);
                }
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllTasks();
    }, []);

    return { isLoading, tasks };
};

export default useGetAllTasks;
