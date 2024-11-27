import {
    Flex,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spacer,
    Tooltip,
    Portal,
    Stat,
    Box,
    Icon,
    StatHelpText,
    useColorModeValue,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useFilterScheduleStore from "../store/filterScheduleStore";
import useTaskStore from "../store/taskStore";
import useCategoryStore from "../store/categoryStore";
import useGetAllTasks from "../hooks/useGetAllTasks";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import ThemeToggler from "./ThemeToggler";
import UserProfileMenuButton from "./UserProfileMenuButton";
import filterSchedule from "../constants/filterSchedule";

const Navbar = () => {
    const { selectedCategoryId } = useCategoryStore();
    const { filter, setFilter } = useFilterScheduleStore();
    const { getTasks } = useTaskStore();
    const { isLoading: isGettingTasksLoading } = useGetAllTasks();

    const tasksCount = getTasks(filter.value, selectedCategoryId).length;
    const completedTaskCount = getTasks(
        filter.value,
        selectedCategoryId,
        true
    ).length;

    const tasksCompletionCountStyle = useColorModeValue("black", "white");

    return (
        <Flex
            width="full"
            mt={{ base: 0, md: 4 }}
            zIndex={2}
            alignItems={"center"}
        >
            <Menu>
                <Tooltip label="Filter By Due Date" placement="top">
                    <Stat display={{ base: "none", md: "block" }}>
                        <MenuButton
                            as={Button}
                            color={useColorModeValue("cyan.500", "cyan.300")}
                            boxSizing="border-box"
                            boxSize={6}
                            minWidth={"fit-content"}
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
                                                All Completed
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
                                    const { icon, ...filterWithoutIcon } = item; // Destructure and omit `icon`
                                    setFilter(filterWithoutIcon);
                                }}
                            >
                                {item.icon && (
                                    <Icon
                                        mr="4"
                                        fontSize="16"
                                        _groupHover={{
                                            color: "white",
                                        }}
                                        as={item.icon}
                                    />
                                )}
                                {item.name}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Portal>
            </Menu>
            <Spacer />
            <UserProfileMenuButton display={{ base: "none", md: "flex" }} />
            <ThemeToggler display={{ base: "none", md: "flex" }} />
        </Flex>
    );
};

export default Navbar;
