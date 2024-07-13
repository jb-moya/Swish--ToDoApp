import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Input,
    Button,
    Flex,
    useColorModeValue,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Divider,
    ButtonGroup,
} from "@chakra-ui/react";
import { IoCalendarClearOutline, IoFlagOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import DatePicker from "../../components/DatePicker";
import useDateFormat from "../utils/dateFormat";
import CategorySelector from "./CategorySelector";
import { ChevronDownIcon } from "@chakra-ui/icons";
const priority = ["none", "low", "medium", "high", "critical"];

const TaskEditable = React.memo(
    ({
        taskInfo = {
            taskName: "",
            description: "",
            isCompleted: false,
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
        const [editTaskInfo, setEditTaskInfo] = useState({
            id: taskInfo.id,
            taskName: taskInfo.taskName,
            description: taskInfo.description,
            isCompleted: taskInfo.isCompleted,
            dueDate:
                taskInfo.dueDate === null ? null : new Date(taskInfo.dueDate),
            priority: taskInfo.priority,
            category: taskInfo.category,
            createdBy: taskInfo.createdBy,
            createdAt: taskInfo.createdAt,
        });
        const [saveButtonDisable, setSaveButtonDisable] = useState(true);
        const inputTitleRef = useRef(null);
        const [showDatePicker, setShowDatePicker] = useState(false);

        useEffect(() => {
            setSaveButtonDisable(!editTaskInfo.taskName);
        }, [editTaskInfo]);

        const handleSave = () => {
            onSave(editTaskInfo);

            setEditTaskInfo(taskInfo);

            if (inputTitleRef.current) {
                inputTitleRef.current.focus();
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
                    <Input
                        type="text"
                        height={"22px"}
                        px={0}
                        variant={"ghost"}
                        fontWeight={"bold"}
                        bg={"transparent"}
                        placeholder="task name"
                        value={editTaskInfo.taskName}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => {
                            setEditTaskInfo({
                                ...editTaskInfo,
                                taskName: e.target.value,
                            });
                        }}
                        ref={inputTitleRef}
                    ></Input>

                    <Input
                        type="text"
                        height={"22px"}
                        px={0}
                        variant={"ghost"}
                        bg={"transparent"}
                        placeholder="description"
                        value={editTaskInfo.description}
                        onChange={(e) =>
                            setEditTaskInfo({
                                ...editTaskInfo,
                                description: e.target.value,
                            })
                        }
                    ></Input>

                    <Flex
                        gap={2}
                        pt={2}
                        mb={2}
                        position={"relative"}
                        // zIndex={"popover"}
                    >
                        <Menu>
                            <ButtonGroup size="sm" isAttached variant="outline">
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
                        </Menu>

                        <Menu>
                            <ButtonGroup size="sm" isAttached variant="outline">
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
                        </Menu>

                        <CategorySelector
                            task={editTaskInfo}
                            setEditTaskInfo={setEditTaskInfo}
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
