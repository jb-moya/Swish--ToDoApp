// import { useToast } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import { useCallback } from "react";

const useShowToast = () => {

    // const showToast = useCallback(
    //     (title, description, status) => {
    //         toaster.create({
    //             title: title,
    //             description: description,
    //             type: status,
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     },
    //     [toaster]
    // );

    const showToast = (title, description, status) => {
        toaster.create({
            title: title,
            description: description,
            type: status,
            duration: 3000,
            isClosable: true,
        });
    };

    return showToast;
};

export default useShowToast;
