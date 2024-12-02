"use client";
import React, { useState } from "react";
import {
    IconButton,
    Box,
    Flex,
    // CloseButton,
    Icon,
    useDisclosure,
    Text,
} from "@chakra-ui/react";
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
import { Button } from "./ui/button";
import { FiMenu } from "react-icons/fi";
import UserProfileMenuButton from "./UserProfileMenuButton";
import ThemeToggler from "./ThemeToggler";
import filterSchedule from "../constants/filterSchedule";
import useFilterScheduleStore from "../store/filterScheduleStore";
import { useColorModeValue } from "./ui/color-mode";
import { CloseButton } from "./ui/close-button";

const SidebarContent = ({ onClose, ...rest }) => {
    const { setFilter } = useFilterScheduleStore();

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue("white", "gray.900")}
            w={{ base: "full" }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex
                h="20"
                alignItems="center"
                mx="4"
                justifyContent="space-between"
            >
                <Flex>
                    <UserProfileMenuButton />
                    <ThemeToggler />
                </Flex>
                <CloseButton display={{ base: "flex" }} onClick={onClose} />
            </Flex>
            {filterSchedule.map((filterType) => (
                <NavItem
                    key={filterType.name}
                    icon={filterType.icon}
                    onClick={() => {
                        const { icon, ...filterWithoutIcon } = filterType; // Destructure and omit `icon`
                        setFilter(filterWithoutIcon);
                        onClose();
                    }}
                >
                    {filterType.name}
                </NavItem>
            ))}
        </Box>
    );
};

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

const MobileNav = ({ onOpen, ...rest }) => {
    return (
        <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
        />
    );
};

const Test = () => {
    return <Box>ffff</Box>;
};

const SidebarWithHeader = () => {
    // const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <DrawerRoot
                placement="start"
                open={open}
                onOpenChange={(e) => setOpen(e.open)}
            >
                <DrawerBackdrop />
                <DrawerTrigger asChild>
                    {/* <MobileNav onOpen={() => setOpen(true)} /> */}
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        // onClick={onOpen}
                        variant="outline"
                        aria-label="open menu"
                        icon={<FiMenu />}
                    />
                    {/* <Button variant="outline" size="sm">
                        Open Drawer
                    </Button> */}
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        {/* <DrawerTitle>Drawer Title</DrawerTitle> */}
                        <DrawerTitle>
                            <Flex
                                h="20"
                                alignItems="center"
                                mx="4"
                                justifyContent="space-between"
                            >
                                <Flex>
                                    <UserProfileMenuButton />
                                    <ThemeToggler />
                                </Flex>
                                <CloseButton
                                    display={{ base: "flex" }}
                                    onClick={() => setOpen(false)}
                                />
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
                                            filterType; // Destructure and omit `icon`
                                        setFilter(filterWithoutIcon);
                                        onClose();
                                    }}
                                />
                            );
                        })}
                    </DrawerBody>
                    <DrawerFooter />

                    <DrawerFooter>
                        <DrawerActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerActionTrigger>
                        <Button>Save</Button>
                    </DrawerFooter>
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerRoot>

            {/* <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer> */}
        </Box>
    );
};

export default SidebarWithHeader;
