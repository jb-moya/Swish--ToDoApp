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
    MenuDivider,
    Portal,
    Icon,
    Text,
} from "@chakra-ui/react";
import { IoCalendarClearOutline, IoFlagOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import DatePicker from "../../components/DatePicker";
import useDateFormat, { formatTime, getDayOfWeek } from "../utils/dateFormat";
import CategorySelector from "./CategorySelector";
import { ChevronDownIcon } from "@chakra-ui/icons";
import useFilterScheduleStore from "../../store/filterScheduleStore";
import useCategoryStore from "../../store/categoryStore";
import { BsFillPinAngleFill } from "react-icons/bs";
import { DeleteIcon } from "@chakra-ui/icons";
import "../../index.css";
import useDeleteTask from "../../hooks/useDeleteTask";
import {
    FaCalendarDay,
    FaArrowRight,
    FaCalendarWeek,
    FaSun,
    FaClock,
} from "react-icons/fa";
import TimePicker from "../TimePicker";
import useShowToast from "../../hooks/useShowToast";

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
            dueTime: null,
            category: -1,
            priority: 0,
        },
        onSave,
        onCancel,
        isLoading,
        isAddingNewTask = false,
    }) => {
        const showToast = useShowToast();

        const dateFormat = useDateFormat();
        const { isDeleting, handleDeleteTasks } = useDeleteTask();

        const { filter } = useFilterScheduleStore();
        const { selectedCategoryId, setSelectedCategoryId } =
            useCategoryStore();

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
            dueTime: taskInfo.dueTime,
            isPinned: taskInfo.isPinned,
            priority: taskInfo.priority,
            category: isAddingNewTask ? selectedCategoryId : taskInfo.category,
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
        const [openTimePicker, setOpenTimePicker] = useState(false);

        const updateDueDate = (daysToAdd) => {
            const newDate = new Date();
            newDate.setDate(newDate.getDate() + daysToAdd);

            setEditTaskInfo({
                ...editTaskInfo,
                dueDate: newDate,
            });

            setShowDatePicker(false);
        };

        useEffect(() => {
            setEditTaskInfo({
                ...editTaskInfo,
                category: selectedCategoryId,
            });
        }, [editTaskInfo.category, selectedCategoryId]);

        useEffect(() => {
            if (editTaskInfo.dueTime) {
                setOpenTimePicker(true);
            }
        }, [editTaskInfo.dueTime]);

        useEffect(() => {
            if (!editTaskInfo.taskName) {
                setSaveButtonDisable(true);
            } else {
                setSaveButtonDisable(false);
            }
        }, [editTaskInfo]);

        useEffect(() => {
            if (inputTitleRef.current) {
                inputTitleRef.current.focus();
            }
        }, []);

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
                showToast("Error", error.message, "error");
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !saveButtonDisable) {
                handleSave();
            }
        };

        const handleCategoryChange = (value) => {
            setSelectedCategoryId(value);
            setEditTaskInfo({ ...editTaskInfo, category: value });
        };

        const borderStyle = useColorModeValue("gray.500", "gray.500");
        const borderColor = useColorModeValue(
            "rgba(0, 163, 196, 0.2)",
            "rgba(0, 163, 196, 0.2)"
        );

        const getDaysUntilWeekend = () => {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
            const daysUntilSaturday = (6 - dayOfWeek) % 7;
            return daysUntilSaturday;
        };

        const txHeight = 12;

        useEffect(() => {
            const tx = document.getElementsByTagName("textarea");

            for (let i = 0; i < tx.length; i++) {
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
                        type="text"
                        px={3}
                        mb={2}
                        py={0}
                        minH={txHeight}
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
                                        display={"flex"}
                                        flexDirection={"row"}
                                        border={`1px solid ${borderColor}`}
                                        onClick={() =>
                                            setShowDatePicker(!showDatePicker)
                                        }
                                        leftIcon={<IoCalendarClearOutline />}
                                    >
                                        {editTaskInfo.dueDate !== null ? (
                                            <Box display={"flex"}>
                                                {dateFormat(
                                                    editTaskInfo.dueDate
                                                )}
                                                {editTaskInfo.dueTime && (
                                                    <Text ml={1} opacity={0.75}>
                                                        {formatTime(
                                                            editTaskInfo.dueTime
                                                        )}
                                                    </Text>
                                                )}
                                            </Box>
                                        ) : (
                                            "No Date"
                                        )}
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
                                    <MenuItem
                                        flex
                                        justifyContent={"space-between"}
                                        onClick={() => updateDueDate(0)}
                                    >
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            <Icon
                                                as={FaCalendarDay}
                                                mr={2}
                                                opacity={0.5}
                                            />
                                            Today
                                        </Box>
                                        <Box fontSize={"xs"} opacity={0.5}>
                                            {getDayOfWeek(new Date())}
                                        </Box>
                                    </MenuItem>
                                    <MenuItem
                                        flex
                                        justifyContent={"space-between"}
                                        onClick={() => updateDueDate(1)}
                                    >
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            <Icon
                                                as={FaArrowRight}
                                                mr={2}
                                                opacity={0.5}
                                            />{" "}
                                            Tomorrow
                                        </Box>
                                        <Box fontSize={"xs"} opacity={0.5}>
                                            {getDayOfWeek(
                                                new Date(
                                                    new Date().setDate(
                                                        new Date().getDate() + 1
                                                    )
                                                )
                                            )}
                                        </Box>
                                    </MenuItem>
                                    <MenuItem
                                        flex
                                        justifyContent={"space-between"}
                                        onClick={() => updateDueDate(7)}
                                    >
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            <Icon
                                                as={FaCalendarWeek}
                                                mr={2}
                                                opacity={0.5}
                                            />{" "}
                                            Next Week
                                        </Box>
                                        <Box fontSize={"xs"} opacity={0.5}>
                                            {dateFormat(
                                                new Date(
                                                    new Date().setDate(
                                                        new Date().getDate() + 7
                                                    )
                                                )
                                            )}
                                        </Box>
                                    </MenuItem>
                                    <MenuItem
                                        flex
                                        justifyContent={"space-between"}
                                        onClick={() =>
                                            updateDueDate(getDaysUntilWeekend())
                                        }
                                    >
                                        <Box
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            <Icon
                                                as={FaSun}
                                                mr={2}
                                                opacity={0.5}
                                            />{" "}
                                            This Weekend
                                        </Box>
                                        <Box fontSize={"xs"} opacity={0.5}>
                                            {getDayOfWeek(
                                                new Date(
                                                    new Date().setDate(
                                                        new Date().getDate() +
                                                            getDaysUntilWeekend()
                                                    )
                                                )
                                            )}
                                        </Box>
                                    </MenuItem>

                                    <MenuDivider />

                                    <DatePicker
                                        selectedDate={editTaskInfo.dueDate}
                                        onChange={(date) => {

                                            setEditTaskInfo({
                                                ...editTaskInfo,
                                                dueDate: date,
                                            });
                                            setShowDatePicker(false);
                                        }}
                                        isCalendarOpen={showDatePicker}
                                        setCalendarIsOpen={setShowDatePicker}
                                    />

                                    <MenuDivider />

                                    {openTimePicker ? (
                                        <Box position={"relative"}>
                                            <TimePicker
                                                selectedDate={
                                                    editTaskInfo.dueDate ||
                                                    new Date()
                                                }
                                                selectedTime={
                                                    editTaskInfo.dueTime
                                                }
                                                onChange={(time) =>
                                                    setEditTaskInfo({
                                                        ...editTaskInfo,
                                                        dueTime: time,
                                                    })
                                                }
                                            />
                                            <IconButton
                                                top={"50%"}
                                                zIndex={1}
                                                right={4}
                                                transform={"translateY(-50%)"}
                                                position={"absolute"}
                                                variant={"ghost"}
                                                size={"10px"}
                                                as={CloseIcon}
                                                color={"red.400"}
                                                onClick={(e) => {
                                                    e.stopPropagation();

                                                    setEditTaskInfo({
                                                        ...editTaskInfo,
                                                        dueTime: null,
                                                    });

                                                    setOpenTimePicker(false);
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <MenuItem
                                            flex
                                            justifyContent={"space-between"}
                                            onClick={() => {
                                                if (
                                                    editTaskInfo.dueDate ===
                                                    null
                                                ) {
                                                    updateDueDate(0);
                                                }

                                                setOpenTimePicker(true);

                                                setEditTaskInfo({
                                                    ...editTaskInfo,
                                                    dueTime: new Date(),
                                                });
                                            }}
                                            closeOnSelect={false}
                                        >
                                            <Box
                                                display={"flex"}
                                                alignItems={"center"}
                                            >
                                                <Icon
                                                    boxSize={4}
                                                    as={FaClock}
                                                    mr={2}
                                                    opacity={0.5}
                                                />{" "}
                                                <Box>Set Time</Box>
                                            </Box>

                                            <Box fontSize={"xs"} opacity={0.5}>
                                                {editTaskInfo.dueTime
                                                    ? editTaskInfo.dueTime
                                                    : "No Time"}
                                            </Box>
                                        </MenuItem>
                                    )}

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
                            currentCategory={editTaskInfo.category}
                            onCategoryChange={handleCategoryChange}
                            isEditMode
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
