function dateFormat(date) {
    const today = new Date();
    const targetDate = new Date(date);

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
        return "today";
    } else if (diffDays === 1) {
        return "tomorrow";
    } else if (diffDays < 7) {
        return daysOfWeek[targetDate.getDay()];
    } else {
        const options = { month: "long", day: "numeric" };
        if (targetDate.getFullYear() !== today.getFullYear()) {
            options.year = "numeric";
        }
        return targetDate.toLocaleDateString("en-US", options);
    }
}

const convertFirestoreTimestampToDate = (timestamp) => {
    if (!timestamp) return null;

    const milliseconds =
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date;
};

export { convertFirestoreTimestampToDate };
export default dateFormat;
