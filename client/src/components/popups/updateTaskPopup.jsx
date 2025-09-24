import { useState, useEffect, useLayoutEffect, useRef } from "react";

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'https://cdn.jsdelivr.net/npm/flatpickr'
import '../../assets/css/popup.css'
import {Tag, X, Palette} from "lucide-react"
import '../../assets/css/colorPicker.css'


function UpdateTaskPopup({ trigger, onClose, onUpdateTask, taskDetails }) {
  const initialTask = taskDetails || {};

  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [dueDate, setDueDate] = useState(initialTask.dueDate ? new Date(initialTask.dueDate) : '');
  const [priority, setPriority] = useState(initialTask.priority || 4);
  const [labels, setLabels] = useState(initialTask.labels || []);
  const [id, setId] = useState(initialTask._id || null);
  const [color, setColor] = useState(initialTask.cardColor || '#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const inputRefs = useRef([]);
  const spanRefs = useRef([]);
  const popupRef = useRef(null);

  useEffect(() => {
    if (taskDetails) {
      setId(taskDetails._id);
      setTitle(taskDetails.title);
      setDescription(taskDetails.description);
      setDueDate(new Date(taskDetails.dueDate));
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
      setColor(taskDetails.cardColor);
    }
  }, [taskDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onUpdateTask({ id, title, description, dueDate, labels, priority, color });
      console.log("Task Updated:", {  id, title, description, dueDate, labels, priority, color });
    }
  };
  const handleCloseAndClear = () => {
    setId(taskDetails._id);
    setTitle(taskDetails.title);
    setDescription(taskDetails.description);
    setDueDate(new Date(taskDetails.dueDate));
    setPriority(taskDetails.priority);
    setLabels(taskDetails.labels);
    setColor(taskDetails.cardColor);
    setShowColorPicker(false)
    onClose();
  };
  const handleAddLabel = () => {
    setLabels([...labels, '']);
  };
  const handleChangeLabel = (index, event) => {
    const inputLabels = [...labels];
    inputLabels[index] = event.target.value;
    setLabels(inputLabels);
  };
  const handleRemoveLabel = (index) => {
    const inputLabels = labels.filter((_, i) => i !== index);
    setLabels(inputLabels);
  };
  useEffect(() => {
    labels.forEach((label, index) => {
      const inputEl = inputRefs.current[index];
      const spanEl = spanRefs.current[index];
      if (inputEl && spanEl) {
        const textWidth = spanEl.offsetWidth;
        inputEl.style.width = `${Math.max(10, textWidth + 8)}px`;
      }
    });
  }, [labels, trigger]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    console.log(color)
    setShowColorPicker(false);
  };
  return trigger ? (
    <div className="popup-container">
      <div className="popup"
      style={{ backgroundColor: color }}
      ref={popupRef}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
              <input
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
          <div className="label-tag-container">
            {labels.map((label, index) => (
          <div key={index} className="label-tag">
            <span 
              ref={el => spanRefs.current[index] = el}
              style={{ visibility: 'hidden', whiteSpace: 'pre', position: 'absolute' }}>
              {label}
            </span>
            <input
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={label}
              autoFocus
              style={{width:`${label.length * 8}`}}
              onChange={(e) => handleChangeLabel(index, e)}
              className=""
            />
            <button
              type="button"
              onClick={() => handleRemoveLabel(index)}
              className="btn"
            >
              <X color="#4e4e4e" height="16" width="16"/>
            </button>
          </div>
        ))}
          </div>
          <hr/>
          <div className="popup-btn">
            <div className="task-properties">
              <Datepicker 
                type="date"
                selected={dueDate}
                onChange={date=>setDueDate(date)}
                placeholderText=" Due date"
                name="Due Date"
              />
              {/* <input
              type="date"
              value={dueDate instanceof Date ? dueDate.toISOString().slice(0, 10) : ''}
              onChange={(e) => setDueDate(new Date(e.target.value))}
              // onChange={date=>setDueDate(date)}
              className="bg-gray-700 text-white p-2 rounded-lg border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
            /> */}
              <Form.Select aria-label="Floating label select example"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              >
                <option value="1">Priority 1</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
                <option value="4">Priority 4</option>   
              </Form.Select>
              <button className="btn" id="task-btn" type="button" onClick={handleAddLabel}>
                <Tag className="task-property-icon" />
              </button>
              <button className="btn" id="task-btn"
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette className="task-property-icon" />
              </button>
              {showColorPicker && (
              <div className="color-picker-container">
                {['#fdfbd5', '#f9a6a6', '#b1cbf2', '#c2ebbc', '#f3f3f3', '#ffffff'].map((c) => (
                  <div
                    key={c}
                    className="color-swatch"
                    style={{ backgroundColor: c }}
                    onClick={() => handleColorChange(c)}
                  ></div>
                ))}
                </div>)}
            </div>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                Update
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
  ) : '';
}

export default UpdateTaskPopup