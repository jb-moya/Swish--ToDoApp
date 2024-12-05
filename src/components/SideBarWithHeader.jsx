"use client";
import React, { useState } from "react";
import { IconButton, Box, Flex, Icon, Text } from "@chakra-ui/react";
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "./../components/ui/drawer";
import { FiSidebar } from "react-icons/fi";

import UserProfileMenuButton from "./UserProfileMenuButton";
import ThemeToggler from "./ThemeToggler";
import filterSchedule from "../constants/filterSchedule";
import useFilterScheduleStore from "../store/filterScheduleStore";

const NavItem = ({ icon, content, ...rest }) => {
    return (
        <Box
            as="a"
            href="#"
            style={{ textDecoration: "none" }}
            _focus={{ boxShadow: "none" }}
        >
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "cyan.400",
                    color: "white",
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="20px"
                        _groupHover={{
                            color: "white",
                        }}
                    >
                        {icon}
                    </Icon>
                )}
                <Text>{content}</Text>
            </Flex>
        </Box>
    );
};

const SidebarWithHeader = () => {
    const [open, setOpen] = useState(false);
    const { setFilter } = useFilterScheduleStore();

    return (
        <Box>
            <DrawerRoot
                trapFocus={false}
                placement="start"
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
            >
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <IconButton
                        size="xs"
                        display={{ base: "flex", md: "none" }}
                        variant="outline"
                        aria-label="open menu"
                    >
                        <FiSidebar />
                    </IconButton>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            <Flex
                                h="20"
                                alignItems="center"
                                mx="4"
                                justifyContent="space-between"
                            >
                                <Flex zindex={"max"}>
                                    <UserProfileMenuButton />
                                    <ThemeToggler />
                                </Flex>
                            </Flex>
                        </DrawerTitle>
                    </DrawerHeader>
                    <DrawerTrigger />
                    <DrawerBody>
                        {filterSchedule.map((filterType) => {
                            return (
                                <NavItem
                                    key={filterType.name}
                                    icon={<filterType.icon />}
                                    content={filterType.name}
                                    onClick={() => {
                                        const { icon, ...filterWithoutIcon } =
                                            filterType;
                                        setFilter(filterWithoutIcon);
                                        setOpen(false);
                                    }}
                                />
                            );
                        })}
                    </DrawerBody>
                    <DrawerFooter />

                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>
        </Box>
    );
};

export default SidebarWithHeader;
