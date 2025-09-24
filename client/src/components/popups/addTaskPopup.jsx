import { useState, useEffect, useRef } from "react";

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'https://cdn.jsdelivr.net/npm/flatpickr'
import PriorityDropdown from "../ui/priorityDropDown";
import {Tag, X, Palette} from "lucide-react"

function AddTaskPopup({ trigger, onClose, onAddTask }) {
    const dummyText = [
    "Project Plan: Q3 Report",
    "Team Meeting: Agenda Review",
    "Client Follow-up: Acme Corp",
    "Draft Thesis Abstract",
    "Submit Expense Report",
    "Groceries run",
    "Finish blog post draft",
    "Pick up dry cleaning",
    "Brainstorm new app ideas",
  ];
  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * dummyText.length);
    return dummyText[randomIndex];
  };
  const [placeholderText] = useState(getRandomPlaceholder());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(4);
  const [labels, setLabels] = useState([]);
  const [color, setColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const inputRefs = useRef([]);
  const spanRefs = useRef([]);
  const popupRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onAddTask({ title, description, dueDate, labels, priority, color });
      console.log("Task submitted:", { title, description, dueDate, labels, priority, color });
      setTitle(""); 
      setDescription("");
      setDueDate("");
      setPriority(4);
      setLabels([]);
      setColor('#ffffff')
    }
    onClose();
  };
  const handleCloseAndClear = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(4);
    setLabels([]);
    setColor('#ffffff');
    onClose();
  };
  // set label logic
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
  }, [labels]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    setShowColorPicker(false);
  };
  return trigger ? (
    <div className="popup-container">
      <div className="popup"
      style={{ backgroundColor: color }}
      ref={popupRef}>
        <form onSubmit={handleSubmit} >
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
          <div className="label-tag-container">
            {labels.map((label, index) => (
          <div key={index} className="label-tag">
            {/* font-size: 12px; padding: 4px !important; */}
            <span 
              ref={el => spanRefs.current[index] = el}
              style={{ visibility: 'hidden', whiteSpace: 'pre', position: 'absolute' }}>
              {label}
            </span>
            <input
              autoFocus
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={label}
              style={{width:`${label.length * 8}`}}
              onChange={(e) => handleChangeLabel(index, e)}
              className=""
              // placeholder={`Label ${index + 1}`}
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
              <Form.Select aria-label="Floating label select example"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}>
                <option value="1">Priority 1</option>
                <option value="2">Priority 2</option>
                <option value="3">Priority 3</option>
                <option value="4">Priority 4</option>   
              {/* {flagSVG(1)}
              {flagSVG(2)}
              {flagSVG(3)}
              {flagSVG(4)} */}
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
              {/* <LabelsManager /> */}
            </div>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                Add task
              </button>
              <button
                className="btn cancel"
                type="button"
                onClick={handleCloseAndClear}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  ) : '';
}

export default AddTaskPopup