import {
    Button,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
} from "@chakra-ui/react";
import useAuthStore from "../store/authStore";
import { MdPerson } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import EditProfile from "./AuthForm/Profile/EditProfile";

const UserProfileMenuButton = () => {
    const user = useAuthStore((state) => state.user);
    const { authUser, isGuest } = useAuthStore((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    }));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleLogout, isLoggingOut, error } = useLogout();
    const navigate = useNavigate();

    return (
        <>
            <EditProfile isOpen={isOpen} onClose={onClose} />

            {!isGuest ? (
                <Menu>
                    <MenuButton
                        as={Button}
                        mx={3}
                        variant={"ghost"}
                        leftIcon={
                            user?.profilePicURL ? (
                                <Avatar
                                    mr={2}
                                    size={"sm"}
                                    name={user?.username}
                                    src={user?.profilePicURL}
                                />
                            ) : (
                                <MdPerson size={"24"} />
                            )
                        }
                    >
                        {user?.username}
                        <ChevronDownIcon ml={1} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem as={Button} onClick={onOpen}>
                            Edit Profile
                        </MenuItem>
                        <MenuItem
                            as={Button}
                            onClick={handleLogout}
                            isDisabled={isLoggingOut}
                            color={"red.500"}
                        >
                            Logout
                        </MenuItem>
                    </MenuList>
                </Menu>
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
        </>
    );
};

export default UserProfileMenuButton;
