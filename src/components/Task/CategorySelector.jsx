import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

import {
    Input,
    Spacer,
    Box,
    Text,
    useDisclosure,
    Flex,
    Portal,
    IconButton,
    Group,
    Icon,
} from "@chakra-ui/react";
import { Tooltip } from "../ui/tooltip";
import { LiaHashtagSolid } from "react-icons/lia";
import { IoAddSharp } from "react-icons/io5";
import useEditProfile from "../../hooks/useEditProfile";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import { PiMinusCircleLight } from "react-icons/pi";
import { IoChevronDown } from "react-icons/io5";
import { RiDeleteBin7Line } from "react-icons/ri";
import useDeleteTask from "../../hooks/useDeleteTask";
import { v4 as uuidv4 } from "uuid";
import useTaskStore from "../../store/taskStore";
import useCategoryStore from "../../store/categoryStore";
import { useColorModeValue } from "../ui/color-mode";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogActionTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "./../ui/dialog";
import { Button } from "../ui/button";
import {
    MenuContent,
    MenuItem,
    MenuItemCommand,
    MenuRoot,
    MenuTrigger,
} from "../ui/menu";

const CategorySelector = ({
    currentCategory,
    onCategoryChange,
    isEditMode = true,
}) => {
    const { categoriesTaskCount } = useCategoryStore();
    const showToast = useShowToast();
    const {
        isOpen: isOpenDeleteConfirm,
        onOpen: openDeleteConfirm,
        onClose: closeDeleteConfirm,
    } = useDisclosure();

    console.log("currentCategory", currentCategory);

    const [searchText, setSearchText] = React.useState("");
    const { tasks } = useTaskStore((state) => state);
    const [category, setCategory] = React.useState(currentCategory);
    const { editProfile } = useEditProfile();
    const authUser = useAuthStore((state) => state.user);
    const { handleDeleteTasks } = useDeleteTask();

    const searchInputRef = useRef(null);

    useEffect(() => {
        setCategory(currentCategory);
    }, [currentCategory]);

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
                return task.category === categoryId;
            });

            if (tasksToBeDeleted.length > 0) {
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

    const totalUnCategorizedTasks = tasks.reduce((acc, task) => {
        if (task.category === -1) {
            return acc + 1;
        }
        return acc;
    }, 0);

    return (
        // <></>
        <MenuRoot>
            {/* <DialogRoot>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        Open Dialog
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button>Save</Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot> */}

            <MenuTrigger asChild>
                <Group attached>
                    <Tooltip
                        content="Select Category"
                        placement="top"
                        openDelay={500}
                    >
                        <Button
                            as={Button}
                            display={"flex"}
                            px={2}
                            color={useColorModeValue("gray.500", "gray.500")}
                            border={`1px solid ${useColorModeValue(
                                "rgba(0, 163, 196, 0.2)",
                                "rgba(0, 163, 196, 0.2)"
                            )}`}
                            leftIcon={<LiaHashtagSolid />}
                            rightIcon={<IoChevronDown />}
                        >
                            {isEditMode
                                ? category != null
                                    ? (authUser.categories?.[category] ??
                                      "add category")
                                    : "no category"
                                : category !== -1
                                  ? (authUser.categories?.[category] ??
                                    "add category")
                                  : "All"}
                        </Button>
                    </Tooltip>
                    {isEditMode && category !== -1 && (
                        <IconButton
                            variant={"ghost"}
                            color={borderStyle}
                            border={`1px solid ${borderColor}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCategory(-1);
                                onCategoryChange(-1);
                            }}
                            _hover={{ color: "red" }}
                        >
                            <IoMdClose />
                        </IconButton>
                    )}
                </Group>
            </MenuTrigger>

            <MenuContent>
                <Input
                    ref={searchInputRef}
                    placeholder="Search or Create New"
                    px={2}
                    mb={1}
                    variant={"flushed"}
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
                    {/* <Icon={1}><IoAddSharp /></Icon> */}
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
                    autoFocus={true}
                    my={1}
                    leftIcon={isEditMode && <PiMinusCircleLight />}
                    onClick={() => {
                        setCategory(-1);
                        onCategoryChange(-1);
                    }}
                    position={"relative"}
                >
                    {isEditMode && currentCategory !== -1
                        ? "Uncategorize"
                        : isEditMode
                          ? "No Category"
                          : "All"}

                    {!isEditMode && tasks.length > 0 && (
                        <Text
                            position={"absolute"}
                            fontSize={"small"}
                            right={6}
                            fontWeight={"thin"}
                            mr={4}
                            opacity={0.8}
                        >
                            {tasks.length}
                        </Text>
                    )}

                    {isEditMode && totalUnCategorizedTasks > 0 && (
                        <Text
                            position={"absolute"}
                            fontSize={"small"}
                            right={6}
                            fontWeight={"thin"}
                            mr={4}
                            opacity={0.8}
                        >
                            {totalUnCategorizedTasks}
                        </Text>
                    )}
                </MenuItem>

                {/* <MenuDivider /> */}

                {filteredCategories.map((category) => (
                    <MenuItem
                        as={Flex}
                        key={category.id}
                        onClick={() => {
                            setCategory(category.id);
                            onCategoryChange(category.id);
                        }}
                        position={"relative"}
                    >
                        <Box noOfLines={1} width={"80%"}>
                            {category.category}
                        </Box>
                        <Spacer />
                        {categoriesTaskCount[category.id] > 0 && (
                            <Text
                                position={"absolute"}
                                fontSize={"small"}
                                right={6}
                                fontWeight={"thin"}
                                mr={4}
                                opacity={0.8}
                            >
                                {categoriesTaskCount[category.id]}
                            </Text>
                        )}

                        <IconButton
                            variant={"ghost"}
                            size={"10px"}
                            color={"red.400"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCategory(category.id);
                                openDeleteConfirm();
                            }}
                        >
                            <RiDeleteBin7Line />
                        </IconButton>
                    </MenuItem>
                ))}
            </MenuContent>
        </MenuRoot>

        //     {/* <Modal
        //         autoSelect
        //         isOpen={isOpenDeleteConfirm}
        //         onClose={closeDeleteConfirm}
        //     >
        //         <ModalOverlay />
        //         <ModalContent>
        //             <ModalHeader>Delete?</ModalHeader>
        //             <ModalCloseButton />
        //             <ModalBody>
        //                 This will permanently delete &apos;
        //                 {authUser.categories?.[category]}&apos; and all its
        //                 tasks. This can&apos;t be undone.
        //             </ModalBody>

        //             <ModalFooter>
        //                 <Button
        //                     colorScheme="blue"
        //                     mr={3}
        //                     onClick={closeDeleteConfirm}
        //                 >
        //                     Close
        //                 </Button>
        //                 <Button
        //                     variant="ghost"
        //                     onClick={() => {
        //                         handleDeleteCategory(category);
        //                     }}
        //                 >
        //                     Delete Category
        //                 </Button>
        //             </ModalFooter>
        //         </ModalContent>
        //     </Modal> */}

        //     <Portal>
        //
        //     </Portal>
    );
};

export default CategorySelector;
