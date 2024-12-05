import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import useAuthStore from "../store/authStore";
import { MdPerson } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import EditProfile from "./AuthForm/Profile/EditProfile";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";
import { useShallow } from "zustand/shallow";

const UserProfileMenuButton = ({ ...mainContainerProps }) => {
    const user = useAuthStore((state) => state.user);
    const { isGuest } = useAuthStore(
        useShallow((state) => ({
            authUser: state.user,
            isGuest: state.isGuest,
        }))
    );
    const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] =
        useState(false);
    const { handleLogout, isLoggingOut } = useLogout();
    const navigate = useNavigate();

    return (
        <Box {...mainContainerProps}>
            <EditProfile
                isOpen={isEditProfileDialogOpen}
                onClose={() =>
                    setIsEditProfileDialogOpen(!isEditProfileDialogOpen)
                }
            />

            {!isGuest ? (
                <MenuRoot>
                    <MenuTrigger asChild>
                        <Button height={10} variant={"ghost"}>
                            {user?.profilePicURL ? (
                                <Avatar
                                    mr={2}
                                    size={"sm"}
                                    name={user?.username}
                                    src={user?.profilePicURL}
                                    border={"1px solid white "}
                                />
                            ) : (
                                <MdPerson size={"24"} />
                            )}

                            {user?.username}
                            <IoChevronDown ml={1} />
                        </Button>
                    </MenuTrigger>
                    <MenuContent zIndex={"max"}>
                        <MenuItem
                            value="edit"
                            onClick={() => setIsEditProfileDialogOpen(true)}
                        >
                            Edit Profile
                        </MenuItem>
                        <MenuItem
                            value="logout"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            color={"red.500"}
                        >
                            Logout
                        </MenuItem>
                    </MenuContent>
                </MenuRoot>
            ) : (
                <Button
                    mr={3}
                    onClick={() => {
                        navigate("/auth");
                    }}
                >
                    Login
                </Button>
            )}
        </Box>
    );
};

export default UserProfileMenuButton;
