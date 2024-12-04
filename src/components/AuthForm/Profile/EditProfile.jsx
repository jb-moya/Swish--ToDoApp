"use client";

import { useRef, useState } from "react";
import useAuthStore from "../../../store/authStore";
import usePreviewImg from "../../../hooks/usePreviewImg";
import useEditProfile from "../../../hooks/useEditProfile";
import useShowToast from "../../../hooks/useShowToast";
import {
    Fieldset,
    Heading,
    Input,
    Stack,
    IconButton,
    Center,
    Circle,
    Float,
} from "@chakra-ui/react";
import { Avatar } from "../../ui/avatar";
import { IoMdClose } from "react-icons/io";
import PasswordInput from "../PasswordInput";
import useUpdateUserPassword from "../../../hooks/useUpdatePassword";
import useReauthenticateWithCredential from "../../../hooks/useReauthenticateWithCredential";
import { getAuth } from "firebase/auth";
import { useColorModeValue } from "../../ui/color-mode";
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
} from "../../ui/dialog";
import { useShallow } from "zustand/shallow";
import { Field } from "../../ui/field";
import { IoMdRemoveCircle } from "react-icons/io";
import { Button } from "../../ui/button";

export default function EditProfile({ isOpen, toggler }) {
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

    const authUser = useAuthStore(useShallow((state) => state.user));

    const fileRef = useRef(null);
    const { handleImageChange, selectedFile, setSelectedFile } =
        usePreviewImg();
    const { isProfileUpdating, editProfile } = useEditProfile();
    const { updateUserPassword, isPasswordUpdating } = useUpdateUserPassword();
    const showToast = useShowToast();

    const { verifyPassword } = useReauthenticateWithCredential();

    const auth = getAuth();
    const userSignInProvider = auth.currentUser?.providerData[0].providerId;

    const defaultSignInProvider = "password";

    const labelBackground = useColorModeValue("gray.100", "gray.700");

    const handleEditProfile = async () => {
        try {
            await editProfile(inputs, selectedFile);
            setSelectedFile(null);
            toggler(false);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

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
        updateUserPassword(inputs.newPassword);
    };

    return (
        <DialogRoot
            lazyMount
            placement="center"
            open={isOpen}
            onOpenChange={() => {
                toggler(!isOpen);
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Stack spacing={5}>
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar
                                    size="2xl"
                                    src={selectedFile || authUser.profilePicURL}
                                    border={"2px solid white "}
                                >
                                    {selectedFile && (
                                        <Float
                                            placement="top-end"
                                            offsetX="2"
                                            offsetY="2"
                                        >
                                            <Circle
                                                bg="red.400"
                                                size="20px"
                                                outline="0.2em solid"
                                                outlineColor="bg"
                                                cursor={"pointer"}
                                                onClick={() =>
                                                    setSelectedFile(null)
                                                }
                                            >
                                                <IoMdRemoveCircle size={30} />
                                            </Circle>
                                        </Float>
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
                                ref={fileRef}
                                onChange={handleImageChange}
                            />
                        </Stack>

                        <Field
                            id="userName"
                            label="User name"
                            isRequired
                            variant="floating"
                        >
                            <Input
                                size={"sm"}
                                placeholder="me@example.com"
                                _placeholder={{ color: "gray.500" }}
                                type="text"
                                variant="flushed"
                                value={inputs.username || authUser.username}
                                onChange={(e) =>
                                    setInputs({
                                        ...inputs,
                                        username: e.target.value,
                                    })
                                }
                            />
                        </Field>

                        {userSignInProvider === defaultSignInProvider && (
                            <>
                                <Field
                                    id="email"
                                    isRequired
                                    variant="floating"
                                    label="Email address"
                                >
                                    <Input
                                        size={"sm"}
                                        placeholder=" "
                                        _placeholder={{ color: "gray.500" }}
                                        type="email"
                                        variant="flushed"
                                        value={inputs.email || authUser.email}
                                        onChange={(e) =>
                                            setInputs({
                                                ...inputs,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </Field>

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
                    </Stack>
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button
                            bg={"red.400"}
                            color={"white"}
                            _hover={{
                                bg: "red.500",
                            }}
                            onClick={() => toggler(false)}
                        >
                            Cancel
                        </Button>
                    </DialogActionTrigger>
                    <Button
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
                        loading={isProfileUpdating || isPasswordUpdating}
                        loadingText="Updating..."
                        disabled={isProfileUpdating || isPasswordUpdating}
                    >
                        Submit
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>

        // <Modal
        //     isOpen={isOpen}
        //     onClose={onClose}
        //     isCentered
        //     bg={useColorModeValue("gray.50", "gray.800")}
        // >
        //     <ModalOverlay />
        //     <ModalContent pb={6}>
        //         <ModalHeader>Edit Profile</ModalHeader>
        //         <ModalCloseButton />
        //         <ModalBody>
        //
        //         </ModalBody>
        //         {/* <ModalFooter>
        //             <Button onClick={onClose}>Close</Button>
        //         </ModalFooter> */}
        //     </ModalContent>
        // </Modal>
    );
}
