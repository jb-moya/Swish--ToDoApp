import React, { useEffect, useState, useRef } from "react";
import {
    Box,
    Input,
    Button,
    Flex,
    useColorModeValue,
} from "@chakra-ui/react";

const TaskEditable = React.memo(
    ({
        taskInfo = { taskName: "", description: "" },
        onSave,
        onCancel,
        isLoading,
    }) => {
        const [editTaskInfo, setEditTaskInfo] = useState({
            id: taskInfo.id,
            taskName: taskInfo.taskName,
            description: taskInfo.description,
            isCompleted: taskInfo.isCompleted,
            createdBy: taskInfo.createdBy,
            createdAt: taskInfo.createdAt,
        });
        const [saveButtonDisable, setSaveButtonDisable] = useState(true);
        const inputTitleRef = useRef(null);

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

        return (
            <Box
                position={"relative"}
                width={"full"}
                rounded={"md"}
                border={`1px solid ${useColorModeValue(
                    "rgba(0, 163, 196, 0.1)",
                    "rgba(0, 163, 196, 0.1)"
                )}`}
                p={2}
            >
                <Input
                    type="text"
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
                    justifyContent={"end"}
                    gap={2}
                    direction={["column", "row"]}
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
