import { useState, useEffect, useRef, useContext } from 'react';
import DatePicker from '../ui/datePicker';
import PriorityDropdown from '../ui/priorityDropDown';
import LabelDropDown from '../ui/labelDropDown';
import '../../assets/css/colorPicker.css';
import '../../assets/css/popup.css';
import PopperDropdown from '../helper/popperDropdown';

import { Tag, X, Palette, CalendarFold, Pin } from 'lucide-react';

function taskPopup({
  trigger,
  onClose,
  onAddTask,
  onUpdateTask,
  taskDetails,
  action,
}) {
  const isDev = import.meta.env.REACT_APP_ENV === 'development';
  const initialTask = taskDetails || {};

  const dummyText = [
    'Project Plan: Q3 Report',
    'Team Meeting: Agenda Review',
    'Client Follow-up: Acme Corp',
    'Draft Thesis Abstract',
    'Submit Expense Report',
    'Groceries run',
    'Finish blog post draft',
    'Pick up dry cleaning',
    'Brainstorm new app ideas',
  ];
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * dummyText.length);
    return dummyText[randomIndex];
  };

  const [placeholderText] = useState(getRandomPlaceholder());

  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [dueDate, setDueDate] = useState(
    initialTask.dueDate &&
      initialTask.dueDate.trim() &&
      initialTask.dueDate.length > 0
      ? new Date(initialTask.dueDate)
      : '',
  );
  const [priority, setPriority] = useState(initialTask.priority || 4);
  const [labels, setLabels] = useState(initialTask.labels || []);
  const [color, setColor] = useState(initialTask.cardColor || '#ffffff');
  const [isPinned, setIsPinned] = useState(initialTask.isPinned || false);
  const [id, setId] = useState(initialTask._id || null);

  // toggle state
  const [islabelDropDownOpen, setIslabelDropDownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // all reference
  const popupRef = useRef(null);
  //  ref for div adjestment maintain in view port
  const colorPickerBtnRef = useRef(null);
  const colorPickerDropdownRef = useRef(null);
  const labelPickerBtnRef = useRef(null);
  const labelPickerDropdownRef = useRef(null);
  // main div outclick ref
  const colorPickerRef = useRef(null);
  const labelDropDownRef = useRef(null);

  useEffect(() => {
    if (taskDetails) {
      setId(taskDetails._id);
      setTitle(taskDetails.title);
      setDescription(taskDetails.description);
      setDueDate(
        taskDetails.dueDate && taskDetails.dueDate.trim()
          ? new Date(taskDetails.dueDate)
          : '',
      );
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
      setColor(taskDetails.cardColor);
      setIsPinned(taskDetails.isPinned);
      isDev === 'development'
        ? console.log('Task submitted:', {
            title,
            description,
            dueDate,
            labels,
            priority,
            color,
            isPinned,
          })
        : null;
    }
  }, [taskDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      if (action === 'add') {
        onAddTask({
          title,
          description,
          dueDate,
          labels,
          priority,
          color,
          isPinned,
        });
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority(4);
        setLabels([]);
        setColor('#ffffff');
        setIsPinned(false);
      } else {
        onUpdateTask({
          id,
          title,
          description,
          dueDate,
          labels,
          priority,
          color,
          isPinned,
        });
      }
      isDev === 'development'
        ? console.log('Task submitted:', {
            title,
            description,
            dueDate,
            labels,
            priority,
            color,
            isPinned,
          })
        : null;
    }
    onClose();
  };
  const handleCloseAndClear = () => {
    if (action === 'add') {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority(4);
      setLabels([]);
      setColor('#ffffff');
      setIsPinned(false);
    } else {
      setId(taskDetails._id);
      setTitle(taskDetails.title);
      setDescription(taskDetails.description);
      setDueDate(
        taskDetails.dueDate && taskDetails.dueDate.trim()
          ? new Date(taskDetails.dueDate)
          : '',
      );
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
      setColor(taskDetails.cardColor);
      setIsPinned(taskDetails.isPinned);
    }
    onClose();
  };
  const handleRemoveDueDate = () => {
    setDueDate(''); // Clear the due date
  };
  const handleLabel = () => {
    setIslabelDropDownOpen(!islabelDropDownOpen);
  };
  const handleRemoveLabel = (index) => {
    const inputLabels = labels.filter((_, i) => i !== index);
    setLabels(inputLabels);
  };
  const handleColorChange = (newColor) => {
    setColor(newColor);
    setIslabelDropDownOpen(false);
  };
  const onPriorityChange = (p) => {
    setPriority(p);
  };
  const handleIsPinned = () => {
    setIsPinned(!isPinned);
  };

  const COLOR_PALETTE = [
    '#fdfbd5',
    '#f9a6a6',
    '#ffb885ff',
    '#b1cbf2',
    '#c2ebbc',
    '#19cbf1',
    '#ff8bf8',
    '#d7ff87',
    '#f3f3f3',
    '#ffffff',
  ];

  return trigger ? (
    <div className="popup-container">
      <div className="popup" style={{ backgroundColor: color }} ref={popupRef}>
        <form onSubmit={handleSubmit}>
          <div
            onClick={handleIsPinned}
            className={isPinned ? 'pinned pin' : 'pin'}
          >
            {/* style={{ rotate: isPinned ? '0deg' : '45deg' }} */}
            <Pin fill={isPinned ? '#4e4e4e' : 'none'} />
          </div>
          <div className="form-group">
            <input
              placeholder={placeholderText}
              autoFocus
              aria-label="title"
              className="text-area title"
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-describedby="basic-addon1"
            />
          </div>
          <div className="form-group">
            <textarea
              as="textarea"
              name="Description"
              className="text-area"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          {dueDate !== '' ? (
            <div
              className="due-date-container"
              style={{
                fontSize: '14px',
                marginBottom: '5px',
                color:
                  color === '#ffffff' || color === '#f3f3f3'
                    ? '#ff9a00'
                    : '#4e4e4e',
              }}
            >
              <div className="task-date-container">
                <CalendarFold width={'1em'} height={'1em'} />
                <span>
                  {dueDate instanceof Date
                    ? dueDate.toLocaleDateString()
                    : 'Invalid Date'}
                </span>
                <button
                  className="cross"
                  type="button"
                  onClick={handleRemoveDueDate}
                >
                  <X />
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="label-tag-container">
            {labels.map((label, index) => (
              <div key={index} className="label-tag">
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLabel(index)}
                  className="btn"
                >
                  <X color="#4e4e4e" height="16" width="16" />
                </button>
              </div>
            ))}
          </div>
          <hr />
          <div className="popup-btn">
            <div className="task-properties">
              <DatePicker setDueDate={setDueDate} dueDate={dueDate} />
              <PriorityDropdown
                onPriorityChange={onPriorityChange}
                priority={priority}
              />
              <PopperDropdown
                containerRef={labelDropDownRef}
                btnRef={labelPickerBtnRef}
                dropdownRef={labelPickerDropdownRef}
                isOpen={islabelDropDownOpen}
                setIsOpen={setIslabelDropDownOpen}
                content={
                  <div ref={labelDropDownRef}>
                    <button
                      className="btn"
                      id="task-btn"
                      type="button"
                      onClick={handleLabel}
                      ref={labelPickerBtnRef}
                    >
                      <Tag className="task-property-icon" />
                    </button>
                    {islabelDropDownOpen ? (
                      <LabelDropDown
                        handleLabel={handleLabel}
                        labels={labels}
                        setLabels={setLabels}
                        ref={labelPickerDropdownRef}
                      />
                    ) : null}
                  </div>
                }
              />
              <PopperDropdown
                containerRef={colorPickerRef}
                btnRef={colorPickerBtnRef}
                dropdownRef={colorPickerDropdownRef}
                isOpen={isColorPickerOpen}
                setIsOpen={setIsColorPickerOpen}
                content={
                  <div ref={colorPickerRef}>
                    <button
                      className="btn"
                      id="task-btn"
                      type="button"
                      onClick={() => {
                        setIsColorPickerOpen(!isColorPickerOpen);
                        setIslabelDropDownOpen(false);
                      }}
                      ref={colorPickerBtnRef}
                    >
                      <Palette className="task-property-icon" />
                    </button>
                    {isColorPickerOpen && (
                      <div
                        className="color-picker-container"
                        ref={colorPickerDropdownRef}
                      >
                        {COLOR_PALETTE.map((c) => (
                          <div
                            key={c}
                            className="color-swatch"
                            style={{
                              backgroundColor: c,
                              border:
                                c === color
                                  ? '2px solid #3b82f6'
                                  : '2px solid #d1d5db',
                            }}
                            onClick={() => handleColorChange(c)}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </div>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                {action === 'add' ? 'Add task' : 'Update'}
              </button>
              <button
                className="btn cancel"
                type="button"
                onClick={handleCloseAndClear}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : (
    ''
  );
}

export default taskPopup;
