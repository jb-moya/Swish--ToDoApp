import {
    AiOutlineClockCircle,
    AiOutlineExclamation,
    AiOutlineAppstore,
    AiOutlineCalendar,
    AiOutlineArrowRight,
} from "react-icons/ai";

const filterSchedule = [
    {
        name: "Unscheduled",
        value: "unscheduled",
        icon: AiOutlineClockCircle,
    },
    {
        name: "Overdue",
        value: "overdue",
        icon: AiOutlineExclamation,
    },
    {
        name: "All",
        value: "all",
        icon: AiOutlineAppstore,
    },
    {
        name: "Today",
        value: "today",
        icon: AiOutlineCalendar,
    },
    {
        name: "Tomorrow",
        value: "tomorrow",
        icon: AiOutlineArrowRight,
    },
    {
        name: "Upcoming",
        value: "upcoming",
        icon: AiOutlineClockCircle,
    },
];

export default filterSchedule;
