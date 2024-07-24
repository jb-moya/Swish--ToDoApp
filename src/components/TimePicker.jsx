import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../date-picker.css";

const TimePicker = ({ selectedTime, onChange }) => {

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    return (
        <ReactDatePicker
            selected={new Date(selectedTime)}
            onChange={onChange}
            filterTime={filterPassedTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
        />
    );
};

export default TimePicker;