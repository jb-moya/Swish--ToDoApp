import React from "react";
import { Avatar, Flex, Box, Button } from "@chakra-ui/react";
import { PiSidebarSimpleThin } from "react-icons/pi";

const Sidebar = () => {
    return (
        <Box
            height={"100vh"}
            borderRight={"1px solid"}
            borderColor={"whiteAlpha.300"}
            py={2}
            position={"sticky"}
            top={0}
            left={0}
            px={{ base: 2, md: 4 }}
        >
            <Flex p="1" alignItems={"center"} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Avatar
                        size="sm"
                        name="Dan Abrahmov"
                        src="https://bit.ly/dan-abramov"
                    />
                    <Box ml={3}>username</Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Sidebar;
