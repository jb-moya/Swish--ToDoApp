import ReactDatePicker from "react-datepicker";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import setSeconds from "date-fns/setSeconds";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import "../date-picker.css";
import { isToday } from "./utils/dateFormat";

const TimePicker = ({ selectedDate, selectedTime, onChange }) => {
    useEffect(() => {
        console.log("picked time", selectedTime);
    }, [selectedTime]);

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
