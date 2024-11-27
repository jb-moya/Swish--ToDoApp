import { useEffect, useState, useMemo } from "react";
import Navbar from "../components/NavBar";
import {
    Button,
    Box,
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
    Divider,
    Menu,
    Flex,
    MenuButton,
    Portal,
    Spacer,
    MenuList,
    MenuItem,
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
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import useCategoryStore from "../store/categoryStore";
import CategorySelector from "../components/Task/CategorySelector";
import Footer from "../components/Footer";
import useShowToast from "../hooks/useShowToast";
import SidebarWithHeader from "../components/SideBarWithHeader";

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
    const showToast = useShowToast();

    const randomMessage = useMemo(() => getRandomMessage(), []);
    const { filter } = useFilterScheduleStore();
    const { selectedCategoryId, setSelectedCategoryId } = useCategoryStore();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleAddTask, isAddTaskLoading } = useAddTask();
    const { isDeleting, handleDeleteTasks } = useDeleteTask();
    const { isLoading: isLoadingTasks } = useGetAllTasks();
    const [isAllTasksUncompleted, setIsAllTasksUncompleted] = useState(true);
    const { tasks, sortConfig, sortTasks, setSortConfig, getTasks } =
        useTaskStore();

    useEffect(() => {
        if (tasks.length > 0) {
            setIsAllTasksUncompleted(tasks.every((task) => !task.isCompleted));
        }
    }, [tasks]);

    useEffect(() => {
        sortTasks(); // Sort tasks whenever the component mounts or sorting configuration changes
    }, [sortTasks, sortConfig]);

    const handleAddingTask = async (task) => {
        try {
            await handleAddTask(task);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategoryId(value);
    };

    const handleDeletingCompletedTasks = async () => {
        try {
            await handleDeleteTasks(
                getTasks(filter.value, selectedCategoryId).filter(
                    (task) => task.isCompleted
                )
            );
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const buttonText = useBreakpointValue({
        base: <FaPlus />,
        sm: "Add New Task",
    });

    const isSmallScreen = useBreakpointValue({ base: true, md: false });

    const pinnedTasks = tasks.filter((task) => task.isPinned);
    const nonPinnedTasks = tasks.filter((task) => !task.isPinned);
    const sortedTasks = [...pinnedTasks, ...nonPinnedTasks];

    const filteredCategoryTasks = sortedTasks.filter((task) => {
        if (selectedCategoryId !== -1) {
            return task.category === selectedCategoryId;
        } else {
            return true;
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
            <Flex
                maxW="5xl"
                px={9}
                minH={"100vh"}
                direction={"column"}
                mx="auto"
            >
                <Navbar />

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
                    <SidebarWithHeader />

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
                        {isSmallScreen ? "" : "Delete Completed Tasks"}
                    </Button>
                    <Divider orientation="vertical" />

                    <CategorySelector
                        currentCategory={selectedCategoryId}
                        onCategoryChange={handleCategoryChange}
                        isEditMode={false}
                    />

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
                        onClick={() => setSortConfig(sortConfig.key)}
                    >
                        {!isSmallScreen && (
                            <Box mr={1}>
                                {sortConfig.direction === "ascending"
                                    ? "asc"
                                    : "desc"}
                            </Box>
                        )}
                        <Icon
                            as={
                                sortConfig.direction === "ascending"
                                    ? BsSortDown
                                    : BsSortUp
                            }
                        />
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

                {isLoadingTasks && (
                    <Box mt="10" textAlign={"center"} width={"100%"}>
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="brand.300"
                            size="xl"
                        />
                        <Box>Loading tasks...</Box>
                    </Box>
                )}

                {!isLoadingTasks &&
                    filteredScheduleTasks.map((task) => (
                        <TaskContainer key={task.id} task={task} />
                    ))}
                {!isOpen && (
                    <Button
                        zIndex={1} // 2
                        position={{ base: "fixed", sm: "static" }}
                        mt={4}
                        width={{ base: "auto", sm: "full" }}
                        bottom={{ base: 10, sm: "auto" }}
                        right={{ base: 10, sm: "auto" }}
                        variant={"ghost"}
                        onClick={onOpen}
                        isLoading={isAddTaskLoading}
                    >
                        {buttonText}
                    </Button>
                )}
                {!isLoadingTasks && filteredScheduleTasks.length === 0 && (
                    <Box textAlign={"center"} mt={40}>
                        <Box
                            fontSize="lg"
                            fontWeight="bold"
                            color={noTaskHeadingStyle}
                        >
                            You&apos;re all caught up!
                        </Box>
                        <Box>{randomMessage}</Box>
                    </Box>
                )}
                <Spacer />
                <Footer />
            </Flex>
        </>
    );
};

export default Home;
