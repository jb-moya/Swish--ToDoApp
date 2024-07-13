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

        const diffTime = Math.abs(targetDate - today);
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
        } else if (diffDays < 7) {
            return daysOfWeek[targetDate.getDay()];
        } else {
            const options = { month: "long", day: "numeric" };
            if (targetDate.getFullYear() !== today.getFullYear()) {
                options.year = "numeric";
            }
            return targetDate.toLocaleDateString("en-US", options);
        }
    }, []);
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
