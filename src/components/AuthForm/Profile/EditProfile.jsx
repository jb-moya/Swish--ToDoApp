"use client";

import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../../store/authStore";
import usePreviewImg from "../../../hooks/usePreviewImg";
import useEditProfile from "../../../hooks/useEditProfile";
import useShowToast from "../../../hooks/useShowToast";
import {
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
    Modal,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
} from "@chakra-ui/react";
import { SmallCloseIcon } from "@chakra-ui/icons";
import PasswordInput from "../PasswordInput";
import useUpdateUserPassword from "../../../hooks/useUpdatePassword";
import useReauthenticateWithCredential from "../../../hooks/useReauthenticateWithCredential";
import { getAuth } from "firebase/auth";

export default function EditProfile({ isOpen, onClose }) {
    const [inputs, setInputs] = useState({
        username: "",
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isProfileUpdating, editProfile } = useEditProfile();
    const { updateUserPassword, isPasswordUpdating } = useUpdateUserPassword();
    const showToast = useShowToast();

    const { verifyPassword } = useReauthenticateWithCredential();

    const auth = getAuth();
    const userSignInProvider = auth.currentUser?.providerData[0].providerId;

    const defaultSignInProvider = "password";

    const labelBackground = useColorModeValue("gray.100", "gray.700");

    const handleEditProfile = async () => {
        console.log("editing");

        try {
            console.log("cccccccccc");

            await editProfile(inputs, selectedFile);
            setSelectedFile(null);
            onClose();
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    useEffect(() => {}, [inputs]);

    const isPasswordValid = async () => {
        const resultValidation = await verifyPassword(inputs.oldPassword);
        if (!resultValidation) {
            return false;
        }

        if (inputs.newPassword !== inputs.confirmNewPassword) {
            showToast("Error", "New Passwords do not match", "error");
            return false;
        }

        return true;
    };

    const handlePasswordChange = async () => {
        if (
            !inputs.oldPassword &&
            !inputs.newPassword &&
            !inputs.confirmNewPassword
        ) {
            return;
        }

        if (
            !inputs.oldPassword ||
            !inputs.newPassword ||
            !inputs.confirmNewPassword
        ) {
            showToast("Error", "Please fill in all fields", "error");
            return;
        }

        if (await isPasswordValid()) {
            updateUserPassword(inputs.newPassword);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        await handlePasswordChange();

        if (inputs.username !== "" || selectedFile) {
            handleEditProfile();
        }

        resetInput();
        onClose();
        setIsSubmitting(false);
    };

    const resetInput = () => {
        setInputs({
            username: "",
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            bg={useColorModeValue("gray.50", "gray.800")}
        >
            <ModalOverlay />
            <ModalContent pb={6}>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={5}>
                        <FormControl id="profilePicture" mb={6}>
                            <Stack direction={["column", "row"]} spacing={6}>
                                <Center>
                                    <Avatar
                                        size="xl"
                                        src={
                                            selectedFile ||
                                            authUser.profilePicURL
                                        }
                                        border={"2px solid white "}
                                    >
                                        {selectedFile && (
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
                                                onClick={() =>
                                                    setSelectedFile(null)
                                                }
                                            />
                                        )}
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
                                    accept="image/*"
                                    ref={fileRef}
                                    onChange={handleImageChange}
                                />
                            </Stack>
                        </FormControl>

                        <FormControl
                            id="userName"
                            isRequired
                            variant="floating"
                        >
                            <Input
                                size={"sm"}
                                placeholder=" "
                                _placeholder={{ color: "gray.500" }}
                                type="text"
                                variant="flushed"
                                value={inputs.username || authUser.username}
                                onChange={(e) => {
                                    setInputs({
                                        ...inputs,
                                        username: e.target.value,
                                    });
                                }}
                            />
                            <FormLabel
                                fontWeight={"thin"}
                                size={"sm"}
                                bg={useColorModeValue("#fff", "#2d3748")}
                            >
                                User name
                            </FormLabel>
                        </FormControl>

                        {userSignInProvider === defaultSignInProvider && (
                            <>
                                <FormControl
                                    id="email"
                                    isRequired
                                    variant="floating"
                                >
                                    <Input
                                        size={"sm"}
                                        placeholder=" "
                                        _placeholder={{ color: "gray.500" }}
                                        type="email"
                                        variant="flushed"
                                        value={inputs.email || authUser.email}
                                        disabled
                                        readOnly
                                    />
                                    <FormLabel
                                        fontWeight={"thin"}
                                        size={"sm"}
                                        bg={labelBackground}
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
                                            showOldPassword:
                                                !showPassword.showOldPassword,
                                        })
                                    }
                                    input={inputs.oldPassword}
                                    setInput={(e) =>
                                        setInputs({ ...inputs, oldPassword: e })
                                    }
                                />

                                <PasswordInput
                                    placeholder={"new password"}
                                    showPassword={showPassword.showNewPassword}
                                    setShowPassword={() =>
                                        setShowPassword({
                                            ...showPassword,
                                            showNewPassword:
                                                !showPassword.showNewPassword,
                                        })
                                    }
                                    input={inputs.newPassword}
                                    setInput={(e) =>
                                        setInputs({ ...inputs, newPassword: e })
                                    }
                                />

                                <PasswordInput
                                    placeholder={"confirm new password"}
                                    showPassword={
                                        showPassword.showConfirmNewPassword
                                    }
                                    setShowPassword={() =>
                                        setShowPassword({
                                            ...showPassword,
                                            showConfirmNewPassword:
                                                !showPassword.showConfirmNewPassword,
                                        })
                                    }
                                    input={inputs.confirmNewPassword}
                                    setInput={(e) =>
                                        setInputs({
                                            ...inputs,
                                            confirmNewPassword: e,
                                        })
                                    }
                                />
                            </>
                        )}
                        <Stack
                            spacing={2}
                            direction={["column", "row"]}
                            align={["center", "flex-start"]}
                            justify={["center", "flex-start"]}
                        >
                            <Button
                                bg={"red.400"}
                                color={"white"}
                                w="25%"
                                _hover={{
                                    bg: "red.500",
                                }}
                                isDisabled={
                                    isProfileUpdating ||
                                    isPasswordUpdating ||
                                    isSubmitting
                                }
                                onClick={() => {
                                    resetInput();
                                    onClose();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                w="75%"
                                onClick={handleSubmit}
                                isLoading={
                                    isProfileUpdating ||
                                    isPasswordUpdating ||
                                    isSubmitting
                                }
                                isDisabled={
                                    isProfileUpdating ||
                                    isPasswordUpdating ||
                                    isSubmitting
                                }
                            >
                                <Text mr={2} textStyle="xs">
                                    Submit
                                </Text>
                                <Text textStyle="7xl">
                                    {inputs.username
                                        ? "(will update name)"
                                        : ""}
                                </Text>
                            </Button>
                        </Stack>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
