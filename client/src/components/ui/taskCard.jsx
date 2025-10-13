// src/components/TaskCard.jsx
import React from "react";
import { Container } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { useState, useContext } from "react";
import TruncatedText from "../helper/truncatedText"
import { MobileContext } from '../../App';

import { Trash2, Pencil, Palette, Tag, EllipsisVertical, Pin, CalendarFold} from "lucide-react"

function TaskCard({ task, deletePopup, togglePin, handleUpdateTaskPopup, styles }) {
  const [hoveredCardId, setHoveredCardId] = useState(null); // Keep hover state here for better encapsulation
  
  const isMobile = useContext(MobileContext);
  const hasDueDate = task.dueDate && task.dueDate.trim().length > 0;
  const localizedDate = hasDueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  let flag = 'none'
  if(task.priority === 3) flag = '#198754'
  else if(task.priority === 2) flag = '#ffec2e'
  else if(task.priority === 1) flag = '#de1313ff'

  return (
    <Container 
      key={task._id} 
      className="task-card rounded-lg shadow-md p-4 space-y-2" 
      style={{...styles.taskCard, backgroundColor: task.cardColor}}
      onMouseEnter={() => setHoveredCardId(task._id)}
      onMouseLeave={() => setHoveredCardId(null)}
    >
      {(isMobile || task.isPinned || hoveredCardId === task._id) && (
        <div className={`pin ${task.isPinned ? 'pinned' : ''}`} onClick={() => togglePin(task._id, task.isPinned)}>
          <Pin fill={task.isPinned ? '#4e4e4e' : 'none'} style= {{rotate : task.isPinned ? '0deg' : '45deg'}}/>
        </div>
      )}
      <TruncatedText className={"title text-xl font-bold text-gray-800"} text={task.title} wordLimit={25} type={'p'}/>
      <TruncatedText className={"description text-sm  italic mb-0"} text={task.description} wordLimit={100} type={'span'}/>
      <div className="cardProperties">
        {localizedDate && (
        <div className="dueDate" 
        style={{color : (task.cardColor === '#ffffff' || task.cardColor === '#f3f3f3' ?
              '#ff9a00' : '#4e4e4e')}}
              >
          <CalendarFold width={'1em'} height={'1em'}/>
          <span> {localizedDate}</span>
        </div>
        )}
        <div className="priority">
          <span>Priority {task.priority} 
            <svg viewBox="0 0 24 24" style={{width:'1em'}} fill={flag} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke={flag==='none'? '#000' : flag} strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
          </span>
        </div>
        <div className="d-flex">
          <div className="label-tag-container">
            {task.labels.map((label, index) => (
              <div key={index} className="label-tag">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>  
      </div>
      <div className="menuBtnContainer flex justify-end gap-2 mt-1 text-end" style={styles.cardMenuPosition}>
        <Dropdown>
          <Dropdown.Toggle id="task-btn" className="btn">
            <EllipsisVertical color={'#2d2d2dff'}/>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleUpdateTaskPopup(task._id)}><Pencil /> Edit</Dropdown.Item>
            <Dropdown.Item onClick={() => handleUpdateTaskPopup(task._id)}><Tag /> Label</Dropdown.Item>
            <Dropdown.Item><Palette /> Color</Dropdown.Item>
            <hr style={{margin: '0'}}/>
            <Dropdown.Item onClick={() => deletePopup(task._id, task.title)}><Trash2 color="#ff0000ff"/><span style={{color: "#ff0000ff"}}> Delete</span></Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Container>
  );
}

export default TaskCard;
