import { useCallback } from "react";

export const useDateFormat = () => {
    return useCallback((date) => {
        if (!date) {
            return "Unscheduled";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const daysOfWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        if (diffDays === 0) {
            return "Today";
        } else if (diffDays === 1) {
            return "Tomorrow";
        } else if (diffDays === -1) {
            return "Yesterday";
        } else if (diffDays < 7 && diffDays > 1) {
            return daysOfWeek[targetDate.getDay()];
        } else if (diffDays > -7 && diffDays < -1) {
            return `Last ${daysOfWeek[targetDate.getDay()]}`;
        } else {
            const options = { month: "long", day: "numeric" };
            if (targetDate.getFullYear() !== today.getFullYear()) {
                options.year = "numeric";
            }
            return targetDate.toLocaleDateString("en-US", options);
        }
    }, []);
};

export const formatTime = (date) => {
    if (!date) {
        return "no time";
    }

    const formatedDate = new Date(date);

    let hours = formatedDate.getHours();
    const minutes = formatedDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
};

export const isToday = (date) => {
    const today = new Date();

    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

export const getDayOfWeek = (date) => {
    const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return daysOfWeek[new Date(date).getDay()];
};

export const isDateOverDue = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
};

const convertFirestoreTimestampToDate = (timestamp) => {
    if (!timestamp) return null;

    const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date;
};

export { convertFirestoreTimestampToDate };
export default useDateFormat;
