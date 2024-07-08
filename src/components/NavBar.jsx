import {
    Box,
    Flex,
    Link,
    Button,
    useColorMode,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    HStack,
} from "@chakra-ui/react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import PropTypes from "prop-types";
import useLogout from "../hooks/useLogout";
import { SearchIcon, ChevronDownIcon } from "@chakra-ui/icons";

const menus = {
    home: {
        name: "Home",
        href: "/home",
    },
    auth: {
        name: "Auth",
        href: "/auth",
    },
};

const Navbar = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const { handleLogout, isLoggingOut, error } = useLogout();
    return (
        <Flex align="center" justify="center">
            <Flex
                width="fit-content"
                mx="auto"
                position="fixed"
                top="2"
                zIndex="50"
                px="2"
                transition="all 0.5s ease-in-out"
            >
                {/* <Flex spaceX="4" align="center"> */}
                {/* {Object.entries(menus).map(([key, menu]) => (
                        <Link
                            key={key}
                            href={menu.href}
                            flex="1"
                            // w="full"
                            justifyContent="center"
                            textAlign="center"
                            _hover={{
                                transform: "scale(1.05)",
                                color: "customContent1",
                            }}
                        >
                            <span>{menu.name}</span>
                        </Link>
                    ))} */}
                <InputGroup width={"300px"}>
                    <InputLeftElement pointerEvents="none">
                        <SearchIcon opacity={0.4} />
                    </InputLeftElement>
                    <Input type="tel" placeholder="Search" />
                </InputGroup>

                <Menu>
                    <MenuButton
                        as={Button}
                        variant={"ghost"}
                        leftIcon={
                            <Box display={"flex"} alignItems={"center"}>
                                <Avatar
                                    size="sm"
                                    name="Dan Abrahmov"
                                    src="https://bit.ly/dan-abramov"
                                />
                            </Box>
                        }
                    >
                        username
                        <ChevronDownIcon ml={1}/>
                    </MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
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

Navbar.propTypes = {
    menus: PropTypes.object.isRequired,
};

export default Navbar;
