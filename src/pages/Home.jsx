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
    Flex,
    MenuButton,
    Portal,
    Spacer,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";
import useFilterScheduleStore from "../store/filterScheduleStore";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import useDeleteTask from "../hooks/useDeleteTask";
import useDateFormat from "../components/utils/dateFormat";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BiSort } from "react-icons/bi";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import useCategoryStore from "../store/categoryStore";

const messages = [
    "Enjoy the calm and take some time for yourself. You've earned this moment of relaxation!",
    "Take a breather and enjoy the moment!",
    "You're all done—time to relax and recharge.",
    "No tasks? No problem! Enjoy your free time.",
    "Everything is checked off. Well done!",
    "Your to-do list is clear. Time for some you-time.",
    "No tasks on the horizon. Enjoy the calm.",
    "You've earned a break. Take it easy!",
    "Mission accomplished. Take some time for yourself.",
    "Your task list is empty. Savor the peace.",
    "All tasks completed. Kick back and relax!",
];

const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
};

const Home = () => {
    const randomMessage = useMemo(() => getRandomMessage(), []);
    const { filter } = useFilterScheduleStore();
    const { selectedCategoryIndex } = useCategoryStore();
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

    useEffect(() => {
        sortTasks(); // Sort tasks whenever the component mounts or sorting configuration changes
    }, [sortTasks, sortConfig]);

    useEffect(() => {
        console.log("task", tasks);
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

    const pinnedTasks = tasks.filter((task) => task.isPinned);
    const nonPinnedTasks = tasks.filter((task) => !task.isPinned);
    const sortedTasks = [...pinnedTasks, ...nonPinnedTasks];

    const filteredCategoryTasks = sortedTasks.filter((task) => {
        if (selectedCategoryIndex !== -1) {
            return task.category === selectedCategoryIndex;
        } else {
            return !task.category;
        }
    });

    const filteredScheduleTasks = filteredCategoryTasks.filter((task) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (filter.value === "all") {
            return true;
        } else if (filter.value === "overdue") {
            return task.dueDate && new Date(task.dueDate) < today;
        } else if (filter.value === "today") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                      today.getTime()
                : false;
        } else if (filter.value === "tomorrow") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                      tomorrow.getTime()
                : false;
        } else if (filter.value === "upcoming") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) > today.getTime()
                : false;
        } else if (filter.value === "unscheduled") {
            return !task.dueDate;
        }
    });

    const noTaskHeadingStyle = useColorModeValue(
        "rgba(0, 163, 196, 0.8)",
        "rgba(0, 163, 196, 0.8)"
    );

    return (
        <>
            <Container maxW="5xl" px={9} centerContent>
                {/* <Box width={"full"} h="60px"> */}
                <Navbar />
                {/* </Box> */}

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
                    mt={6}
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
                        {isSmallScreen ? "Delete" : "Delete Completed Tasks"}
                    </Button>

                    <Divider orientation="vertical" />

                    <Spacer />
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
                                    pl={1}
                                    textColor={useColorModeValue(
                                        "gray.700",
                                        "gray.100"
                                    )}
                                    fontWeight={"thin"}
                                    opacity={0.75}
                                >
                                    {!isSmallScreen ? "Sort by:" : "Sort"}
                                </Box>
                                {!isSmallScreen && (
                                    <Box>
                                        {sortConfig.key === "dueDate"
                                            ? "Due date"
                                            : sortConfig.key === "priority"
                                            ? "Priority"
                                            : "Task Name"}
                                    </Box>
                                )}
                            </HStack>
                        </MenuButton>
                        <Portal>
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
                        </Portal>
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
                        zIndex={1} // 2
                        position={{ base: "fixed", sm: "static" }}
                        mt={4}
                        width={{ base: "auto", sm: "full" }}
                        // width={"100%"}
                        bottom={{ base: 10, sm: "auto" }}
                        right={{ base: 10, sm: "auto" }}
                        // variant={{ base: "solid", sm: "ghost" }}
                        variant={"ghost"}
                        onClick={onOpen}
                        isLoading={isAddTaskLoading}
                    >
                        {buttonText}
                    </Button>
                )}

                {!isLoadingTasks &&
                    filteredScheduleTasks.map((task) => (
                        <TaskContainer key={task.id} task={task} />
                    ))}

                {!isLoadingTasks && filteredScheduleTasks.length === 0 && (
                    <Flex
                        position={"fixed"}
                        display="flex"
                        flexDirection={"column"}
                        height={"100vh"}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Box
                            fontSize="lg"
                            fontWeight="bold"
                            color={noTaskHeadingStyle}
                        >
                            All Caught Up!
                        </Box>
                        <Box>{randomMessage}</Box>
                    </Flex>
                )}
            </Container>
        </>
    );
};

export default Home;
