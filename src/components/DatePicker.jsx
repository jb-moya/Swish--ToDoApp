import ReactDatePicker from "react-datepicker";
import { useColorMode, Box } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import "../date-picker.css";

const DatePicker = ({
    selectedDate,
    onChange,
    isClearable = false,
    showPopperArrow = true,
    setCalendarIsOpen,
    ...props
}) => {
    const isLight = useColorMode().colorMode === "light"; //you can check what theme you are using right now however you want

    return (
        <Box
            className={isLight ? "light-theme" : "dark-theme"}
        >
            <ReactDatePicker
                minDate={new Date()}
                selected={selectedDate}
                onChange={onChange}
                todayButton="Today"
                isClearable={isClearable}
                onClickOutside={() => setCalendarIsOpen(false)}
                // disabledKeyboardNavigation
                dateFormat="MMM d, yyyy h:mm aa"
                showPopperArrow={showPopperArrow}
                className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
                {...props}
            />
        </Box>
    );
};

export default DatePicker;
