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
}) => {
    const isLight = useColorMode().colorMode === "light";

    return (
        <Box className={isLight ? "light-theme" : "dark-theme"}>
            <ReactDatePicker
                minDate={new Date()}
                selected={selectedDate}
                onChange={onChange}
                isClearable={isClearable}
                onClickOutside={() => setCalendarIsOpen(false)}
                dateFormat="MMM d, yyyy h:mm aa"
                showPopperArrow={showPopperArrow}
                className="react-datapicker__input-text"
                inline
            />
        </Box>
    );
};

export default DatePicker;
