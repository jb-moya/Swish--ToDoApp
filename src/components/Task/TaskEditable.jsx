import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Flex,
    useColorModeValue,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Divider,
    Textarea,
    ButtonGroup,
    Tooltip,
    Spacer,
    Portal,
} from "@chakra-ui/react";
import { IoCalendarClearOutline, IoFlagOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import DatePicker from "../../components/DatePicker";
import useDateFormat from "../utils/dateFormat";
import CategorySelector from "./CategorySelector";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useFilterScheduleStore from "../../store/filterScheduleStore";
import useCategoryStore from "../../store/categoryStore";
import { BsFillPinAngleFill } from "react-icons/bs";
import { DeleteIcon } from "@chakra-ui/icons";
import "../../index.css";
import useDeleteTask from "../../hooks/useDeleteTask";

const priority = ["none", "low", "medium", "high", "critical"];

const taskNameCharLimit = 500;
const descriptionCharLimit = 1500;

const TaskEditable = React.memo(
    ({
        taskInfo = {
            taskName: "",
            description: "",
            isCompleted: false,
            isPinned: false,
            dueDate: null,
            category: null,
            priority: 0,
        },
        onSave,
        onCancel,
        isLoading,
        isAddingNewTask = false,
    }) => {
        const calendarButtonRef = useRef(null);
        const dateFormat = useDateFormat();
        const { isDeleting, handleDeleteTasks } = useDeleteTask();

        const { filter } = useFilterScheduleStore();
        const { selectedCategoryIndex } = useCategoryStore();

        const initialSetSchedule = () => {
            if (isAddingNewTask) {
                const now = new Date();
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const tomorrow = new Date(startOfDay);

                switch (filter.value) {
                    case "all":
                    case "unscheduled":
                    case "overdue":
                        return null;
                    case "today":
                        return startOfDay;
                    case "tomorrow":
                    case "upcoming":
                        tomorrow.setDate(startOfDay.getDate() + 1);
                        return tomorrow;
                    default:
                        return null;
                }
            } else {
                return taskInfo.dueDate === null
                    ? null
                    : new Date(taskInfo.dueDate);
            }
        };

        const [editTaskInfo, setEditTaskInfo] = useState({
            id: taskInfo.id,
            taskName: taskInfo.taskName,
            description: taskInfo.description,
            isCompleted: taskInfo.isCompleted,
            dueDate: initialSetSchedule(),
            isPinned: taskInfo.isPinned,
            priority: taskInfo.priority,
            category: isAddingNewTask
                ? selectedCategoryIndex
                : taskInfo.category,
            createdBy: taskInfo.createdBy,
            createdAt: taskInfo.createdAt,
        });
        const [characterLimit, setCharacterLimit] = useState({
            taskName: editTaskInfo.taskName.length >= taskNameCharLimit,
            description: editTaskInfo.taskName.length >= descriptionCharLimit,
        });
        const [saveButtonDisable, setSaveButtonDisable] = useState(true);
        const inputTitleRef = useRef(null);
        const [showDatePicker, setShowDatePicker] = useState(false);

        // useEffect(() => {
        //     if (!editTaskInfo.taskName) {
        //         setSaveButtonDisable(true);
        //     } else {
        //         setSaveButtonDisable(false);
        //     }
        // }, [editTaskInfo]);

        // useEffect(() => {
        //     console.log("rerendering");
        // }, []);

        const handleSave = () => {
            onSave(editTaskInfo);

            setEditTaskInfo(taskInfo);

            if (inputTitleRef.current) {
                inputTitleRef.current.focus();
            }
        };

        const handleDeletingTask = async () => {
            try {
                await handleDeleteTasks([editTaskInfo]);
            } catch (error) {
                console.log(error);
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !saveButtonDisable) {
                handleSave();
            }
        };

        const borderStyle = useColorModeValue("gray.500", "gray.500");
        const borderColor = useColorModeValue(
            "rgba(0, 163, 196, 0.2)",
            "rgba(0, 163, 196, 0.2)"
        );

        const txHeight = 12;
        useEffect(() => {
            const tx = document.getElementsByTagName("textarea");

            for (let i = 0; i < tx.length; i++) {
                console.log("tite");
                if (tx[i].value == "") {
                    tx[i].setAttribute(
                        "style",
                        "height:" + 0 + "px;overflow-y:hidden;"
                    );
                } else {
                    tx[i].setAttribute(
                        "style",
                        "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
                    );
                }
                tx[i].addEventListener("input", OnInput, false);
            }

            function OnInput(e) {
                this.style.height = "auto";
                this.style.height = this.scrollHeight + "px";
            }

            return () => {
                for (let i = 0; i < tx.length; i++) {
                    tx[i].removeEventListener("input", OnInput);
                }
            };
        }, [editTaskInfo]);

        return (
            <Flex flexDir={"column"} width={"100%"}>
                <Box
                    bg={useColorModeValue("white", "#1a202c")}
                    shadow={{ base: "2xl", sm: "none" }}
                    p={4}
                    rounded={"md"}
                    border={`1px solid ${useColorModeValue(
                        "rgba(0, 163, 196, 0.2)",
                        "rgba(0, 163, 196, 0.2)"
                    )}`}
                    width="100%"
                >
                    <Textarea
                        // className="resize-disable"
                        type="text"
                        px={3}
                        mb={2}
                        py={0}
                        minH={txHeight}
                        // autoFocus
                        variant={"unstyled"}
                        fontWeight={"bold"}
                        bg={"transparent"}
                        placeholder="task name"
                        value={editTaskInfo.taskName}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            if (e.target.value.length > taskNameCharLimit) {
                                setCharacterLimit({
                                    ...characterLimit,
                                    taskName: true,
                                });
                                return;
                            } else {
                                setCharacterLimit({
                                    ...characterLimit,
                                    taskName: false,
                                });
                            }

                            setEditTaskInfo({
                                ...editTaskInfo,
                                taskName: e.target.value,
                            });
                        }}
                        ref={inputTitleRef}
                    ></Textarea>

                    {characterLimit.taskName && (
                        <Box px={3} fontSize={"xs"} color={"red.400"}>
                            Task name character limit reached
                        </Box>
                    )}

                    <Textarea
                        // className="resize-disable"
                        type="text"
                        minH={txHeight}
                        py={0}
                        px={3}
                        mb={2}
                        variant={"ghost"}
                        bg={"transparent"}
                        placeholder="description"
                        value={editTaskInfo.description}
                        onChange={(e) => {
                            if (e.target.value.length > descriptionCharLimit) {
                                setCharacterLimit({
                                    ...characterLimit,
                                    description: true,
                                });
                                return;
                            } else {
                                setCharacterLimit({
                                    ...characterLimit,
                                    description: false,
                                });
                            }

                            setEditTaskInfo({
                                ...editTaskInfo,
                                description: e.target.value,
                            });
                        }}
                    ></Textarea>

                    {characterLimit.description && (
                        <Box px={3} fontSize={"xs"} color={"red.400"}>
                            Description character limit reached
                        </Box>
                    )}

                    <Flex
                        gap={2}
                        pt={2}
                        wrap={"wrap"}
                        mb={2}
                        position={"relative"}
                        // zIndex={"popover"}
                    >
                        <Menu>
                            <Tooltip
                                label="Select Due Date"
                                placement="top"
                                openDelay={500}
                            >
                                <ButtonGroup
                                    size="sm"
                                    isAttached
                                    variant="outline"
                                >
                                    <MenuButton
                                        as={Button}
                                        color={borderStyle}
                                        border={`1px solid ${borderColor}`}
                                        onClick={() =>
                                            setShowDatePicker(!showDatePicker)
                                        }
                                        ref={calendarButtonRef}
                                        leftIcon={<IoCalendarClearOutline />}
                                    >
                                        {editTaskInfo.dueDate !== null
                                            ? dateFormat(editTaskInfo.dueDate)
                                            : "No Date"}
                                    </MenuButton>

                                    {editTaskInfo.dueDate && (
                                        <IconButton
                                            border={`1px solid ${borderColor}`}
                                            color={borderStyle}
                                            icon={<CloseIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setEditTaskInfo({
                                                    ...editTaskInfo,
                                                    dueDate: null,
                                                });
                                            }}
                                            _hover={{ color: "red" }}
                                        />
                                    )}
                                </ButtonGroup>
                            </Tooltip>

                            <Portal>
                                <MenuList p={0}>
                                    <DatePicker
                                        selected={editTaskInfo.dueDate}
                                        onChange={(date) => {
                                            setEditTaskInfo({
                                                ...editTaskInfo,
                                                dueDate: date,
                                            });
                                            setShowDatePicker(false);
                                        }}
                                        isCalendarOpen={showDatePicker}
                                        setCalendarIsOpen={setShowDatePicker}
                                        wrapperRef={calendarButtonRef}
                                        inline
                                    />
                                </MenuList>
                            </Portal>
                        </Menu>

                        <Menu>
                            <Tooltip
                                label="Select Priority"
                                placement="top"
                                openDelay={500}
                            >
                                <ButtonGroup
                                    size="sm"
                                    isAttached
                                    variant="outline"
                                >
                                    <MenuButton
                                        as={Button}
                                        display={"flex"}
                                        px={2}
                                        color={useColorModeValue(
                                            "gray.500",
                                            "gray.500"
                                        )}
                                        border={`1px solid ${useColorModeValue(
                                            "rgba(0, 163, 196, 0.2)",
                                            "rgba(0, 163, 196, 0.2)"
                                        )}`}
                                        leftIcon={<IoFlagOutline />}
                                        rightIcon={<ChevronDownIcon />}
                                    >
                                        {priority[editTaskInfo.priority || 0]}
                                    </MenuButton>

                                    {editTaskInfo.priority !== 0 && (
                                        <IconButton
                                            variant={"ghost"}
                                            color={borderStyle}
                                            border={`1px solid ${borderColor}`}
                                            icon={<CloseIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                setEditTaskInfo({
                                                    ...editTaskInfo,
                                                    priority: 0,
                                                });
                                            }}
                                            _hover={{ color: "red" }}
                                        />
                                    )}
                                </ButtonGroup>
                            </Tooltip>

                            <Portal>
                                <MenuList>
                                    {priority.map((item, index) => (
                                        <MenuItem
                                            key={item}
                                            onClick={() =>
                                                setEditTaskInfo({
                                                    ...editTaskInfo,
                                                    priority: index,
                                                })
                                            }
                                        >
                                            {item}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Portal>
                        </Menu>

                        <CategorySelector
                            task={editTaskInfo}
                            setEditTaskInfo={setEditTaskInfo}
                        />

                        <Spacer />

                        <IconButton
                            size={"sm"}
                            backdropBlur={15}
                            left={0}
                            variant={editTaskInfo.isPinned ? "solid" : "ghost"}
                            aria-label="complete task"
                            icon={<BsFillPinAngleFill />}
                            onClick={() => {
                                setEditTaskInfo({
                                    ...editTaskInfo,
                                    isPinned: !editTaskInfo.isPinned,
                                });
                            }}
                        />

                        <IconButton
                            size={"sm"}
                            variant={"ghost"}
                            aria-label="delete task"
                            icon={<DeleteIcon />}
                            onClick={handleDeletingTask}
                            isLoading={isDeleting}
                        />
                    </Flex>
                    <Divider />
                    <Flex
                        mt={2}
                        justifyContent={{ base: "center", sm: "flex-end" }}
                        gap={3}
                    >
                        <Button
                            flex={{
                                base: 1,
                                sm: "none",
                            }}
                            size={"sm"}
                            bg={"red.400"}
                            color={"white"}
                            _hover={{ bg: "red.500" }}
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            flex={{
                                base: 1,
                                sm: "none",
                            }}
                            size={"sm"}
                            onClick={handleSave}
                            isLoading={isLoading}
                            isDisabled={saveButtonDisable}
                        >
                            {isAddingNewTask ? "Add Task" : "Save"}
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        );
    }
);

TaskEditable.displayName = "TaskEditable";

export default TaskEditable;
