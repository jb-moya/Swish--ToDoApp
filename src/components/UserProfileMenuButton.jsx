import {
    Button,
    // Menu,
    // MenuButton,
    // MenuList,
    // MenuItem,
    Box,
    Group,
    useDisclosure,
} from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import useAuthStore from "../store/authStore";
import { MdPerson } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import EditProfile from "./AuthForm/Profile/EditProfile";
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
} from "./ui/dialog";
import { useShallow } from "zustand/shallow";

const UserProfileMenuButton = ({...mainContainerProps}) => {
    const user = useAuthStore((state) => state.user);
    const { isGuest } = useAuthStore(useShallow((state) => ({
        authUser: state.user,
        isGuest: state.isGuest,
    })));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleLogout, isLoggingOut } = useLogout();
    const navigate = useNavigate();

    return (
        <Box {...mainContainerProps}>
            <EditProfile isOpen={isOpen} onClose={onClose} />

            {!isGuest ? (
                <DialogRoot>
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
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
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
                </DialogRoot>
            ) : (
                // <Menu>
                //     <MenuButton
                //         as={Button}
                //         variant={"ghost"}
                //         leftIcon={
                //             user?.profilePicURL ? (
                //                 <Avatar
                //                     mr={2}
                //                     size={"sm"}
                //                     name={user?.username}
                //                     src={user?.profilePicURL}
                //                 />
                //             ) : (
                //                 <MdPerson size={"24"} />
                //             )
                //         }
                //     >
                //         {user?.username}
                //         <IoChevronDown ml={1} />
                //     </MenuButton>
                //     <MenuList>
                //         <MenuItem as={Button} onClick={onOpen}>
                //             Edit Profile
                //         </MenuItem>
                //         <MenuItem
                //             as={Button}
                //             onClick={handleLogout}
                //             isDisabled={isLoggingOut}
                //             color={"red.500"}
                //         >
                //             Logout
                //         </MenuItem>
                //     </MenuList>
                // </Menu>
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
