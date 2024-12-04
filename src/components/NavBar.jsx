import { Flex, Spacer, Box, Icon, Portal } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";
import { IoChevronDown } from "react-icons/io5";
import useFilterScheduleStore from "../store/filterScheduleStore";
import useTaskStore from "../store/taskStore";
import useCategoryStore from "../store/categoryStore";
import useGetAllTasks from "../hooks/useGetAllTasks";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import ThemeToggler from "./ThemeToggler";
import UserProfileMenuButton from "./UserProfileMenuButton";
import filterSchedule from "../constants/filterSchedule";
import { useColorModeValue } from "./ui/color-mode";
import { StatLabel, StatRoot, StatValueText } from "./ui/stat";

import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";

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

    // return <></>;

    return (
        <Flex
            width="full"
            mt={{ base: 0, md: 4 }}
            zIndex={2}
            alignItems={"center"}
        >
            <MenuRoot>
                <MenuTrigger asChild>
                    <Button
                        display={{ base: "none", md: "block" }}
                        color={useColorModeValue("cyan.500", "cyan.300")}
                        boxSizing="border-box"
                        boxSize={6}
                        minWidth={"fit-content"}
                        textAlign={"left"}
                        height={"56px"}
                        variant={"ghost"}
                        transition="all 0.2s"
                    >
                        <Tooltip content="Filter By Due Date" placement="top">
                            <Box>
                                <Box fontWeight={"bold"}>
                                    {filter.name}{" "}
                                    <Icon>
                                        <IoChevronDown />
                                    </Icon>
                                </Box>

                                {!isGettingTasksLoading && (
                                    <Flex
                                        fontWeight={"normal"}
                                        color={tasksCompletionCountStyle}
                                    >
                                        {tasksCount === completedTaskCount ? (
                                            <Flex
                                                fontWeight={"bold"}
                                                alignItems={"center"}
                                            >
                                                <Icon mr={1}>
                                                    <IoIosCheckmarkCircleOutline />
                                                </Icon>
                                                All Completed
                                            </Flex>
                                        ) : (
                                            <Flex alignItems={"center"}>
                                                <Icon mr={1}>
                                                    <IoIosCheckmarkCircleOutline />
                                                </Icon>
                                                <Box fontWeight={"bold"}>
                                                    {completedTaskCount}
                                                </Box>
                                                <Box ml={1}>
                                                    of {tasksCount}{" "}
                                                </Box>
                                            </Flex>
                                        )}
                                    </Flex>
                                )}
                            </Box>
                        </Tooltip>
                    </Button>
                </MenuTrigger>

                <Portal>
                    <MenuContent>
                        {filterSchedule.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={item.name}
                                    onClick={() => {
                                        const { icon, ...filterWithoutIcon } =
                                            item; // Destructure and omit `icon`
                                        setFilter(filterWithoutIcon);
                                    }}
                                >
                                    <Box>
                                        {item.icon && (
                                            <Icon
                                                mr="4"
                                                fontSize="16"
                                                _groupHover={{
                                                    color: "white",
                                                }}
                                            >
                                                <item.icon />
                                            </Icon>
                                        )}
                                        {item.name}
                                    </Box>
                                </MenuItem>
                            );
                        })}
                    </MenuContent>
                </Portal>
            </MenuRoot>

            <Spacer />
            <UserProfileMenuButton display={{ base: "none", md: "flex" }} />
            <ThemeToggler display={{ base: "none", md: "flex" }} />
        </Flex>
    );
};

export default Navbar;
