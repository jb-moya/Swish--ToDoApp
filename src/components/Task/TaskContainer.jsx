import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
    Box,
    useColorModeValue,
    Checkbox,
    IconButton,
    Stack,
    HStack,
    Flex,
    Tag,
    TagLabel,
    Text,
    Portal,
    TagRightIcon,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskEditable from "./TaskEditable";
import PropTypes from "prop-types";
import useDeleteTask from "../../hooks/useDeleteTask";
import useTaskStore from "../../store/taskStore";
import useEditTask from "../../hooks/useEditTask";
import useDateFormat from "../utils/dateFormat";
import { IoCalendarClearOutline } from "react-icons/io5";

const TaskContainer = React.memo(({ task }) => {
    const dateFormat = useDateFormat();

    const formattedDate = useMemo(
        () => dateFormat(task.dueDate),
        [dateFormat, task.dueDate]
    );

    const { isDeleting, handleDeleteTask } = useDeleteTask();
    const { tasks, setTasks } = useTaskStore();

    const taskNameColor = useColorModeValue("cyan.500", "cyan.200");

    const [currentTaskInfo, setCurrentTaskInfo] = useState({
        id: task.id,
        taskName: task.taskName,
        description: task.description,
        isCompleted: task.isCompleted,
        dueDate: task.dueDate,
        priority: task.priority,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
    });

    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { isEditing, handleEditTask } = useEditTask();

    useEffect(() => {
        console.log("R E R E N D E R E D");
    }, [isHovered]);

    const handleDeletingTask = async () => {
        try {
            await handleDeleteTask(task);
            setTasks(tasks.filter((t) => t.id !== task.id));
        } catch (error) {
            console.log(error);
        }
    };

    const taskButtonStyle = useColorModeValue(
        "rgba(255, 255, 255, 0.7)",
        "rgba(26, 32, 44, 0.7)"
    );

    // keep an eye on these tworgb(26, 32, 44)
    // might use zustand for this

    const handleCompleteTask = () => {
        handleEditTask({
            ...currentTaskInfo,
            isCompleted: !currentTaskInfo.isCompleted,
        });
    };

    const handleSave = useCallback((updatedTaskInfo) => {
        console.log("rerererender", updatedTaskInfo);
        setCurrentTaskInfo(updatedTaskInfo);

        setTasks(
            tasks.map((task) => {
                if (task.id === updatedTaskInfo.id) {
                    return updatedTaskInfo;
                }
                return task;
            })
        );

        handleEditTask(updatedTaskInfo);
        setEditMode(false);
        setIsHovered(false);
    }, []);

    const handleCancel = useCallback(() => {
        console.log("rerererender");
        setEditMode(false);
    }, []);

    useEffect(() => {
        console.log("currentTaskInfo", currentTaskInfo);
    }, [currentTaskInfo]);

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
                                    lineHeight={1}
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

                    <HStack spacing={4} mt={1} minHeight={"20px"}>
                        {task.dueDate && (
                            <Tag p={0} bg={"transparent"} ml={7} size={"sm"}>
                                <TagRightIcon
                                    as={IoCalendarClearOutline}
                                    ml={0}
                                    mr={1}
                                />
                                <TagLabel>{formattedDate}</TagLabel>
                            </Tag>
                        )}
                    </HStack>

                    {isHovered && (
                        <Box
                            position={"absolute"}
                            right={3}
                            top={3}
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
