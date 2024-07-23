import { useState } from "react";
import {
    Flex,
    Button,
    useColorMode,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spacer,
    IconButton,
    Tooltip,
    Portal,
    CircularProgress,
    Stat,
    StatLabel,
    StatNumber,
    Box,
    Icon,
    Text,
    StatHelpText,
    StatArrow,
    StatGroup,
    CircularProgressLabel,
    useDisclosure,
    useColorModeValue,
} from "@chakra-ui/react";
import EditProfile from "./AuthForm/Profile/EditProfile";
import { MdPerson, MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../store/authStore";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useFilterScheduleStore from "../store/filterScheduleStore";
import useTaskStore from "../store/taskStore";
import { IoCalendarClearOutline } from "react-icons/io5";
import useCategoryStore from "../store/categoryStore";
import useGetAllTasks from "../hooks/useGetAllTasks";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { redirect, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedCategoryId } = useCategoryStore();
    const { filter, setFilter } = useFilterScheduleStore();
    const { handleLogout, isLoggingOut, error } = useLogout();
    const { getTasks } = useTaskStore();
    const { isLoading: isGettingTasksLoading } = useGetAllTasks();
    const user = useAuthStore((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { authUser, isLoggedIn } = useAuthStore((state) => ({
        authUser: state.user,
        isLoggedIn: state.isLoggedIn,
    }));

    const filterSchedule = [
        {
            name: "Unscheduled",
            value: "unscheduled",
        },
        {
            name: "Overdue",
            value: "overdue",
        },
        {
            name: "All",
            value: "all",
        },
        {
            name: "Today",
            value: "today",
        },
        {
            name: "Tomorrow",
            value: "tomorrow",
        },
        {
            name: "Upcoming",
            value: "upcoming",
        },
    ];

    const tasksCount = getTasks(filter.value, selectedCategoryId).length;
    const completedTaskCount = getTasks(
        filter.value,
        selectedCategoryId,
        true
    ).length;

    const tasksCompletionCountStyle = useColorModeValue("black", "white");

    return (
        <Flex width="full" mt={4} zIndex={2} alignItems={"center"}>
            <EditProfile isOpen={isOpen} onClose={onClose} />
            <Menu>
                <Tooltip label="Filter By Due Date" placement="top">
                    <Stat>
                        <MenuButton
                            as={Button}
                            color={useColorModeValue("cyan.500", "cyan.300")}
                            boxSizing="border-box"
                            boxSize={6}
                            minWidth={"fit-content"}
                            pr={10}
                            textAlign={"left"}
                            height={"42px"}
                            variant={"unstyled"}
                            transition="all 0.2s"
                        >
                            <Box fontWeight={"bold"}>
                                {filter.name} <Icon as={ChevronDownIcon} />
                            </Box>

                            {!isGettingTasksLoading && (
                                <StatHelpText
                                    fontWeight={"normal"}
                                    color={tasksCompletionCountStyle}
                                >
                                    <Flex>
                                        {tasksCount === completedTaskCount ? (
                                            <Flex
                                                fontWeight={"bold"}
                                                alignItems={"center"}
                                            >
                                                <Icon
                                                    as={
                                                        IoIosCheckmarkCircleOutline
                                                    }
                                                    mr={1}
                                                />
                                                All
                                            </Flex>
                                        ) : (
                                            <Flex alignItems={"center"}>
                                                <Icon
                                                    as={
                                                        IoIosCheckmarkCircleOutline
                                                    }
                                                    mr={1}
                                                />
                                                <Box fontWeight={"bold"}>
                                                    {completedTaskCount}
                                                </Box>
                                                <Box ml={1}>
                                                    of {tasksCount}{" "}
                                                </Box>
                                            </Flex>
                                        )}
                                    </Flex>
                                </StatHelpText>
                            )}
                        </MenuButton>
                    </Stat>
                </Tooltip>
                <Portal>
                    <MenuList>
                        {filterSchedule.map((item, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setFilter(item);
                                }}
                            >
                                {item.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Portal>
            </Menu>

            {/* <CircularProgress value={40} color="green.400" thickness="15px">
                <CircularProgressLabel>59 / 599</CircularProgressLabel>
            </CircularProgress> */}

            <Spacer />

            {isLoggedIn ? (
                <Menu>
                    <MenuButton
                        as={Button}
                        mx={3}
                        variant={"ghost"}
                        leftIcon={
                            user?.profilePicURL ? (
                                <Avatar
                                    mr={2}
                                    size={"sm"}
                                    name={user?.username}
                                    src={user?.profilePicURL}
                                />
                            ) : (
                                <MdPerson size={"24"} />
                            )
                        }
                    >
                        {user?.username}
                        <ChevronDownIcon ml={1} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem as={Button} onClick={onOpen}>
                            Edit Profile
                        </MenuItem>
                        <MenuItem
                            as={Button}
                            onClick={handleLogout}
                            isDisabled={isLoggingOut}
                            color={"red.500"}
                        >
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
            ) : (
                <Button
                    mr={3}
                    onClick={() => {
                        navigate("/auth");
                    }}
                >
                    Login
                </Button>
            )}

            <IconButton
                variant={"ghost"}
                aria-label="Toggle color mode"
                icon={
                    colorMode === "light" ? (
                        <MdDarkMode />
                    ) : (
                        <MdOutlineLightMode />
                    )
                }
                onClick={toggleColorMode}
            />
        </Flex>
    );
};

export default Navbar;
