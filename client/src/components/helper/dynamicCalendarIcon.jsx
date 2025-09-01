import calendarDate from "../../assets/images/svg/calendar-date.svg"

const date = new Date().getDate();
const currentDay = date.toString().padStart(2, "0");

const DynamicCalendarIcon = () => {
  return (
  <div className="dynamicCalendarIcon">
    <img src={calendarDate} alt="" className="sidebarImage"/>
    <span>{currentDay}</span>
  </div>
  );
};

export default DynamicCalendarIcon;