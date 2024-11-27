import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../date-picker.css";

const TimePicker = ({ selectedDate, selectedTime, onChange }) => {
    const date = new Date(selectedDate);
    date.setHours(0, 0, 0, 0);

    const filterPassedTime = (timePoint) => {
        const currentTime = new Date().getTime();
        return currentTime < new Date(timePoint).getTime();
    };

    return (
        <ReactDatePicker
            selected={new Date(selectedTime)}
            onChange={onChange}
            filterTime={date <= new Date() && filterPassedTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
        />
    );
};

export default TimePicker;