import { useState } from "react";

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'https://cdn.jsdelivr.net/npm/flatpickr'

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
  const [dueDate, setDueDate] = useState(null);
  const [priority, setPriority] = useState(4);
  const [labels, setLabels] = useState([])

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onAddTask({ title, description, dueDate, labels, priority });
      console.log("Task submitted:", { title, description, dueDate, labels, priority });
      setTitle(""); 
      setDescription("");
      setDueDate("");
      setPriority(4);
      setLabels("");
    }
    onClose();
  };
  const handleCloseAndClear = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(4);
    setLabels("");
    onClose();
  };
  return trigger ? (
    <div className="popup-container">
      <div className="popup">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <InputGroup className="mb-3">
              <Form.Control
                placeholder={placeholderText}
                aria-label="title"
                className="text-area"
                type="text"
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
          <div className="form-group">
            {/* <FloatingLabel controlId="floatingTextarea2" label="Description"> */}
            <Form.Control
              as="textarea"
              name="Description"
              className="text-area"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              style={{ height: '150px' }}
              required
            />
            {/* </FloatingLabel> */}
          </div>
          <hr/>
          <div className="popup-btn">
            <div className="task-dueDate-Priority">
              <Datepicker 
                type="date"
                selected={dueDate}
                // value={dueDate}
                onChange={date=>setDueDate(date)}
                placeholderText=" Due date"
                name="Due Date"
              />
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
            </div>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                Add task
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

export default AddTaskPopup