import React from "react";
import { Box, useColorModeValue, VStack, Button } from "@chakra-ui/react";
import TaskContainer from "./TaskContainer";

const ProjectContainer = ({
    projectName = "Project Name",
    projectDescription = "Project Description",
}) => {
    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.2)",
        "rgba(0, 163, 196, 0.2)"
    );

    return (
        <Box width={"full"} border={`1px solid ${borderColor}`} p={2}>
            <Box>
                <Box fontWeight={"bold"}>{projectName}</Box>
                <Box>{projectDescription}</Box>

                <VStack>
                    <TaskContainer />
                    <TaskContainer />
                </VStack>

                <Button width="full" variant="ghost">
                    Add Task
                </Button>
            </Box>
        </Box>
    );
};

export default ProjectContainer;
