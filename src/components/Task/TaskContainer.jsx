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
    Portal,
    TagRightIcon,
    TagLeftIcon,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskEditable from "./TaskEditable";
import PropTypes from "prop-types";
import useDeleteTask from "../../hooks/useDeleteTask";
import useTaskStore from "../../store/taskStore";
import useEditTask from "../../hooks/useEditTask";
import useDateFormat from "../utils/dateFormat";
import { IoCalendarClearOutline, IoFlagOutline } from "react-icons/io5";
import { LiaHashtagSolid } from "react-icons/lia";
import useAuthStore from "../../store/authStore";

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
                                isLoading={isEditing}
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
                        opacity={.75}
                        mt={1}
                        ml={7}
                        gap={3}
                        minHeight={"20px"}
                    >
                        {task.dueDate && (
                            <Tag p={0} bg={"transparent"} size={"sm"}>
                                <TagLeftIcon
                                    as={IoCalendarClearOutline}
                                    mr={1}
                                />
                                <TagLabel>{formattedDate}</TagLabel>
                            </Tag>
                        )}

                        {task.priority !== 0 && (
                            <Tag p={0} bg={"transparent"} size={"sm"}>
                                <TagLeftIcon as={IoFlagOutline} mr={1} />
                                <TagLabel>{priority[task.priority]}</TagLabel>
                            </Tag>
                        )}
                        <Spacer />
                        {task.category !== undefined &&
                            task.category !== null && (
                                <Tag p={0} bg={"transparent"} size={"sm"}>
                                    <TagLabel>
                                        {authUser.categories?.[task.category] ??
                                            "no category"}
                                    </TagLabel>
                                    <TagRightIcon as={LiaHashtagSolid} />
                                </Tag>
                            )}
                    </Flex>

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
