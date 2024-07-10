import React, { useState, useCallback } from "react";
import { Box, useColorModeValue, Checkbox, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import TaskEditable from "./TaskEditable";
import PropTypes from "prop-types";
import useDeleteTask from "../../hooks/useDeleteTask";
import useTaskStore from "../../store/taskStore";
import useEditTask from "../../hooks/useEditTask";

const TaskContainer = React.memo(({ task }) => {
    const { isDeleting, handleDeleteTask } = useDeleteTask();
    const { tasks, setTasks } = useTaskStore();

    const taskNameColor = useColorModeValue("cyan.500", "cyan.200");

    const [currentTaskInfo, setCurrentTaskInfo] = useState({
        id: task.id,
        taskName: task.taskName,
        description: task.description,
        isCompleted: task.isCompleted,
        createdBy: task.createdBy,
        createdAt: task.createdAt,
    });

    const [editMode, setEditMode] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { isEditing, handleEditTask } = useEditTask();

    const handleDeletingTask = async () => {
        try {
            await handleDeleteTask(task);
            setTasks(tasks.filter((t) => t.id !== task.id));
        } catch (error) {
            console.log(error);
        }
    };

    // keep an eye on these two
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

    return (
        <Box
            position={"relative"}
            width={"full"}
            borderBottom={`1px solid ${useColorModeValue(
                "rgba(0, 163, 196, 0.1)",
                "rgba(0, 163, 196, 0.1)"
            )}`}
            // borderColor={useColorModeValue("white.00", "black.400")}
            p={2}
            _hover={{ bg: "rgba(0, 163, 196, 0.05)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
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
                    <Checkbox
                        mr={2}
                        onChange={() => {
                            setCurrentTaskInfo({
                                ...currentTaskInfo,
                                isCompleted: !currentTaskInfo.isCompleted,
                            });

                            handleCompleteTask();
                        }}
                        isChecked={currentTaskInfo.isCompleted}
                    >
                        <Box
                            fontWeight={"bold"}
                            color={currentTaskInfo.isCompleted && taskNameColor}
                            textDecoration={
                                currentTaskInfo.isCompleted && "line-through"
                            }
                        >
                            {currentTaskInfo.taskName}
                        </Box>
                        <Box lineHeight={1} opacity={0.75}>
                            {currentTaskInfo.description}
                        </Box>
                    </Checkbox>
                    {isHovered && (
                        <Box position={"absolute"} right={2} top={2}>
                            <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                aria-label="delete task"
                                icon={<DeleteIcon />}
                                onClick={handleDeletingTask}
                                isLoading={isDeleting}
                            />
                            <IconButton
                                size={"sm"}
                                variant={"ghost"}
                                aria-label="edit task"
                                icon={<EditIcon />}
                                onClick={() => setEditMode(true)}
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
