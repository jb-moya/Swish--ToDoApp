import {
    Flex,
    Button,
    useColorMode,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import EditProfile from "./AuthForm/Profile/EditProfile";
import { MdPerson, MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import useLogout from "../hooks/useLogout";
import useAuthStore from "../store/authStore";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { handleLogout, isLoggingOut, error } = useLogout();
    const user = useAuthStore((state) => state.user);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [authUser] = useAuthStore((state) => [state.user]);
    // const [authUser] = useAuthState(auth);

    return (
        <Flex align="center" justify="center">
            <EditProfile isOpen={isOpen} onClose={onClose} />
            {authUser?.tasks?.length}
            <Flex
                width="fit-content"
                mx="auto"
                position="fixed"
                top="2"
                zIndex="50"
                px="2"
                transition="all 0.5s ease-in-out"
            >
                <InputGroup width={"300px"}>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon opacity={0.4} />
                    </InputLeftElement>
                    <Input type="tel" placeholder="Search" />
                </InputGroup>

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

                <IconButton
                    variant={"ghost"}
                    aria-label="Toggle color mode"
                    icon={
                        colorMode === "light" ? (
                            <MdDarkMode />
                        ) : (
                            <MdOutlineLightMode />
                        )
                    }
                    onClick={toggleColorMode}
                />
            </Flex>
        </Flex>
    );
};

export default Navbar;
