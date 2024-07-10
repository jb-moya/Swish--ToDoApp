import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Box,
    Container,
    Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";

const Home = () => {
    const { handleAddTask, isAddTaskLoading } = useAddTask();
    const [openTaskEditable, setOpenTaskEditable] = useState(false);

    const { isLoading: isLoadingTasks, tasks: allTasks } = useGetAllTasks();
    const { tasks } = useTaskStore();

    const handleAddingTask = async (task) => {
        try {
            await handleAddTask(task);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log("tasks in home", tasks);
    }, [tasks]);

    return (
        <>
            <Box h="60px">
                <Navbar />
            </Box>
            <Container maxW="5xl" centerContent>
                {openTaskEditable ? (
                    <TaskEditable
                        onCancel={() => setOpenTaskEditable(false)}
                        onSave={handleAddingTask}
                        isLoading={isAddTaskLoading}
                    />
                ) : (
                    <Button
                        mt={4}
                        width="full"
                        variant="ghost"
                        onClick={() => setOpenTaskEditable(true)}
                        isLoading={isAddTaskLoading}
                    >
                        Add Task
                    </Button>
                )}

                {isLoadingTasks && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        mt="10"
                    >
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="brand.300"
                            size="xl"
                        />
                        <Box ml="3">Loading tasks...</Box>
                    </Box>
                )}

                {!isLoadingTasks &&
                    tasks.map((task) => (
                        <TaskContainer key={task.id} task={task} />
                    ))}

                {!isLoadingTasks && tasks.length === 0 && (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <p>No tasks found</p>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default Home;
