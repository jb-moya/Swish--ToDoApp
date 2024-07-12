import React, { useEffect } from "react";
import { IoFlagOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";
import {
    ButtonGroup,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Input,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";

const userCategory = ["none", "Work", "School", "Personal", "Family", "Others"];

const CategorySelector = ({ task, setEditTaskInfo }) => {
    const [searchText, setSearchText] = React.useState("");
    const borderStyle = useColorModeValue("gray.500", "gray.500");
    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.2)",
        "rgba(0, 163, 196, 0.2)"
    );

    useEffect(() => {
        console.log("searchText", searchText);
    }, [searchText]);

    return (
        <Menu>
            <ButtonGroup size="sm" isAttached variant="outline">
                <MenuButton
                    as={Button}
                    display={"flex"}
                    px={2}
                    color={useColorModeValue("gray.500", "gray.500")}
                    border={`1px solid ${useColorModeValue(
                        "rgba(0, 163, 196, 0.2)",
                        "rgba(0, 163, 196, 0.2)"
                    )}`}
                    leftIcon={<IoFlagOutline />}
                >
                    {userCategory[task.category || 0]}
                </MenuButton>

                {task.category !== 0 && (
                    <IconButton
                        variant={"ghost"}
                        color={borderStyle}
                        border={`1px solid ${borderColor}`}
                        icon={<CloseIcon />}
                        onClick={(e) => {
                            e.stopPropagation();

                            setEditTaskInfo({
                                ...task,
                                category: 0,
                            });
                        }}
                        _hover={{ color: "red" }}
                    />
                )}
            </ButtonGroup>

            <Portal>
                <MenuList>
                    <Input
                        placeholder="Type Category"
                        px={2}
                        variant={"flushed"}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {/* <MenuDivider /> */}
                    {userCategory.map((item, index) => (
                        <MenuItem
                            key={item}
                            onClick={() =>
                                setEditTaskInfo({
                                    ...task,
                                    category: index,
                                })
                            }
                        >
                            {item}
                        </MenuItem>
                    ))}
                </MenuList>
            </Portal>
        </Menu>
    );
};

export default CategorySelector;
