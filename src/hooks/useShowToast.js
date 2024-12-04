import { toaster } from "../components/ui/toaster";

const useShowToast = () => {
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
