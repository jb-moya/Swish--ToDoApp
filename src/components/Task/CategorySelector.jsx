import React, { useEffect, useState, useRef } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import {
    ButtonGroup,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Input,
    Text,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";
import { LiaHashtagSolid } from "react-icons/lia";
import { IoAddSharp } from "react-icons/io5";
import FocusLock from "react-focus-lock";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { PiMinusCircleLight } from "react-icons/pi";

const CategorySelector = ({ task, setEditTaskInfo }) => {
    const showToast = useShowToast();
    const [searchText, setSearchText] = React.useState("");
    const { isProfileUpdating, editProfile } = useEditProfile();
    const authUser = useAuthStore((state) => state.user);
    const setAuthUser = useAuthStore((state) => state.setUser);

    const [openAddCategoryButton, setOpenAddCategoryButton] = useState(false);
    const inputRef = useRef(null);

    const borderStyle = useColorModeValue("gray.500", "gray.500");
    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.2)",
        "rgba(0, 163, 196, 0.2)"
    );

    useEffect(() => {
        console.log("AuthUser", authUser);
    }, [authUser]);

    useEffect(() => {
        if (searchText) {
            setOpenAddCategoryButton(true);
        } else {
            setOpenAddCategoryButton(false);
        }
    }, [searchText]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [openAddCategoryButton, inputRef]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [openAddCategoryButton, searchText]);

    const filteredCategories = Array.isArray(authUser.categories)
        ? authUser.categories.reduce((acc, item, index) => {
              if (item.toLowerCase().includes(searchText.toLowerCase())) {
                  acc.push({ item, index });
              }
              return acc;
          }, [])
        : [];

    const handleAddNewCategory = async () => {
        try {
            if (searchText) {
                let newCategories = [];

                if (Array.isArray(authUser.categories)) {
                    newCategories = [...authUser.categories, searchText];
                } else {
                    newCategories = [searchText];
                }

                await editProfile({
                    categories: newCategories,
                });

                setEditTaskInfo({
                    ...task,
                    category: (authUser.categories?.length ?? 0) + 1,
                });
                setSearchText("");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

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
                    leftIcon={<LiaHashtagSolid />}
                >
                    {task.category !== undefined && task.category !== null
                        ? authUser.categories?.[task.category] ?? "add category"
                        : "no category"}
                </MenuButton>

                {task.category !== undefined && task.category !== null && (
                    <IconButton
                        variant={"ghost"}
                        color={borderStyle}
                        border={`1px solid ${borderColor}`}
                        icon={<CloseIcon />}
                        onClick={(e) => {
                            e.stopPropagation();

                            setEditTaskInfo({
                                ...task,
                                category: null,
                            });
                        }}
                        _hover={{ color: "red" }}
                    />
                )}
            </ButtonGroup>

            <MenuList width={"100px"}>
                <FocusLock>
                    <Input
                        placeholder="Type Category"
                        px={2}
                        mb={1}
                        variant={"flushed"}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </FocusLock>

                {openAddCategoryButton && (
                    <MenuItem
                        closeOnSelect={false}
                        as={Button}
                        autoFocus="false"
                        mt={1}
                        variant={"unstyled"}
                        width={"100%"}
                        leftIcon={<IoAddSharp />}
                        onClick={handleAddNewCategory}
                    >
                        Create &quot;
                        <Text
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            maxWidth="100%"
                        >
                            {searchText}
                        </Text>
                        &quot;
                    </MenuItem>
                )}

                <MenuItem
                    as={Button}
                    variant={"unstyled"}
                    leftIcon={<PiMinusCircleLight />}
                    onClick={() => {
                        setEditTaskInfo({
                            ...task,
                            category: null,
                        });
                    }}
                >
                    {task.category !== undefined && task.category !== null
                        ? "Remove Category"
                        : "No Category"}
                </MenuItem>

                {filteredCategories.map((obj) => (
                    <MenuItem
                        key={obj.item}
                        onClick={() => {
                            let categoryIndex = authUser.categories?.indexOf(
                                obj.item
                            );
                            if (categoryIndex === -1 || !authUser.categories) {
                                categoryIndex = null;
                            }

                            console.log("categoryIndex", categoryIndex);

                            setEditTaskInfo({
                                ...task,
                                category: categoryIndex,
                            });
                        }}
                    >
                        {obj.item}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};

export default CategorySelector;
