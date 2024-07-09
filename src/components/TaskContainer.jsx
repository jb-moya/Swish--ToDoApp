import React, { useState } from "react";
import { Box, useColorModeValue, Checkbox, IconButton } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
const TaskContainer = ({
    taskName = "Task Name",
    description = "Description",
}) => {
    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.1)",
        "rgba(0, 163, 196, 0.1)"
    );

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            position={"relative"}
            width={"full"}
            borderBottom={`1px solid ${borderColor}`}
            p={2}
            _hover={{ cursor: "pointer", bg: "rgba(0, 163, 196, 0.05)" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box>
                <Checkbox>
                    <Box fontWeight={"bold"}>{taskName}</Box>
                    <Box>{description}</Box>
                </Checkbox>
            </Box>

            {isHovered && (
                <Box position={"absolute"} right={2} top={2}>
                    <IconButton 
                        size={"sm"}
                        variant={"ghost"}
                        aria-label="Search database"
                        icon={<DeleteIcon />}
                    />
                    <IconButton 
                        size={"sm"}
                        variant={"ghost"}
                        aria-label="Search database"
                        icon={<EditIcon />}
                    />
                </Box>
            )}
        </Box>
    );
};

export default TaskContainer;
