"use client";

import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../store/authStore";
import usePreviewImg from "../../../hooks/usePreviewImg";
import useEditProfile from "../../../hooks/useEditProfile";
import useShowToast from "../../../hooks/useShowToast";
import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Box,
    Text,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import PasswordInput from "../PasswordInput";
import useUpdateUserPassword from "../../../hooks/useUpdatePassword";
import useReauthenticateWithCredential from "../../../hooks/useReauthenticateWithCredential";

export default function EditProfile({ isOpen, onClose }) {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        showOldPassword: false,
        showNewPassword: false,
        showConfirmNewPassword: false,
    });

    const authUser = useAuthStore((state) => state.user);
    const fileRef = useRef(null);
    const { handleImageChange, selectedFile, setSelectedFile } =
        usePreviewImg();
    const { isUpdating, editProfile } = useEditProfile();
    const { updateUserPassword, updating } = useUpdateUserPassword();
    const showToast = useShowToast();

    const { verifyPassword } = useReauthenticateWithCredential();

    const handleEditProfile = async () => {
        try {
            await editProfile(inputs, selectedFile);
            setSelectedFile(null);
            onClose();
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    useEffect(() => {
    }, [inputs]);

    const isPasswordValid = () => {
        if (!verifyPassword(inputs.oldPassword)) {
            return false;
        }   

        if (inputs.newPassword !== inputs.confirmNewPassword) {
            showToast("Error", "New Passwords do not match", "error");
            return false;
        }

        return true;
    };

    const handlePasswordChange = () => {
        console.log("handlePasswordChange");
        updateUserPassword(inputs.newPassword);
    };

    return (
        <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <Stack
                spacing={5}
                w={"full"}
                maxW={"md"}
                bg={useColorModeValue("white", "gray.700")}
                rounded={"xl"}
                boxShadow={"lg"}
                p={6}
                my={12}
            >
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                    Edit Profile
                </Heading>
                <FormControl id="profilePicture" mb={6}>
                    <Stack direction={["column", "row"]} spacing={6}>
                        <Center>
                            <Avatar
                                size="xl"
                                src={selectedFile || authUser.profilePicURL}
                                border={"2px solid white "}
                            >
                                <AvatarBadge
                                    as={IconButton}
                                    size="sm"
                                    rounded="full"
                                    bg={"red.400"}
                                    color={"white"}
                                    top="-10px"
                                    colorScheme="red"
                                    aria-label="remove Image"
                                    icon={<SmallCloseIcon />}
                                    onClick={() => setSelectedFile(null)}
                                />
                            </Avatar>
                        </Center>
                        <Center w="full">
                            <Button
                                w="full"
                                onClick={() => fileRef.current.click()}
                            >
                                Change Profile Picture
                            </Button>
                        </Center>

                        <Input
                            type="file"
                            hidden
                            ref={fileRef}
                            onChange={handleImageChange}
                        />
                    </Stack>
                </FormControl>

                <FormControl id="userName" isRequired variant="floating">
                    <Input
                        size={"sm"}
                        placeholder=" "
                        _placeholder={{ color: "gray.500" }}
                        type="text"
                        variant="flushed"
                        value={inputs.username || authUser.username}
                        onChange={(e) =>
                            setInputs({ ...inputs, username: e.target.value })
                        }
                    />
                    <FormLabel
                        fontWeight={"thin"}
                        size={"sm"}
                        bg={useColorModeValue("#fff", "#2d3748")}
                    >
                        User name
                    </FormLabel>
                </FormControl>

                <FormControl id="email" isRequired variant="floating">
                    <Input
                        size={"sm"}
                        placeholder=" "
                        _placeholder={{ color: "gray.500" }}
                        type="email"
                        variant="flushed"
                        value={inputs.email || authUser.email}
                        onChange={(e) =>
                            setInputs({ ...inputs, email: e.target.value })
                        }
                    />
                    <FormLabel
                        fontWeight={"thin"}
                        size={"sm"}
                        bg={useColorModeValue("#fff", "#2d3748")}
                    >
                        Email address
                    </FormLabel>
                </FormControl>

                <Heading
                    mt={4}
                    lineHeight={1.1}
                    fontSize={{ base: "xl", sm: "2xl" }}
                >
                    Change Password
                </Heading>

                <PasswordInput
                    placeholder={"old password"}
                    showPassword={showPassword.showOldPassword}
                    setShowPassword={() =>
                        setShowPassword({
                            ...showPassword,
                            showOldPassword: !showPassword.showOldPassword,
                        })
                    }
                    input={inputs.oldPassword}
                    setInput={(e) => setInputs({ ...inputs, oldPassword: e })}
                    // mb={0}
                />

                <PasswordInput
                    placeholder={"new password"}
                    showPassword={showPassword.showNewPassword}
                    setShowPassword={() =>
                        setShowPassword({
                            ...showPassword,
                            showNewPassword: !showPassword.showNewPassword,
                        })
                    }
                    input={inputs.newPassword}
                    setInput={(e) => setInputs({ ...inputs, newPassword: e })}
                    // mb={0}
                />

                <PasswordInput
                    placeholder={"confirm new password"}
                    showPassword={showPassword.showConfirmNewPassword}
                    setShowPassword={() =>
                        setShowPassword({
                            ...showPassword,
                            showConfirmNewPassword:
                                !showPassword.showConfirmNewPassword,
                        })
                    }
                    input={inputs.confirmNewPassword}
                    setInput={(e) =>
                        setInputs({ ...inputs, confirmNewPassword: e })
                    }
                    // mb={0}
                />

                <Stack spacing={6} direction={["column", "row"]}>
                    <Button
                        bg={"red.400"}
                        color={"white"}
                        w="full"
                        _hover={{
                            bg: "red.500",
                        }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        // bg={"blue.400"}
                        // color={"white"}
                        w="full"
                        // _hover={{
                        //     bg: "blue.500",
                        // }}
                        onClick={() => {
                            if (
                                inputs.oldPassword &&
                                inputs.newPassword &&
                                inputs.confirmNewPassword
                            ) {
                                if (!isPasswordValid()) {
                                    return;
                                }

                                handlePasswordChange();
                            } else if (
                                inputs.oldPassword ||
                                inputs.newPassword ||
                                inputs.confirmNewPassword
                            ) {
                                showToast(
                                    "Error",
                                    "Please fill in all fields",
                                    "error"
                                );
                                return;
                            }

                            handleEditProfile();
                        }}
                        isLoading={isUpdating}
                        isDisabled={isUpdating}
                    >
                        Submit
                    </Button>
                </Stack>
            </Stack>
        </Flex>
    );
}
