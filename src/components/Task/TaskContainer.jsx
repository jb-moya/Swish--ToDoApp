import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    Box,
    useColorModeValue,
    Checkbox,
    IconButton,
    Spacer,
    Stack,
    HStack,
    Flex,
    Tag,
    TagLabel,
    Text,
    Icon,
    Portal,
    Tooltip,
    TagRightIcon,
    TagLeftIcon,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskEditable from "./TaskEditable";
import PropTypes from "prop-types";
import "../../index.css";
import useDeleteTask from "../../hooks/useDeleteTask";
import useTaskStore from "../../store/taskStore";
import useEditTask from "../../hooks/useEditTask";
import useDateFormat from "../utils/dateFormat";
import {
    IoCalendarClearOutline,
    IoFlag,
    IoAlertCircleSharp,
} from "react-icons/io5";
import { LiaHashtagSolid } from "react-icons/lia";
import useAuthStore from "../../store/authStore";
import { BsFillPinAngleFill } from "react-icons/bs";

import { isDateOverDue } from "../utils/dateFormat";

const priority = ["none", "low", "medium", "high", "critical"];

const TaskContainer = React.memo(({ task }) => {
    const authUser = useAuthStore((state) => state.user);
    const dateFormat = useDateFormat();

    const formattedDate = useMemo(
        () => dateFormat(task.dueDate),
        [dateFormat, task.dueDate]
    );

    const { isDeleting, handleDeleteTasks } = useDeleteTask();
    const { tasks, setTasks } = useTaskStore();

    const taskNameColor = useColorModeValue("cyan.500", "cyan.200");

    const [currentTaskInfo, setCurrentTaskInfo] = useState({
        id: task.id,
        taskName: task.taskName,
        description: task.description,
        isCompleted: task.isCompleted,
        isPinned: task.isPinned,
        category: task.category,
        dueDate: task.dueDate,
        priority: task.priority,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
    });

    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { isEditing, handleEditTask } = useEditTask();

    const handleDeletingTask = async () => {
        try {
            await handleDeleteTasks([task]);
            // setTasks(tasks.filter((t) => t.id !== task.id));
        } catch (error) {
            console.log(error);
        }
    };

    const taskButtonStyle = useColorModeValue(
        "rgba(255, 255, 255, 0.7)",
        "rgba(26, 32, 44, 0.7)"
    );

    const handleCompleteTask = () => {
        handleEditTask({
            ...currentTaskInfo,
            isCompleted: !currentTaskInfo.isCompleted,
        });
    };

    const handlePinTask = () => {
        handleEditTask({
            ...currentTaskInfo,
            isPinned: !currentTaskInfo.isPinned,
        });
    };

    const handleSave = useCallback((updatedTaskInfo) => {
        console.log("rerererender", updatedTaskInfo);
        setCurrentTaskInfo(updatedTaskInfo);

        handleEditTask(updatedTaskInfo);

        setEditMode(false);
        setIsHovered(false);
    }, []);

    const handleCancel = useCallback(() => {
        console.log("rerererender");
        setEditMode(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const tagPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
                return "#ff7e61";
            case "high":
                return "#ffbd61";
            case "medium":
                return "#faf682";
            case "low":
                return "#cefa82";
            default:
                return "gray";
        }
    };

    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.2)",
        "rgba(0, 163, 196, 0.2)"
    );

    const tagColor = useColorModeValue("gray.400", "gray.700");

    const pinColor = useColorModeValue("cyan.500", "cyan.200");

    return (
        <Box
            position={"relative"}
            width={"full"}
            borderBottom={`1px solid ${useColorModeValue(
                "rgba(126, 132, 144, 0.3)",
                "rgba(126, 132, 144, 0.3)"
            )}`}
            // zIndex={0}
            py={2}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {editMode ? (
                <TaskEditable
                    taskInfo={currentTaskInfo}
                    onSave={handleSave}
                    isLoading={isEditing}
                    onCancel={handleCancel}
                />
            ) : (
                <Box>
                    <Flex>
                        <Stack spacing={0} position={"relative"}>
                            <Checkbox
                                position={"absolute"}
                                top={0}
                                // bg={"red"}
                                onChange={() => {
                                    setCurrentTaskInfo({
                                        ...currentTaskInfo,
                                        isCompleted:
                                            !currentTaskInfo.isCompleted,
                                    });

                                    handleCompleteTask();
                                }}
                                isChecked={currentTaskInfo.isCompleted}
                                isDisabled={isEditing}
                                // isLoading={isEditing}
                            ></Checkbox>

                            <Box pl={7}>
                                <Box
                                    lineHeight={1.2}
                                    fontSize={"17px"}
                                    color={
                                        currentTaskInfo.isCompleted &&
                                        taskNameColor
                                    }
                                    textDecoration={
                                        currentTaskInfo.isCompleted &&
                                        "line-through"
                                    }
                                >
                                    {currentTaskInfo.taskName}
                                </Box>
                                <Box
                                    opacity={0.8}
                                    fontSize={"15px"}
                                    noOfLines={[1, 2]}
                                >
                                    {" "}
                                    {currentTaskInfo.description
                                        ? currentTaskInfo.description
                                        : " "}
                                </Box>
                            </Box>
                        </Stack>
                    </Flex>

                    <Flex
                        justifyContent={"start"}
                        // opacity={0.75}
                        mt={1}
                        ml={7}
                        gap={2}
                        minHeight={"20px"}
                    >
                        {task.dueDate && (
                            <Tag
                                px={1}
                                bg={"transparent"}
                                size={"sm"}
                                rounded={"sm"}
                                border={`1px solid ${borderColor}`}
                            >
                                <TagLeftIcon
                                    as={IoCalendarClearOutline}
                                    mr={1}
                                />
                                <TagLabel>{formattedDate}</TagLabel>
                            </Tag>
                        )}

                        {task.dueDate && isDateOverDue(task.dueDate) && (
                            <Tag
                                px={1}
                                bg={"transparent"}
                                size={"sm"}
                                color={"#ff7e61"}
                                rounded={"sm"}
                                border={`1px solid #ff7e61`}
                            >
                                <TagLeftIcon as={IoAlertCircleSharp} mr={1} />
                                <TagLabel>overdue</TagLabel>
                            </Tag>
                        )}

                        <Spacer />

                        {task.category !== undefined &&
                            task.category !== null && (
                                <Tag bg={"transparent"} size={"sm"}>
                                    <TagLabel>
                                        {authUser.categories?.[task.category] ??
                                            "no category"}
                                    </TagLabel>
                                    <TagRightIcon as={LiaHashtagSolid} />
                                </Tag>
                            )}

                        {task.priority !== 0 && (
                            <Tag
                                px={1}
                                rounded={"sm"}
                                width={"69px"}
                                bg={tagPriorityColor(priority[task.priority])}
                                size={"sm"}
                                color={"gray.700"}
                            >
                                <Icon as={IoFlag} mr={1} />
                                <TagLabel width={"full"} textAlign={"center"}>
                                    {priority[task.priority]}
                                </TagLabel>
                            </Tag>
                        )}
                    </Flex>

                    {currentTaskInfo.isPinned && (
                        <Icon
                            as={BsFillPinAngleFill}
                            boxSize={5}
                            color={pinColor}
                            position={"absolute"}
                            className="flip-horizontal"
                            top={0}
                            left={-6}
                        />
                    )}

                    {isHovered && (
                        <Box
                            position={"absolute"}
                            right={0}
                            top={1}
                            bg={taskButtonStyle}
                            backdropBlur={15}
                        >
                            <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                aria-label="edit task"
                                icon={<EditIcon />}
                                onClick={() => setEditMode(true)}
                            />

                            <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                aria-label="delete task"
                                icon={<DeleteIcon />}
                                onClick={handleDeletingTask}
                                isLoading={isDeleting}
                            />

                            <Tooltip label="pin on top" placement="top" openDelay={500}>
                                <IconButton
                                    size={"sm"}
                                    backdropBlur={15}
                                    left={0}
                                    variant={"ghost"}
                                    aria-label="complete task"
                                    icon={<BsFillPinAngleFill />}
                                    onClick={() => {
                                        setCurrentTaskInfo({
                                            ...currentTaskInfo,
                                            isPinned: !currentTaskInfo.isPinned,
                                        });

                                        handlePinTask();
                                    }}
                                />
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
});

TaskContainer.displayName = "TaskContainer";

TaskContainer.propTypes = {
    taskName: PropTypes.string,
    description: PropTypes.string,
};

export default TaskContainer;
