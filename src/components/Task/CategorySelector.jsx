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
    Spacer,
    Box,
    Text,
    useDisclosure,
    Tooltip,
    Flex,
    Portal,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    MenuDivider,
    ModalCloseButton,
    IconButton,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import { LiaHashtagSolid } from "react-icons/lia";
import { IoAddSharp } from "react-icons/io5";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { PiMinusCircleLight } from "react-icons/pi";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { RiDeleteBin7Line } from "react-icons/ri";
import useDeleteTask from "../../hooks/useDeleteTask";
import FocusLock from "react-focus-lock";
import { v4 as uuidv4 } from "uuid";
import useTaskStore from "../../store/taskStore";
const CategorySelector = ({
    currentCategory,
    onCategoryChange,
    isEditMode = true,
}) => {
    const showToast = useShowToast();
    const {
        isOpen: isOpenDeleteConfirm,
        onOpen: openDeleteConfirm,
        onClose: closeDeleteConfirm,
    } = useDisclosure();

    const [searchText, setSearchText] = React.useState("");
    const [visible, setVisible] = React.useState(true);
    const { tasks } = useTaskStore((state) => state);
    const [category, setCategory] = React.useState(currentCategory);
    const { isProfileUpdating, editProfile } = useEditProfile();
    const authUser = useAuthStore((state) => state.user);
    const { isDeleting, handleDeleteTasks } = useDeleteTask();

    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleBlur = () => {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 0);
        };

        if (searchInputRef.current) {
            searchInputRef.current.addEventListener("blur", handleBlur);
        }

        return () => {
            if (searchInputRef.current) {
                searchInputRef.current.removeEventListener("blur", handleBlur);
            }
        };
    }, [searchText]);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchText]);

    const borderStyle = useColorModeValue("gray.500", "gray.500");
    const borderColor = useColorModeValue(
        "rgba(0, 163, 196, 0.2)",
        "rgba(0, 163, 196, 0.2)"
    );

    useEffect(() => {
        console.log("rerendeinrg g g g gg");
    }, []);

    const filteredCategories =
        typeof authUser.categories === "object" &&
        !Array.isArray(authUser.categories)
            ? Object.entries(authUser.categories).reduce(
                  (acc, [id, category]) => {
                      if (
                          category
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                      ) {
                          acc.push({ id, category });
                      }
                      return acc;
                  },
                  []
              )
            : [];

    // console.log("filteredCategories", filteredCategories);

    const handleAddNewCategory = async () => {
        try {
            if (searchText) {
                const newCategoryUUID = uuidv4();

                let newCategories = {
                    ...authUser.categories,
                    [newCategoryUUID]: searchText,
                };

                await editProfile({
                    categories: newCategories,
                });

                setCategory(newCategoryUUID);
                onCategoryChange(newCategoryUUID);
                setSearchText("");
            }
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const newCategories = { ...authUser.categories };
            delete newCategories[categoryId];

            await editProfile({
                categories: newCategories,
            });

            const tasksToBeDeleted = tasks.filter((task) => {
                console.log("task.category", task.category, categoryId);
                return task.category === categoryId;
            });

            if (tasksToBeDeleted.length > 0) {
                console.log("LMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                await handleDeleteTasks(tasksToBeDeleted);
            }

            setCategory(-1);
            onCategoryChange(-1);
            closeDeleteConfirm();
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const isCategoryTitleExists = (searchText) => {
        return (
            typeof authUser.categories === "object" &&
            !Array.isArray(authUser.categories) &&
            Object.values(authUser.categories).includes(searchText)
        );
    };

    return (
        <Menu>
            <Modal
                autoSelect
                isOpen={isOpenDeleteConfirm}
                onClose={closeDeleteConfirm}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Delete?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        This will permanently delete &apos;
                        {authUser.categories?.[category]}&apos; and all its tasks.
                        This can&apos;t be undone.
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={closeDeleteConfirm}
                        >
                            Close
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => {
                                handleDeleteCategory(category);
                            }}
                        >
                            Delete Category
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ButtonGroup size="sm" isAttached variant="outline">
                <Tooltip
                    label="Select Category"
                    placement="top"
                    openDelay={500}
                >
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
                        rightIcon={<ChevronDownIcon />}
                    >
                        {isEditMode
                            ? category != null
                                ? authUser.categories?.[category] ??
                                  "add category"
                                : "no category"
                            : category !== -1
                            ? authUser.categories?.[category] ??
                              "add category"
                            : "All"}
                    </MenuButton>
                </Tooltip>

                {isEditMode && category !== -1 && (
                    <IconButton
                        variant={"ghost"}
                        color={borderStyle}
                        border={`1px solid ${borderColor}`}
                        icon={<CloseIcon />}
                        onClick={(e) => {
                            e.stopPropagation();
                            setCategory(-1);
                            onCategoryChange(-1);
                        }}
                        _hover={{ color: "red" }}
                    />
                )}
            </ButtonGroup>

            <Portal>
                <MenuList width={"100px"} as={Box}>
                    <Input
                        ref={searchInputRef}
                        placeholder="Search or Create New"
                        px={2}
                        mb={1}
                        variant={"flushed"}
                        // value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                    />

                    <MenuItem
                        my={1}
                        width={"100%"}
                        isDisabled={
                            !searchText || isCategoryTitleExists(searchText)
                        }
                        _disabled={{ opacity: 0.3, cursor: "not-allowed" }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddNewCategory();
                        }}
                    >
                        <Icon as={IoAddSharp} mr={1} />
                        {searchText ? (
                            <Flex overflow="hidden" gap={1}>
                                <Box>Create</Box>
                                <Box
                                    fontWeight={"bold"}
                                    color={"cyan.500"}
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    maxWidth="100%"
                                >
                                    {searchText}
                                </Box>
                            </Flex>
                        ) : (
                            <Text>Type to create</Text>
                        )}
                    </MenuItem>

                    <MenuItem
                        autoFocus="false"
                        // variant={"unstyled"}
                        my={1}
                        leftIcon={isEditMode && <PiMinusCircleLight />}
                        onClick={() => {
                            setCategory(-1);
                            onCategoryChange(-1);
                        }}
                    >
                        {isEditMode && currentCategory !== -1
                            ? "Remove Category"
                            : isEditMode
                            ? "No Category"
                            : "All"}
                    </MenuItem>

                    <MenuDivider />

                    {filteredCategories.map((category) => (
                        <MenuItem
                            as={Flex}
                            key={category.id}
                            onClick={() => {
                                setCategory(category.id);
                                onCategoryChange(category.id);
                            }}
                        >
                            <Box>{category.category}</Box>
                            <Spacer />
                            <IconButton
                                variant={"ghost"}
                                size={"10px"}
                                as={RiDeleteBin7Line}
                                color={"red.400"}
                                onClick={(e) => {
                                    console.log("category", category);
                                    e.stopPropagation();
                                    setCategory(category.id);
                                    openDeleteConfirm();
                                }}
                            />
                        </MenuItem>
                    ))}
                </MenuList>
            </Portal>
        </Menu>
    );
};

export default CategorySelector;
