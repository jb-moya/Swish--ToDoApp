"use client";

import { useEffect, useRef, useState } from "react";
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
    Text,
    Image,
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
import { HiUpload } from "react-icons/hi";

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

    const authUser = useAuthStore(useShallow((state) => state.user));

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
        <DialogRoot
            lazyMount
            placement="center"
            open={isOpen}
            onOpenChange={() => {
                resetInput();
                onClose();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Stack>
                        <Stack
                            gap="10"
                            direction={["column", "row"]}
                            justify={"center"}
                        >
                            <Center position="relative">
                                <Image
                                    src={selectedFile || authUser.profilePicURL}
                                    boxSize="120px"
                                    borderRadius="full"
                                    fit="cover"
                                    border={"2px solid white "}
                                    alt="your profile picture"
                                />

                                {selectedFile && (
                                    <Float
                                        placement="top-end"
                                        offsetX="2"
                                        offsetY="2"
                                    >
                                        <Circle
                                            bg="red.400"
                                            size="40px"
                                            outline="0.2em solid"
                                            outlineColor="bg"
                                            cursor={"pointer"}
                                            onClick={() =>
                                                setSelectedFile(null)
                                            }
                                        >
                                            <IoMdRemoveCircle size={40} />
                                        </Circle>
                                    </Float>
                                )}
                            </Center>
                            <Center>
                                <Button
                                    variant="outline"
                                    onClick={() => fileRef.current.click()}
                                >
                                    <HiUpload />
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
                            required
                            variant="floating"
                        >
                            <Input
                                size={"sm"}
                                placeholder="me@example.com"
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
                        </Field>

                        {userSignInProvider === defaultSignInProvider && (
                            <>
                                <Field
                                    id="email"
                                    required
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
                                        disabled
                                        readOnly
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
                            disabled={
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
                    </DialogActionTrigger>
                    <Button
                        onClick={handleSubmit}
                        loading={
                            isProfileUpdating ||
                            isPasswordUpdating ||
                            isSubmitting
                        }
                        disabled={
                            isProfileUpdating ||
                            isPasswordUpdating ||
                            isSubmitting
                        }
                        loadingText="Updating..."
                    >
                        <Text textStyle="xs">
                            Submit{" "}
                            {inputs.username ? "(will update name)" : null}
                        </Text>
                    </Button>
                </DialogFooter>
                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    );
}
