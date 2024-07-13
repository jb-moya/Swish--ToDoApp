import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import {
    Button,
    Box,
    Container,
    Spinner,
    useBreakpointValue,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalBody,
    ModalContent,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import useDeleteTask from "../hooks/useDeleteTask";

const Home = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleAddTask, isAddTaskLoading } = useAddTask();
    const { isDeleting, handleDeleteTasks } = useDeleteTask();

    const { isLoading: isLoadingTasks } = useGetAllTasks();
    const [isAllTasksUncompleted, setIsAllTasksUncompleted] = useState(true);
    const { tasks } = useTaskStore();

    useEffect(() => {
        if (tasks.length > 0) {
            setIsAllTasksUncompleted(tasks.every((task) => !task.isCompleted));
        }
    }, [tasks]);

    const handleAddingTask = async (task) => {
        try {
            console.log("tasl", task);
            await handleAddTask(task);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeletingCompletedTasks = async () => {
        try {
            await handleDeleteTasks(tasks.filter((task) => task.isCompleted));
        } catch (error) {
            console.log(error);
        }
    };

    const buttonText = useBreakpointValue({
        base: <FaPlus />,
        sm: "Add New Task",
    });

    const isSmallScreen = useBreakpointValue({ base: true, sm: false });

    return (
        <>
            <Box h="60px">
                <Navbar />
            </Box>
            <Container maxW="5xl" centerContent>
                {isSmallScreen ? (
                    <Modal
                        p={0}
                        m={0}
                        width="fit-content"
                        isCentered
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent p={0} m={0}>
                            <ModalBody p={0} m={0}>
                                <TaskEditable
                                    onCancel={onClose}
                                    onSave={handleAddingTask}
                                    isLoading={isAddTaskLoading}
                                    isAddingNewTask
                                />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                ) : (
                    isOpen && (
                        <TaskEditable
                            onCancel={onClose}
                            onSave={handleAddingTask}
                            isLoading={isAddTaskLoading}
                            isAddingNewTask
                        />
                    )
                )}

                {!isOpen && (
                    <Button
                        zIndex={2}
                        position={{ base: "fixed", sm: "static" }}
                        mt={4}
                        width={{ base: "auto", sm: "full" }}
                        bottom={10}
                        right={10}
                        variant={{ base: "solid", sm: "ghost" }}
                        onClick={onOpen}
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

                <Box
                    position={"relative"}
                    width={"full"}
                    py={2}
                    borderBottom={`1px solid ${useColorModeValue(
                        "rgba(126, 132, 144, 0.3)",
                        "rgba(126, 132, 144, 0.3)"
                    )}`}
                >
                    <Button
                        size={"sm"}
                        ml={-3}
                        leftIcon={<Icon as={RiDeleteBin3Line} boxSize={5} />}
                        variant="ghost"
                        isDisabled={
                            tasks.length === 0 ||
                            isLoadingTasks ||
                            isAllTasksUncompleted
                        }
                        onClick={handleDeletingCompletedTasks}
                        isLoading={isDeleting}
                    >
                        Clear Completed
                    </Button>
                </Box>

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
