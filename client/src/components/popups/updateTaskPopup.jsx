import { useState, useEffect } from "react";

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'https://cdn.jsdelivr.net/npm/flatpickr'
import '../../assets/css/popup.css'

function UpdateTaskPopup({ trigger, onClose, onUpdateTask, taskDetails }) {
  const initialTask = taskDetails || {};

  const [title, setTitle] = useState(initialTask.title || '');
  const [description, setDescription] = useState(initialTask.description || '');
  const [dueDate, setDueDate] = useState(initialTask.dueDate ? new Date(initialTask.dueDate) : '');
  const [priority, setPriority] = useState(initialTask.priority || 4);
  const [labels, setLabels] = useState(initialTask.labels || []);
  const [id, setId] = useState(initialTask._id || null);

  useEffect(() => {
    if (taskDetails) {
      setId(taskDetails._id);
      setTitle(taskDetails.title);
      setDescription(taskDetails.description);
      setDueDate(new Date(taskDetails.dueDate));
      setPriority(taskDetails.priority);
      setLabels(taskDetails.labels);
    }
  }, [taskDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onUpdateTask({ id, title, description, dueDate, labels, priority });
      console.log("Task Updated:", {  id, title, description, dueDate, labels, priority });
    }
  };
  const handleCloseAndClear = () => {
    onClose();
  };
  return trigger ? (
    <div className="popup-container">
      <div className="popup">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <InputGroup className="mb-3">
              <Form.Control
                // placeholder={placeholderText}
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
                Update task
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