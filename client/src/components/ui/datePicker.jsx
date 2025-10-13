import React, { useMemo, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
function DatePicker(setDueDate) {
  const [selectDate, setSelectDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day');

  const pickerRef = useRef(null);

  const formatedDate = useMemo(() => {
    if (!selectDate) return '';
    return selectDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numaric',
    });
  });
  const handleClearDate = (e) => {
    e.stopPropagation();
    setSelectDate(null);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className="date-picker">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={selectDate ? 'selceted-date btn' : 'icon btn'}
        id="task-btn"
        type="button"
      >
        {selectDate ? (
          <span>{formatedDate}</span>
        ) : (
          <Calendar className="task-property-icon" />
        )}
      </button>
      {selectDate && (
        <button onClick={handleClearDate}>
          <X className="h-3 w-3" color={black} />
        </button>
      )}
    </div>
  );
}

export default DatePicker;
