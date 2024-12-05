import React, { useState } from "react";
import { Flex, Input, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import {
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTrigger,
} from "./../ui/dialog";
import { Button } from "../ui/button";
import { CiSearch } from "react-icons/ci";
import useTaskStore from "../../store/taskStore";
import useAuthStore from "../../store/authStore";
import useCategoryStore from "../../store/categoryStore";

const SearchTask = ({ mainContainerProps, buttonProps }) => {
    const { getTasks } = useTaskStore();
    const authUser = useAuthStore((state) => state.user);
    const [searchedTask, setSearchedTask] = useState("");
    const [filteredTask, setFilteredTask] = useState([]);
    const [open, setOpen] = useState(false);
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const { setSelectedCategoryId } = useCategoryStore();

    return (
        <DialogRoot
            {...mainContainerProps}
            placement={"center"}
            motionPreset="slide-in-bottom"
            scrollBehavior="inside"
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <DialogTrigger asChild>
                <Button
                    size={isSmallScreen ? "sm" : "md"}
                    colorPalette="cyan"
                    variant="outline"
                    {...buttonProps}
                >
                    {isSmallScreen ? null : "Search"} <CiSearch />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <Input
                        placeholder="Search task name"
                        value={searchedTask}
                        onChange={(e) => {
                            setSearchedTask(e.target.value);
                            setFilteredTask(
                                getTasks(
                                    undefined,
                                    undefined,
                                    undefined,
                                    e.target.value
                                )
                            );
                        }}
                    />
                </DialogHeader>
                <DialogBody>
                    <Stack gap={0.5}>
                        {filteredTask.length > 0 ? (
                            filteredTask.map((task) => (
                                <Button
                                    key={task.id}
                                    variant="ghost"
                                    onClick={() => {
                                        setSelectedCategoryId(task.category);
                                        setOpen(false);
                                    }}
                                >
                                    <Flex
                                        width={"full"}
                                        justify={"space-between"}
                                    >
                                        <Text>{task.taskName}</Text>
                                        <Text textStyle="xs" opacity={0.7}>
                                            {
                                                authUser.categories?.[
                                                    task.category
                                                ]
                                            }
                                        </Text>
                                    </Flex>
                                </Button>
                            ))
                        ) : (
                            <Text textAlign="center" color="gray.500">
                                No tasks found for "{searchedTask}"
                            </Text>
                        )}
                    </Stack>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
};

export default SearchTask;
