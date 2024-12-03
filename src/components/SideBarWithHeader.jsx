"use client";
import React, { useState } from "react";
import { IconButton, Box, Flex, Icon, Text } from "@chakra-ui/react";
import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerActionTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
} from "./../components/ui/drawer";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {
    MenuContent,
    MenuItem,
    MenuItemCommand,
    MenuRoot,
    MenuTrigger,
} from "./ui/menu";
import { Button } from "./ui/button";
import { FiMenu } from "react-icons/fi";
import UserProfileMenuButton from "./UserProfileMenuButton";
import ThemeToggler from "./ThemeToggler";
import filterSchedule from "../constants/filterSchedule";
import useFilterScheduleStore from "../store/filterScheduleStore";
import { useColorModeValue } from "./ui/color-mode";
import { CloseButton } from "./ui/close-button";

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

    return (
        <Box>
            {/* <DialogRoot trapFocus={false} size="full">
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
                        <MenuRoot>
                            <MenuTrigger asChild>
                                <Button variant="outline">Edit</Button>
                            </MenuTrigger>
                            <MenuContent zIndex={"max"}>
                                <MenuItem value="cut" valueText="cut">
                                    <Box flex="1">Cut</Box>
                                    <MenuItemCommand>⌘X</MenuItemCommand>
                                </MenuItem>
                                <MenuItem value="copy" valueText="copy">
                                    <Box flex="1">Copy</Box>
                                    <MenuItemCommand>⌘C</MenuItemCommand>
                                </MenuItem>
                                <MenuItem value="paste" valueText="paste">
                                    <Box flex="1">Paste</Box>
                                    <MenuItemCommand>⌘V</MenuItemCommand>
                                </MenuItem>
                            </MenuContent>
                        </MenuRoot>
                    </DialogBody>
                    <DialogCloseTrigger />
                </DialogContent>
            </DialogRoot> */}
            <DrawerRoot
                trapFocus={false}
                placement="start"
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
            >
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        variant="outline"
                        aria-label="open menu"
                    >
                        <FiMenu />
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
                                        onClose();
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
