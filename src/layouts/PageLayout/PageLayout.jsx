import { Flex, Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
    return (
        <Flex h={"100vh"}>
            <Box    
                flex={1}
                w={{ base: "calc(100% - 70px)", md: "calc(100% - 240px)" }}
                mx={"auto"}
            >
                {children}
            </Box>
        </Flex>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageLayout;
