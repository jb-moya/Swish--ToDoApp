import React from "react";
import { Box, Flex, Link, Button, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import PropTypes from "prop-types";

const Navbar = ({ menus }) => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box
            // display={{ base: "none", sm: "block" }}
            width="30rem"
            mx="auto"
            // color="customContent2.85"
            position="fixed"
            top="2"
            zIndex="50"
            px="2"
            transition="all 0.5s ease-in-out"
        >
            <Flex spaceX="4" align="center">
                {Object.entries(menus).map(([key, menu]) => (
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
                ))}
                <Button onClick={toggleColorMode}>
                    {colorMode === "light" ? (
                        <MdDarkMode />
                    ) : (
                        <MdOutlineLightMode />
                    )}
                </Button>
            </Flex>
        </Box>
    );
};

Navbar.propTypes = {
    menus: PropTypes.object.isRequired,
};

export default Navbar;
