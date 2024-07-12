import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import {
    Button,
    Box,
    Container,
    Spinner,
    useBreakpointValue,
} from "@chakra-ui/react";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";
import { FaPlus } from "react-icons/fa6";

const Home = () => {
    const { handleAddTask, isAddTaskLoading } = useAddTask();
    const [openTaskEditable, setOpenTaskEditable] = useState(false);

    const { isLoading: isLoadingTasks, tasks: allTasks } = useGetAllTasks();
    const { tasks } = useTaskStore();

    const handleAddingTask = async (task) => {
        try {
            console.log("tasl", task);
            await handleAddTask(task);
        } catch (error) {
            console.log(error);
        }
    };

    const buttonText = useBreakpointValue({
        base: <FaPlus />,
        md: "Add New Task",
    });

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
                        isAddingNewTask
                    />
                ) : (
                    <Button
                        zIndex={2}
                        position={{ base: "absolute", md: "static" }}
                        mt={4}
                        width={{ base: "auto", md: "full" }}
                        bottom={10}
                        right={10}
                        variant={{ base: "solid", md: "ghost" }}
                        onClick={() => setOpenTaskEditable(true)}
                        isLoading={isAddTaskLoading}
                    >
                        {buttonText}
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
