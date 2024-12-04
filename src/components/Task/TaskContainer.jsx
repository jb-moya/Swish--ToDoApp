import React, { useState, useCallback, useMemo } from "react";
import {
    Box,
    IconButton,
    Spacer,
    Stack,
    Flex,
    Text,
    Icon,
} from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";
import { MdDelete, MdEdit } from "react-icons/md";
import TaskEditable from "./TaskEditable";
import PropTypes from "prop-types";
import "../../index.css";
import useDeleteTask from "../../hooks/useDeleteTask";
import useEditTask from "../../hooks/useEditTask";
import useDateFormat, { formatTime } from "../utils/dateFormat";
import useShowToast from "../../hooks/useShowToast";
import { useColorModeValue } from "../ui/color-mode";
import { Tag } from "../ui/tag";
import { Tooltip } from "../ui/tooltip";
import {
    IoCalendarClearOutline,
    IoFlag,
    IoAlertCircleSharp,
} from "react-icons/io5";
import { LiaHashtagSolid } from "react-icons/lia";
import useAuthStore from "../../store/authStore";
import { BsFillPinAngleFill } from "react-icons/bs";
import { CiClock2 } from "react-icons/ci";

import { isDateOverDue } from "../utils/dateFormat";

const priority = ["none", "low", "medium", "high", "critical"];

const TaskContainer = React.memo(({ task }) => {
    const showToast = useShowToast();

    const authUser = useAuthStore((state) => state.user);
    const dateFormat = useDateFormat();

    const formattedDate = useMemo(
        () => dateFormat(task.dueDate),
        [dateFormat, task.dueDate]
    );

    const formattedTime = formatTime(task.dueTime);

    const { isDeleting, handleDeleteTasks } = useDeleteTask();

    const taskNameColor = useColorModeValue("cyan.500", "cyan.200");

    const [currentTaskInfo, setCurrentTaskInfo] = useState({
        id: task.id,
        taskName: task.taskName,
        description: task.description,
        isCompleted: task.isCompleted,
        isPinned: task.isPinned,
        category: task.category,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
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
        } catch (error) {
            showToast("Error", error.message, "error");
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
        setCurrentTaskInfo(updatedTaskInfo);

        handleEditTask(updatedTaskInfo);

        setEditMode(false);
        setIsHovered(false);
    }, []);

    const handleCancel = useCallback(() => {
        setEditMode(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const tagPriorityBorderColor = (priority) => {
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

    const pinColor = useColorModeValue("cyan.500", "cyan.200");

    return (
        <Box
            position={"relative"}
            width={"full"}
            borderBottom={`1px solid ${useColorModeValue(
                "rgba(126, 132, 144, 0.3)",
                "rgba(126, 132, 144, 0.3)"
            )}`}
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
                                colorPalette={"cyan"}
                                variant={"solid"}
                                position={"absolute"}
                                top={0}
                                onCheckedChange={() => {
                                    setCurrentTaskInfo({
                                        ...currentTaskInfo,
                                        isCompleted:
                                            !currentTaskInfo.isCompleted,
                                    });

                                    handleCompleteTask();
                                }}
                                checked={currentTaskInfo.isCompleted}
                                disabled={isEditing}
                            ></Checkbox>

                            <Flex pl={7} lineClamp="2">
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
                                <Text
                                    opacity={0.8}
                                    fontSize={"15px"}
                                    lineClamp="2"
                                >
                                    {currentTaskInfo.description
                                        ? currentTaskInfo.description
                                        : " "}
                                </Text>
                            </Flex>
                        </Stack>
                    </Flex>

                    <Flex
                        justifyContent={"start"}
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
                                startElement={<IoCalendarClearOutline />}
                            >
                                {formattedDate}
                            </Tag>
                        )}

                        {task.dueTime && (
                            <Tag
                                px={1}
                                bg={"transparent"}
                                size={"sm"}
                                rounded={"sm"}
                                border={`1px solid ${borderColor}`}
                                startElement={<CiClock2 />}
                            >
                                {formattedTime}
                            </Tag>
                        )}

                        {task.dueDate &&
                            isDateOverDue(task.dueDate, task.dueTime) && (
                                <Tag
                                    px={1}
                                    bg={"transparent"}
                                    size={"sm"}
                                    color={"#ff7e61"}
                                    rounded={"sm"}
                                    border={`1px solid #ff7e61`}
                                    startElement={<IoAlertCircleSharp />}
                                >
                                    overdue
                                </Tag>
                            )}

                        <Spacer />

                        {task.category !== -1 && (
                            <Tag
                                bg={"transparent"}
                                size={"sm"}
                                endElement={<LiaHashtagSolid />}
                            >
                                {authUser.categories?.[task.category]}
                            </Tag>
                        )}

                        {task.priority !== 0 && (
                            <Tag
                                rounded={"sm"}
                                // width={"69px"}
                                // borderBottom={`2px solid ${tagPriorityBorderColor(
                                //     priority[task.priority]
                                // )}`}
                                bg="transparent"
                                size={"sm"}
                            >
                                <Text>
                                    <Icon
                                        mr={1}
                                        color={tagPriorityBorderColor(
                                            priority[task.priority]
                                        )}
                                    >
                                        <IoFlag />
                                    </Icon>
                                    {priority[task.priority]}
                                </Text>
                            </Tag>
                        )}
                    </Flex>

                    {currentTaskInfo.isPinned && (
                        <Icon
                            boxSize={5}
                            color={pinColor}
                            position={"absolute"}
                            className="flip-horizontal"
                            top={0}
                            left={-6}
                        >
                            <BsFillPinAngleFill />
                        </Icon>
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
                                onClick={() => setEditMode(true)}
                            >
                                <MdEdit />
                            </IconButton>

                            <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                aria-label="delete task"
                                onClick={handleDeletingTask}
                                // loading={isDeleting}
                            >
                                <MdDelete />
                            </IconButton>

                            <Tooltip
                                content="pin on top"
                                placement="top"
                                openDelay={500}
                            >
                                <IconButton
                                    size={"sm"}
                                    backdropBlur={15}
                                    left={0}
                                    variant={"ghost"}
                                    aria-label="complete task"
                                    onClick={() => {
                                        setCurrentTaskInfo({
                                            ...currentTaskInfo,
                                            isPinned: !currentTaskInfo.isPinned,
                                        });

                                        handlePinTask();
                                    }}
                                >
                                    <BsFillPinAngleFill />
                                </IconButton>
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
