import { Flex, Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Sidebar from "../../components/Sidebar/Sidebar";

const PageLayout = ({ children }) => {
    const { pathname } = useLocation();
    return (
        <Flex h={"100vh"}>
            {/* {pathname !== "/auth" ? (
                <Box w={"240px"}>
                    <Sidebar />
                </Box>
            ) : null} */}

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
