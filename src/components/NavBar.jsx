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

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedCategoryIndex } = useCategoryStore();
    const { filter, setFilter } = useFilterScheduleStore();
    const { handleLogout, isLoggingOut, error } = useLogout();
    const { getTasks } = useTaskStore();

    const user = useAuthStore((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const authUser = useAuthStore((state) => state.user);

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

    const tasksCount = getTasks(filter.value, selectedCategoryIndex).length;
    const completedTaskCount = getTasks(
        filter.value,
        selectedCategoryIndex,
        true
    ).length;

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
                            <StatHelpText
                                fontWeight={"normal"}
                                color={useColorModeValue("black", "white")}
                            >
                                <Flex>
                                    {tasksCount === completedTaskCount ? (
                                        <Box fontWeight={"bold"}>
                                            All Tasks Completed
                                        </Box>
                                    ) : (
                                        <>
                                            <Box fontWeight={"bold"}>
                                                {completedTaskCount}
                                            </Box>
                                            <Box ml={1}>
                                                of {tasksCount} Tasks Completed
                                            </Box>
                                        </>
                                    )}
                                </Flex>
                            </StatHelpText>
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
            {/* </Flex> */}
        </Flex>
    );
};

export default Navbar;
