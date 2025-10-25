import { Calendar } from 'lucide-react';

const date = new Date().getDate();
const currentDay = date.toString().padStart(2, '0');

const DynamicCalendarIcon = () => {
  return (
    <div className="dynamicCalendarIcon">
      <Calendar className="sidebarImage" strokeWidth="1.6" />
      <span>{currentDay}</span>
    </div>
  );
};

export default DynamicCalendarIcon;
