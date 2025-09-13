import { useState } from "react";

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'https://cdn.jsdelivr.net/npm/flatpickr'
import PriorityDropdown from "../ui/priorityDropDown";

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
  const flagSVG = (priority) =>{
    let flag;
    if(priority === 3) flag = 'green'
    else if(priority === 2) flag = 'yellow'
    else if(priority === 1) flag = 'red'
    return <svg viewBox="0 0 24 24" style={{width:'1em'}} fill={flag} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke={flag==='none'? '#000' : flag} strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
  }
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
              {/* <PriorityDropdown
                    priority={priority}
                    onPriorityChange={setPriority}
                  /> */}
              <Form.Select aria-label="Floating label select example"
              id="priority"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}>
                <option value="1">Priority 1 {console.log(flagSVG(1))}</option>
                <option value="2">Priority 2 {flagSVG(2)}</option>
                <option value="3">Priority 3 {flagSVG(3)}</option>
                <option value="4">Priority 4 {flagSVG(4)}</option>   
              </Form.Select>
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