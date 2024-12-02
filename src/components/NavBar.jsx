import {
    Flex,
    Button,
    // Menu,
    // MenuButton,
    // MenuList,
    // MenuItem,
    Spacer,
    Tooltip,
    Portal,
    Stat,
    Box,
    Icon,
    StatHelpText
} from "@chakra-ui/react";
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
import {
    DialogBody,
    DialogCloseTrigger,
    DialogActionTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

import {
    MenuContent,
    MenuItem,
    MenuRoot,
    MenuTrigger,
} from "./ui/menu";


const Navbar = () => {
    // const { selectedCategoryId } = useCategoryStore();
    const { filter, setFilter } = useFilterScheduleStore();
    const { getTasks } = useTaskStore();
    const { isLoading: isGettingTasksLoading } = useGetAllTasks();

    // const tasksCount = getTasks(filter.value, selectedCategoryId).length;
    // const completedTaskCount = getTasks(
    //     filter.value,
    //     selectedCategoryId,
    //     true
    // ).length;

    return <></>;

    // const tasksCompletionCountStyle = useColorModeValue("black", "white");

    return (
        <Flex
            width="full"
            mt={{ base: 0, md: 4 }}
            zIndex={2}
            alignItems={"center"}
        >
            <DialogRoot>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        Open Dialog
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button>Save</Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot>

            <MenuRoot>
                <Stat display={{ base: "none", md: "block" }}>
                    <Tooltip label="Filter By Due Date" placement="top">
                        <MenuTrigger asChild>
                            <Button
                                as={Button}
                                color={useColorModeValue(
                                    "cyan.500",
                                    "cyan.300"
                                )}
                                boxSizing="border-box"
                                boxSize={6}
                                minWidth={"fit-content"}
                                textAlign={"left"}
                                height={"42px"}
                                variant={"unstyled"}
                                transition="all 0.2s"
                            >
                                <>
                                    <Box fontWeight={"bold"}>
                                        {filter.name}{" "}
                                        <Icon as={IoChevronDown} />
                                    </Box>

                                    {!isGettingTasksLoading && (
                                        <StatHelpText
                                            fontWeight={"normal"}
                                            color={tasksCompletionCountStyle}
                                        >
                                            <Flex>
                                                {tasksCount ===
                                                completedTaskCount ? (
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
                                                        <Box
                                                            fontWeight={"bold"}
                                                        >
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
                                </>
                            </Button>
                        </MenuTrigger>
                    </Tooltip>
                </Stat>

                <Portal>
                    <MenuContent>
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
