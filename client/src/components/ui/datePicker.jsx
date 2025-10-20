import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Calendar, X, ChevronRight, ChevronLeft } from 'lucide-react';
import '../../assets/css/datePicker.css';
import { createPopper } from '@popperjs/core';

function DatePicker({ setDueDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());

  const pickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const handleClickOutside = (event) => {
        if (pickerRef.current && !pickerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('pointerdown', handleClickOutside);

      return () => {
        document.removeEventListener('pointerdown', handleClickOutside);
      };
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const generateCalendar = useCallback(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const calendarDays = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    let paddingDays = (startingDayOfWeek + 6) % 7;

    let latestDayOfPrevMonth = new Date(year, month, 0).getDate();
    for (let i = 0; i < paddingDays; i++) {
      calendarDays.push({
        date: latestDayOfPrevMonth - paddingDays + i + 1,
        isCurrentMonth: false,
      });
    }

    let latestDayOfMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i < latestDayOfMonth; i++) {
      let dayDate = new Date(year, month, i);
      calendarDays.push({
        date: i,
        isCurrentMonth: true,
        fullDate: dayDate,
      });
    }

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({
        date: calendarDays.length % 7,
        isCurrentMonth: false,
      });
    }

    return calendarDays;
  }, [currentViewDate]);

  const calendarDays = generateCalendar();

  const handleDateClick = (day) => {
    if (!day.isCurrentMonth) return;
    setDueDate(day.fullDate);
    setIsOpen(false);
  };

  const goToPrevMonth = () => {
    setCurrentViewDate(
      new Date(currentViewDate.setMonth(currentViewDate.getMonth() - 1)),
    );
  };

  const goToNextMonth = () => {
    setCurrentViewDate(
      new Date(currentViewDate.setMonth(currentViewDate.getMonth() + 1)),
    );
  };

  const calendarBtnRef = useRef(null);
  const calendarDropdownRef = useRef(null);

  useEffect(() => {
    let calendarPopperInstance = null;
    if (isOpen && calendarBtnRef.current && calendarDropdownRef.current) {
      calendarPopperInstance = createPopper(
        calendarBtnRef.current,
        calendarDropdownRef.current,
        {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              options: { fallbackPlacements: ['top-start', 'right-start'] },
            },
            {
              name: 'preventOverflow',
              options: { padding: 8 },
            },
          ],
        },
      );
    }
    return () => {
      calendarPopperInstance?.destroy();
    };
  }, [isOpen]);

  return (
    <div ref={pickerRef} className="date-picker">
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="task-btn"
        type="button"
        ref={calendarBtnRef}
      >
        <Calendar className="task-property-icon" />
      </button>
      {isOpen && (
        <div
          className="calendar-dropdown"
          onClick={(e) => e.stopPropagation()}
          ref={calendarDropdownRef}
        >
          <div className="calendar-header">
            <button
              onClick={goToPrevMonth}
              className="calendar-navigation-btn"
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {currentViewDate.toLocaleString('default', { month: 'long' })}{' '}
              {currentViewDate.getFullYear()}
            </span>
            <button
              onClick={goToNextMonth}
              className="calendar-navigation-btn"
              type="button"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`day-cell ${day.isSelected ? 'selected' : ''} ${
                  !day.isCurrentMonth ? 'inactive' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
