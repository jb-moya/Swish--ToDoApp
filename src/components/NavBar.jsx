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
    Input,
    InputGroup,
    useColorModeValue,
    Spacer,
    Box,
    InputLeftElement,
    IconButton,
    Tooltip,
    Portal,
    useDisclosure,
} from "@chakra-ui/react";
import EditProfile from "./AuthForm/Profile/EditProfile";
import { MdPerson, MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../store/authStore";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import CategorySelector from "./Task/CategorySelector";
import useCategoryStore from "../store/categoryStore";
import useFilterScheduleStore from "../store/filterScheduleStore";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LiaHashtagSolid } from "react-icons/lia";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { selectedCategoryIndex, setSelectedCategoryIndex } =
        useCategoryStore();
    const { filter, setFilter } = useFilterScheduleStore();
    const { handleLogout, isLoggingOut, error } = useLogout();
    const user = useAuthStore((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const authUser = useAuthStore((state) => state.user);

    const userCategories = Array.isArray(authUser.categories)
        ? authUser.categories
        : [];

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

    return (
        <Flex width="full" mt={4}>
            <EditProfile isOpen={isOpen} onClose={onClose} />
            {/* <Flex
                justify="space-between"
                width="full"
                // mx="auto"
                position="fixed"
                top="2"
                zIndex="50"
                // px="2"
                transition="all 0.5s ease-in-out"
            > */}
            {/* <InputGroup width={"300px"}>
                <InputLeftElement pointerEvents="none">
                    <SearchIcon opacity={0.4} />
                </InputLeftElement>
                <Input type="tel" placeholder="Search" />
            </InputGroup> */}

            <Menu>
                <Tooltip
                    label="Filter By Due Date"
                    placement="top"
                    openDelay={500}
                >
                    <MenuButton
                        as={Button}
                        leftIcon={<IoCalendarClearOutline />}
                        px={4}
                        py={2}
                        mr={2}
                        // variant={"ghost"}
                        transition="all 0.2s"
                    >
                        {filter.name}
                        <ChevronDownIcon />
                    </MenuButton>
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

            <Menu>
                <Tooltip
                    label="Filter By Category"
                    placement="top"
                    openDelay={500}
                >
                    <MenuButton
                        as={Button}
                        leftIcon={<LiaHashtagSolid />}
                        px={4}
                        py={2}
                        variant={"ghost"}
                        transition="all 0.2s"
                    >
                        {selectedCategoryIndex === -1
                            ? "All"
                            : userCategories[selectedCategoryIndex]}{" "}
                        <ChevronDownIcon />
                    </MenuButton>
                </Tooltip>
                <Portal>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                setSelectedCategoryIndex(-1);
                            }}
                        >
                            All
                        </MenuItem>

                        {userCategories.map((category, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => {
                                    setSelectedCategoryIndex(index);
                                }}
                            >
                                {category}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Portal>
            </Menu>

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
