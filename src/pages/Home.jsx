import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import {
    Box,
    HStack,
    useBreakpointValue,
    Icon,
    Flex,
    Spinner,
    Spacer,
} from "@chakra-ui/react";
import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "./../components/ui/menu";
import { DialogContent, DialogRoot } from "./../components/ui/dialog";
import { Button } from "../components/ui/button";
import { useColorModeValue } from "../components/ui/color-mode";
import TaskContainer from "../components/Task/TaskContainer";
import TaskEditable from "../components/Task/TaskEditable";
import useAddTask from "../hooks/useAddTask";
import useGetAllTasks from "../hooks/useGetAllTasks";
import useTaskStore from "../store/taskStore";
import useFilterScheduleStore from "../store/filterScheduleStore";
import { RiDeleteBin3Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import useDeleteTask from "../hooks/useDeleteTask";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import useCategoryStore from "../store/categoryStore";
import CategorySelector from "../components/Task/CategorySelector";
import Footer from "../components/Footer";
import useShowToast from "../hooks/useShowToast";
import SidebarWithHeader from "../components/SideBarWithHeader";
import SearchTask from "../components/Search/SearchTask";
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

    const randomMessage = getRandomMessage();
    const { filter: filterSchedule } = useFilterScheduleStore();
    const { selectedCategoryId, setSelectedCategoryId } = useCategoryStore();
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
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
        sortTasks();
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
                getTasks(filterSchedule.value, selectedCategoryId).filter(
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

        if (filterSchedule.value === "all") {
            return true;
        } else if (filterSchedule.value === "overdue") {
            return task.dueDate && new Date(task.dueDate) < today;
        } else if (filterSchedule.value === "today") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                      today.getTime()
                : false;
        } else if (filterSchedule.value === "tomorrow") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) ===
                      tomorrow.getTime()
                : false;
        } else if (filterSchedule.value === "upcoming") {
            return task.dueDate
                ? new Date(task.dueDate).setHours(0, 0, 0, 0) > today.getTime()
                : false;
        } else if (filterSchedule.value === "unscheduled") {
            return !task.dueDate;
        }
    });

    const noTaskHeadingStyle = useColorModeValue("cyan.500", "cyan.200");

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
                    // borderBottom={`1px solid ${useColorModeValue(
                    //     "rgba(126, 132, 144, 0.3)",
                    //     "rgba(126, 132, 144, 0.3)"
                    // )}`}
                >
                    <SidebarWithHeader />

                    <Button
                        size={"xs"}
                        variant="ghost"
                        disabled={
                            tasks.length === 0 ||
                            isLoadingTasks ||
                            isAllTasksUncompleted
                        }
                        onClick={handleDeletingCompletedTasks}
                        loading={isDeleting}
                        loadingText={"Deleting..."}
                    >
                        <Icon>
                            <RiDeleteBin3Line />
                        </Icon>
                        {isSmallScreen ? "" : "Delete Completed Tasks"}
                    </Button>

                    <CategorySelector
                        currentCategory={selectedCategoryId}
                        onCategoryChange={handleCategoryChange}
                        isEditMode={false}
                    />

                    <Spacer />

                    {isSmallScreen && <SearchTask />}

                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="xs"
                                // ml={2}
                                // px={1}
                                // as={Button}
                                // border={`1px solid ${useColorModeValue(
                                //     "rgba(0, 163, 196, 0.2)",
                                //     "rgba(0, 163, 196, 0.2)"
                                // )}`}
                                // rightIcon={<IoChevronDown />}
                            >
                                <HStack>
                                    <Box
                                        // pl={1}
                                        // textColor={useColorModeValue(
                                        //     "gray.700",
                                        //     "gray.100"
                                        // )}
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
                            </Button>
                        </MenuTrigger>

                        <MenuContent>
                            <MenuItem
                                value={"Task Name"}
                                onClick={() => setSortConfig("taskName")}
                            >
                                Task Name
                            </MenuItem>
                            <MenuItem
                                value={"Due date"}
                                onClick={() => setSortConfig("dueDate")}
                            >
                                Due date
                            </MenuItem>
                            <MenuItem
                                value={"Priority"}
                                onClick={() => setSortConfig("priority")}
                            >
                                Priority
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>

                    <Button
                        // px={1}
                        variant={"ghost"}
                        size={"xs"}
                        onClick={() => setSortConfig(sortConfig.key)}
                    >
                        {!isSmallScreen && (
                            <Box mr={1}>
                                {sortConfig.direction === "ascending"
                                    ? "asc"
                                    : "desc"}
                            </Box>
                        )}
                        <Icon>
                            {sortConfig.direction === "ascending" ? (
                                <BsSortDown />
                            ) : (
                                <BsSortUp />
                            )}
                        </Icon>
                    </Button>
                </HStack>

                {isSmallScreen ? (
                    <DialogRoot
                        lazyMount
                        open={isAddTaskModalOpen}
                        onOpenChange={() =>
                            setIsAddTaskModalOpen(!isAddTaskModalOpen)
                        }
                    >
                        <DialogContent>
                            <TaskEditable
                                onCancel={() => setIsAddTaskModalOpen(false)}
                                onSave={handleAddingTask}
                                isLoading={isAddTaskLoading}
                                isAddingNewTask
                            />
                        </DialogContent>
                    </DialogRoot>
                ) : (
                    isAddTaskModalOpen && (
                        <TaskEditable
                            onCancel={() => setIsAddTaskModalOpen(false)}
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
                {!isAddTaskModalOpen && (
                    <Button
                        zIndex={1} // 2
                        position={{ base: "fixed", sm: "static" }}
                        mt={4}
                        width={{ base: "auto", sm: "full" }}
                        bottom={{ base: 10, sm: "auto" }}
                        right={{ base: 10, sm: "auto" }}
                        variant={"ghost"}
                        onClick={() => {
                            setIsAddTaskModalOpen(true);
                        }}
                        loading={isAddTaskLoading}
                        loadingText="Adding..."
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
