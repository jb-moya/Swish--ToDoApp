import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Input,
    Button,
    Flex,
    Text,
    useColorModeValue,
    Stack,
    Menu,
    MenuButton,
    IconButton,
    MenuList,
    MenuItem,
    Portal,
} from "@chakra-ui/react";
import { CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import DatePicker from "../../components/DatePicker";
import dateFormat from "../utils/dateFormat";

const priority = ["none", "low", "medium", "high", "critical"];

const TaskEditable = React.memo(
    ({
        taskInfo = {
            taskName: "",
            description: "",
            isCompleted: false,
            dueDate: null,
            priority: 0,
        },
        onSave,
        onCancel,
        isLoading,
    }) => {
        const [editTaskInfo, setEditTaskInfo] = useState({
            id: taskInfo.id,
            taskName: taskInfo.taskName,
            description: taskInfo.description,
            isCompleted: taskInfo.isCompleted,
            dueDate: taskInfo.dueDate === null ? null : new Date(taskInfo.dueDate),
            priority: taskInfo.priority,
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

            // setEditTaskInfo(taskInfo);

            if (inputTitleRef.current) {
                inputTitleRef.current.focus();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Enter" && !saveButtonDisable) {
                handleSave();
            }
        };

        useEffect(() => {
            console.log("edittable", editTaskInfo);
        }, [editTaskInfo]);

        return (
            <Box
                position={"relative"}
                width={"full"}
                rounded={"md"}
                border={`1px solid ${useColorModeValue(
                    "rgba(0, 163, 196, 0.2)",
                    "rgba(0, 163, 196, 0.2)"
                )}`}
                p={2}
            >
                <Input
                    type="text"
                    size="sm"
                    px={0}
                    variant={"ghost"}
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
                    size="sm"
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

                <Flex gap={2} pt={2} position={"relative"}>
                    <Box
                        px={2}
                        as={Button}
                        variant={"outline"}
                        color={useColorModeValue("gray.500", "gray.500")}
                        border={`1px solid ${useColorModeValue(
                            "rgba(0, 163, 196, 0.2)",
                            "rgba(0, 163, 196, 0.2)"
                        )}`}
                        height={"28px"}
                        leftIcon={<CalendarIcon />}
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        fontWeight={"thin"}
                    >
                        {editTaskInfo.dueDate !== null
                            ? dateFormat(editTaskInfo.dueDate)
                            : "No Date"}

                        {editTaskInfo.dueDate && (
                            <IconButton
                                ml={1}
                                size={"xs"}
                                variant={"ghost"}
                                color={"gray.500"}
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
                    </Box>

                    {showDatePicker && (
                        <Box
                            position={"absolute"}
                            left={0}
                            top={10}
                            zIndex={10}
                        >
                            <DatePicker
                                // selected={null}
                                selected={editTaskInfo.dueDate}
                                onChange={(date) => {
                                    setEditTaskInfo({
                                        ...editTaskInfo,
                                        dueDate: date,
                                    });
                                    setShowDatePicker(false);
                                }}
                                inline
                            />
                        </Box>
                    )}

                    <Menu>
                        <MenuButton
                            as={Button}
                            variant={"outline"}
                            color={useColorModeValue("gray.500", "gray.500")}
                            border={`1px solid ${useColorModeValue(
                                "rgba(0, 163, 196, 0.2)",
                                "rgba(0, 163, 196, 0.2)"
                            )}`}
                            height={"28px"}
                            fontWeight={"thin"}
                        >
                            {priority[editTaskInfo.priority || 0]}
                        </MenuButton>
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
                                        // width={"fit-content"}
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Portal>
                    </Menu>
                </Flex>

                <Flex
                    mt={2}
                    justifyContent={"end"}
                    gap={2}
                    // direction={["column", "row"]}
                >
                    <Button
                        size={"sm"}
                        bg={"red.400"}
                        color={"white"}
                        _hover={{ bg: "red.500" }}
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={handleSave}
                        isLoading={isLoading}
                        isDisabled={saveButtonDisable}
                    >
                        Save
                    </Button>
                </Flex>
            </Box>
        );
    }
);

TaskEditable.displayName = "TaskEditable";

export default TaskEditable;
