import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';

/**
 * Custom Minimal Date Picker Component (Icon-Only Trigger)
 * Now includes quick Year and Month navigation.
 */
const IconDatePicker = () => {
  // State for the currently selected date (null initially)
  const [selectedDate, setSelectedDate] = useState(null);
  // State to control which month/year is currently displayed in the calendar
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  // State to control the visibility of the calendar dropdown
  const [isOpen, setIsOpen] = useState(false);
  // State to control the view: 'day' (default calendar) or 'month' (12-month grid)
  const [viewMode, setViewMode] = useState('day');

  // Ref for the main container to handle outside clicks
  const pickerRef = useRef(null);

  // Array of month names for the month selection grid
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // --- Utility and Memoized Functions ---

  // Format the selected date for display
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return '';
    // Format: "Oct 13"
    return selectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, [selectedDate]);

  // Determine the display title (Month Year) for the calendar header
  const viewTitle = useMemo(() => {
    return currentViewDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }, [currentViewDate]);

  // Generates the array of day objects for the current month view
  const generateCalendar = useCallback(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];

    // Add padding days from the previous month
    let paddingDays = (startingDayOfWeek + 6) % 7;
    const lastDayOfPrevMonth = new Date(year, month, 0).getDate();
    for (let i = 0; i < paddingDays; i++) {
      calendarDays.push({
        date: lastDayOfPrevMonth - paddingDays + i + 1,
        isCurrentMonth: false,
        fullDate: null,
      });
    }

    // Add days for the current month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      const dayDate = new Date(year, month, i);
      calendarDays.push({
        date: i,
        isCurrentMonth: true,
        fullDate: dayDate,
        isToday: dayDate.toDateString() === new Date().toDateString(),
        isSelected:
          selectedDate &&
          dayDate.toDateString() === selectedDate.toDateString(),
      });
    }

    // Add padding days from the next month
    const totalSlots = 42;
    const remainingDays = totalSlots - calendarDays.length;

    for (let i = 1; i <= remainingDays; i++) {
      calendarDays.push({
        date: i,
        isCurrentMonth: false,
        fullDate: null,
      });
    }

    const finalLength =
      calendarDays.length > 35 &&
      calendarDays.slice(35).every((d) => !d.isCurrentMonth)
        ? 35
        : 42;

    return calendarDays.slice(0, finalLength);
  }, [currentViewDate, selectedDate]);

  // --- Event Handlers ---

  const handleDateSelect = (day) => {
    if (day.isCurrentMonth) {
      setSelectedDate(day.fullDate);
      setIsOpen(false); // Close the picker after selection
    }
  };

  // Handler for month navigation (only used in 'day' view)
  const navigateMonth = (amount) => {
    setCurrentViewDate((prevDate) => {
      const newDate = new Date(prevDate.getTime());
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  // Handler for year navigation (used in both 'day' and 'month' view headers)
  const navigateYear = (amount) => {
    setCurrentViewDate((prevDate) => {
      const newDate = new Date(prevDate.getTime());
      newDate.setFullYear(newDate.getFullYear() + amount);
      return newDate;
    });
  };

  // Handler for selecting a month from the 'month' view
  const handleMonthSelect = (monthIndex) => {
    setCurrentViewDate((prevDate) => {
      const newDate = new Date(prevDate.getTime());
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setViewMode('day'); // Switch back to day selection
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    setIsOpen(false);
  };

  // Effect to handle clicking outside the date picker to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset view mode when closing
        if (viewMode !== 'day') setViewMode('day');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef, viewMode]);

  const daysInMonth = generateCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // --- Calendar View Render Functions ---

  const renderMonthView = () => {
    const currentMonth = currentViewDate.getMonth();
    return (
      <div className="grid grid-cols-4 gap-2 mt-2">
        {monthNames.map((name, index) => (
          <button
            key={name}
            onClick={() => handleMonthSelect(index)}
            className={`
              p-2 text-sm font-medium rounded-lg transition duration-150 
              ${
                index === currentMonth
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-800 hover:bg-gray-100'
              }
            `}
          >
            {name}
          </button>
        ))}
      </div>
    );
  };

  const renderDayView = () => (
    <>
      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs sm:text-sm"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day, index) => {
          const baseClasses =
            'h-9 w-full flex items-center justify-center rounded-full text-sm font-medium transition duration-150';

          let dayClasses = '';
          if (!day.isCurrentMonth) {
            dayClasses = 'text-gray-400 cursor-default';
          } else if (day.isSelected) {
            dayClasses =
              'bg-indigo-600 text-white shadow-lg shadow-indigo-300/50 cursor-pointer ring-2 ring-indigo-500/50';
          } else if (day.isToday) {
            dayClasses =
              'bg-indigo-100 text-indigo-700 font-bold cursor-pointer hover:bg-indigo-200 border border-indigo-300';
          } else {
            dayClasses = 'text-gray-800 cursor-pointer hover:bg-gray-100';
          }

          return (
            <div key={index} className="flex items-center justify-center">
              <button
                onClick={() => handleDateSelect(day)}
                disabled={!day.isCurrentMonth}
                className={`${baseClasses} ${dayClasses}`}
                aria-label={`Select ${
                  day.fullDate ? day.fullDate.toDateString() : day.date
                }`}
              >
                {day.date}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div
      ref={pickerRef}
      className="relative w-full max-w-sm mx-auto my-12 font-inter"
    >
      {/* --- Date Picker Trigger Button --- */}
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            p-2 sm:p-3 transition duration-200 ease-in-out 
            rounded-full shadow-lg border-2 
            flex items-center justify-center min-w-[3.5rem]
            focus:outline-none focus:ring-4
            ${
              selectedDate
                ? 'bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600 focus:ring-indigo-300'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 focus:ring-gray-300'
            }
          `}
          aria-label={
            selectedDate
              ? `Selected date: ${formattedSelectedDate}`
              : 'Open date picker'
          }
        >
          {selectedDate ? (
            <span className="text-sm font-semibold px-1 min-w-[2.5rem]">
              {formattedSelectedDate}
            </span>
          ) : (
            <CalendarIcon className="h-6 w-6" />
          )}
        </button>

        {/* --- Small Cross (X) Button --- */}
        {selectedDate && (
          <button
            onClick={handleClearDate}
            className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 
                       bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold 
                       shadow-md border-2 border-white hover:bg-red-600 transition z-20"
            aria-label="Clear selected date"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* --- Calendar Dropdown --- */}
      {isOpen && (
        <div
          className="absolute z-30 mt-3 left-1/2 transform -translate-x-1/2 min-w-[18rem] bg-white border border-gray-300 
                     rounded-xl shadow-2xl p-4 transition-all duration-200 ease-out origin-top sm:min-w-[20rem]"
        >
          {/* Calendar Header (Navigation) */}
          <div className="flex justify-between items-center mb-4 border-b pb-3">
            {/* Year Back Button */}
            <button
              onClick={() => navigateYear(-1)}
              className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition duration-150"
              aria-label="Previous Year"
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </button>

            {/* Month/Year Navigation */}
            <div className="flex items-center space-x-2">
              {viewMode === 'day' && (
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-150"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={() =>
                  setViewMode(viewMode === 'day' ? 'month' : 'day')
                }
                className="text-lg font-semibold text-indigo-700 p-1 rounded-md hover:bg-indigo-50 transition duration-150"
              >
                {viewTitle}
              </button>

              {viewMode === 'day' && (
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-150"
                  aria-label="Next Month"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Year Forward Button */}
            <button
              onClick={() => navigateYear(1)}
              className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition duration-150"
              aria-label="Next Year"
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </button>
          </div>

          {/* Render View based on state */}
          {viewMode === 'day' ? renderDayView() : renderMonthView()}
        </div>
      )}
    </div>
  );
};

export default IconDatePicker;
