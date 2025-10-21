import { useState, useEffect, useRef, useContext } from 'react';
import { createPopper } from '@popperjs/core';
import DatePicker from '../ui/datePicker';
// import 'https://cdn.jsdelivr.net/npm/flatpickr';
import PriorityDropdown from '../ui/priorityDropDown';
import LabelDropDown from '../ui/labelDropDown';
import '../../assets/css/colorPicker.css';
import '../../assets/css/popup.css';

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
  const [dueDate, setDueDate] = useState(initialTask.dueDate || '');
  const [priority, setPriority] = useState(initialTask.priority || 4);
  const [labels, setLabels] = useState(initialTask.labels || []);
  const [color, setColor] = useState(initialTask.cardColor || '#ffffff');
  const [isPinned, setIsPinned] = useState(initialTask.isPinned || false);
  const [id, setId] = useState(initialTask._id || null);

  // toggle state
  const [islabelDropDownOpen, setIslabelDropDownOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

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
      setDueDate(new Date(taskDetails.dueDate));
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
      setColor(taskDetails.cardColor);
      setIsPinned(taskDetails.isPinned);
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
      isDev
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
      setDueDate(new Date(taskDetails.dueDate));
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
      setColor(taskDetails.cardColor);
      setIsPinned(taskDetails.isPinned);
    }
    onClose();
  };
  const handleLabel = () => {
    setIslabelDropDownOpen(!islabelDropDownOpen);
    // setShowColorPicker(false);
  };
  const handleRemoveLabel = (index) => {
    const inputLabels = labels.filter((_, i) => i !== index);
    setLabels(inputLabels);
  };
  const handleColorChange = (newColor) => {
    setColor(newColor);
    // setShowColorPicker(true);
    setIslabelDropDownOpen(false);
    isDev
      ? console.log('Toggled Color Picker. New state:', !showColorPicker)
      : null;
  };
  const onPriorityChange = (p) => {
    setPriority(p);
  };
  const handelIsPinned = () => {
    setIsPinned(!isPinned);
  };

  // main div outclick effect
  useEffect(() => {
    let colorPopperInstance = null;
    if (
      showColorPicker &&
      colorPickerBtnRef.current &&
      colorPickerDropdownRef.current
    ) {
      colorPopperInstance = createPopper(
        colorPickerBtnRef.current,
        colorPickerDropdownRef.current,
        {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              options: { fallbackPlacements: ['top-start', 'right-start'] },
            },
            { name: 'preventOverflow', options: { padding: 8 } },
          ],
        },
      );
    }
    return () => {
      colorPopperInstance?.destroy();
    };
  }, [showColorPicker]);

  useEffect(() => {
    let labelPopperInstance = null;
    if (
      islabelDropDownOpen &&
      labelPickerBtnRef.current &&
      labelPickerDropdownRef.current
    ) {
      labelPopperInstance = createPopper(
        labelPickerBtnRef.current,
        labelPickerDropdownRef.current,
        {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              options: { fallbackPlacements: ['top-start', 'right-start'] },
            },
            { name: 'preventOverflow', options: { padding: 8 } },
          ],
        },
      );
    }
    return () => {
      labelPopperInstance?.destroy();
    };
  }, [islabelDropDownOpen]);

  useEffect(() => {
    if (!colorPickerRef) return;
    const colorPickerTimer = setTimeout(() => {
      const handleClickOutside = (event) => {
        if (
          colorPickerRef.current &&
          !colorPickerRef.current.contains(event.target)
        ) {
          setShowColorPicker(false);
        }
      };
      document.addEventListener('pointerdown', handleClickOutside);

      return () => {
        document.removeEventListener('pointerdown', handleClickOutside);
      };
    }, 0);
    return () => clearTimeout(colorPickerTimer);
  }, [colorPickerRef]);

  useEffect(() => {
    if (!labelDropDownRef) return;
    const labelDropdownTimer = setTimeout(() => {
      const handleClickOutside = (event) => {
        if (
          labelDropDownRef.current &&
          !labelDropDownRef.current.contains(event.target)
        ) {
          setIslabelDropDownOpen(false);
        }
      };
      document.addEventListener('pointerdown', handleClickOutside);
      return () => {
        document.removeEventListener('pointerdown', handleClickOutside);
      };
    }, 0);
    return () => clearTimeout(labelDropdownTimer);
  }, [labelDropDownRef]);

  const COLOR_PALETTE = [
    '#fdfbd5',
    '#f9a6a6',
    '#b1cbf2',
    '#c2ebbc',
    '#f3f3f3',
    '#ffffff',
  ];
  return trigger ? (
    <div className="popup-container">
      <div className="popup" style={{ backgroundColor: color }} ref={popupRef}>
        <form onSubmit={handleSubmit}>
          <div
            onClick={handelIsPinned}
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
          {dueDate && (
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
              <CalendarFold width={'1em'} height={'1em'} />
              <span> {new Date(dueDate).toLocaleDateString()} </span>
            </div>
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
              <DatePicker setDueDate={setDueDate} />
              <PriorityDropdown
                onPriorityChange={onPriorityChange}
                priority={priority}
              />
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
              <div ref={colorPickerRef}>
                <button
                  className="btn"
                  id="task-btn"
                  type="button"
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setIslabelDropDownOpen(false);
                  }}
                  ref={colorPickerBtnRef}
                >
                  <Palette className="task-property-icon" />
                </button>
                {showColorPicker && (
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
