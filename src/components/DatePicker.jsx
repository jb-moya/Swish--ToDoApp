import ReactDatePicker from "react-datepicker";
import { useColorMode } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import "../date-picker.css";

const DatePicker = ({
    selectedDate,
    onChange,
    isClearable = false,
    showPopperArrow = true,
    ...props
}) => {
    const isLight = useColorMode().colorMode === "light"; //you can check what theme you are using right now however you want
    return (
        // if you don't want to use chakra's colors or you just wwant to use the original ones,
        // set className to "light-theme-original" ↓↓↓↓
        <div className={isLight ? "light-theme" : "dark-theme"}>
            <ReactDatePicker
                minDate={new Date()}
                selected={selectedDate}
                onChange={onChange}
                todayButton="Today"
                isClearable={isClearable}
                disabledKeyboardNavigation
                dateFormat="MMM d, yyyy h:mm aa"
                showPopperArrow={showPopperArrow}
                className="react-datapicker__input-text" //input is white by default and there is no already defined class for it so I created a new one
                {...props}
            />
        </div>
    );
};

export default DatePicker;
