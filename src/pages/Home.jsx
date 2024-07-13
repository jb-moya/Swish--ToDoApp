import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/NavBar";
import {
    Button,
    Box,
    Container,
    HStack,
    Spinner,
    useBreakpointValue,
    Modal,
    useDisclosure,
    ModalOverlay,
    ModalBody,
    ModalContent,
    Icon,
    useColorModeValue,
    Text,
    Divider,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import useDeleteTask from "../hooks/useDeleteTask";
import useDateFormat from "../components/utils/dateFormat";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BiSort } from "react-icons/bi";
import { BsSortDown, BsSortUp } from "react-icons/bs";

const Home = () => {
    const dateFormat = useDateFormat();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleAddTask, isAddTaskLoading } = useAddTask();
    const { isDeleting, handleDeleteTasks } = useDeleteTask();
    const { isLoading: isLoadingTasks } = useGetAllTasks();
    const [isAllTasksUncompleted, setIsAllTasksUncompleted] = useState(true);
    const { tasks, sortConfig, sortTasks, setSortConfig } = useTaskStore();

    useEffect(() => {
        if (tasks.length > 0) {
            setIsAllTasksUncompleted(tasks.every((task) => !task.isCompleted));
        }
    }, [tasks]);

    // problem with sorting :)

    useEffect(() => {
        sortTasks(); // Sort tasks whenever the component mounts or sorting configuration changes
    }, [sortConfig]);

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

    const groupTasksByDueDate = (tasks) => {
        return tasks.reduce((groups, task) => {
            const dueDate = dateFormat(task.dueDate);

            if (!groups[dueDate]) {
                groups[dueDate] = [];
            }

            groups[dueDate].push(task);
            return groups;
        }, {});
    };

    const groupedTasks = groupTasksByDueDate(tasks);

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

                <HStack
                    position={"relative"}
                    width={"full"}
                    height={"50px"}
                    py={3}
                    borderBottom={`1px solid ${useColorModeValue(
                        "rgba(126, 132, 144, 0.3)",
                        "rgba(126, 132, 144, 0.3)"
                    )}`}
                >
                    <Button
                        size={"sm"}
                        ml={-3}
                        py={0}
                        my={0}
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
                    <Divider orientation="vertical" />
                    <Menu>
                        <MenuButton
                            ml={2}
                            px={1}
                            as={Button}
                            variant={"outline"}
                            border={`1px solid ${useColorModeValue(
                                "rgba(0, 163, 196, 0.2)",
                                "rgba(0, 163, 196, 0.2)"
                            )}`}
                            size={"sm"}
                            rightIcon={<ChevronDownIcon />}
                        >
                            <HStack>
                                <Box
                                    textColor={useColorModeValue(
                                        "gray.700",
                                        "gray.100"
                                    )}
                                    opacity={0.5}
                                >
                                    Sort By
                                </Box>
                                <Box>
                                    {sortConfig.key === "dueDate"
                                        ? "Due date"
                                        : sortConfig.key === "priority"
                                        ? "Priority"
                                        : "Task Name"}
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                as={Button}
                                onClick={() => setSortConfig("taskName")}
                            >
                                Task Name
                            </MenuItem>
                            <MenuItem
                                as={Button}
                                onClick={() => setSortConfig("dueDate")}
                            >
                                Due date
                            </MenuItem>
                            <MenuItem
                                as={Button}
                                onClick={() => setSortConfig("priority")}
                            >
                                Priority
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Button
                        px={1}
                        variant={"ghost"}
                        size={"sm"}
                        rightIcon={
                            sortConfig.direction === "ascending" ? (
                                <Icon as={BsSortDown} />
                            ) : (
                                <Icon as={BsSortUp} />
                            )
                        }
                        onClick={() => setSortConfig(sortConfig.key)}
                    >
                        {sortConfig.direction === "ascending" ? "asc" : "desc"}
                    </Button>
                </HStack>

                {!isLoadingTasks &&
                    tasks
                        .map((task) => (
                            <TaskContainer key={task.id} task={task} />
                        ))
                        .sort((a, b) => b.dueDate - a.dueDate)}

                {/* {!isLoadingTasks &&
                    Object.keys(groupedTasks).map((dueDate) => (
                        <Box key={dueDate} w="full">
                            <Text fontSize="lg" mt={5}>{dueDate}</Text>
                            {groupedTasks[dueDate].map((task) => (
                                <TaskContainer key={task.id} task={task} />
                            ))}
                        </Box>
                    ))} */}

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
