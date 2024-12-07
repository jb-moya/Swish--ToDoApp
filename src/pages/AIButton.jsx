"use client";

import React, { useEffect, useState } from "react";
import { TbFlare } from "react-icons/tb";
import {
    Textarea,
    IconButton,
    Text,
    Flex,
    Spinner,
    chakra,
    useRecipe,
} from "@chakra-ui/react";
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "./../components/ui/popover";
import { InputGroup } from "../components/ui/input-group";
import { IoArrowUpCircleSharp } from "react-icons/io5";
import { BsInfoCircle } from "react-icons/bs";
import { Tooltip } from "../components/ui/tooltip";
import useGenerativeAI from "../hooks/useGenerativeAI";
import AutoResize from "react-textarea-autosize";

const SubmitPromptButton = ({ onSubmit, ...props }) => {
    return (
        <IconButton
            variant={"ghost"}
            size={"xs"}
            aria-label="Submit prompt"
            colorScheme="blue"
            onClick={onSubmit}
            {...props}
        >
            <IoArrowUpCircleSharp />
        </IconButton>
    );
};

const StyledAutoResize = chakra(AutoResize);

const AIButton = () => {
    const { run: addGenerativeAITasks, loading } = useGenerativeAI();
    const [task, setTask] = useState("");

    const recipe = useRecipe({ key: "textarea" });
    const styles = recipe({ size: "sm" });

    const handleInputChange = (event) => {
        setTask(event.target.value);
    };

    const handleSubmit = () => {
        if (task.trim()) {
            addGenerativeAITasks({ message: task });
            console.log("Submitting task:", task);
        }

        setTask("");
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <PopoverRoot>
            <PopoverTrigger asChild>
                <IconButton
                    rounded="full"
                    size={"xs"}
                    variant={"surface"}
                    border={"1px solid cyan"}
                    aria-label="AI"
                    colorScheme="blue"
                >
                    <TbFlare />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody>
                    <PopoverTitle fontWeight="medium">
                        <Flex justify={"space-between"}>
                            <Flex alignItems={"center"} gap={2}>
                                <Text>Gemini AI</Text>
                                <TbFlare />
                                <Tooltip
                                    content="this app uses free-tier Gemini AI 1.5 Pro."
                                    openDelay={50}
                                    closeDelay={200}
                                >
                                    <BsInfoCircle size={20} />
                                </Tooltip>
                            </Flex>
                            {loading && (
                                <Flex gap={2}>
                                    <Spinner borderWidth="3px" />
                                    <Text fontWeight="light">
                                        generating...
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    </PopoverTitle>
                    <Text my="4" opacity={0.8}>
                        Tell me what you're working on, and I can suggest
                        helpful tasks to get you moving.
                    </Text>
                    <InputGroup
                        width="full"
                        endElement={
                            <SubmitPromptButton
                                onSubmit={handleSubmit}
                                disabled={loading}
                            />
                        }
                    >
                        <StyledAutoResize
                            placeholder="Type your task here"
                            value={task}
                            disabled={loading}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            minH="40px"
                            resize="none"
                            overflow="hidden"
                            lineHeight="inherit"
                            css={styles}
                        />
                    </InputGroup>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
};

export default AIButton;
