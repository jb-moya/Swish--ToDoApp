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
    const { authUser, isLoggedIn } = useAuthStore((state) => ({
        authUser: state.user,
        isLoggedIn: state.isLoggedIn,
    }));

    const showToast = useShowToast();

    const getAllTasks = async () => {
        setIsLoading(true);
        setTasks([]);

        try {
            if (isLoggedIn) {
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
                });

                setTasks(tasks);
                sortTasks();
            } else {
                console.log("HINID LOGIN SO KUHA SA LOCAL HOST")
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
