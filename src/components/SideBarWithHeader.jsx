"use client";

import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import UserProfileMenuButton from "./UserProfileMenuButton";
import ThemeToggler from "./ThemeToggler";
import filterSchedule from "../constants/filterSchedule";
import useFilterScheduleStore from "../store/filterScheduleStore";

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

const NavItem = ({ icon, children, ...rest }) => {
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
                        fontSize="16"
                        _groupHover={{
                            color: "white",
                        }}
                        as={icon}
                    />
                )}
                {children}
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

const SidebarWithHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNav onOpen={onOpen} />
        </Box>
    );
};

export default SidebarWithHeader;
