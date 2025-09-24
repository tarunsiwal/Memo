// src/components/TaskCard.jsx
import React from "react";
import { Container } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from "react";
import TruncatedText from "../helper/truncatedText"

import { Trash2, Pencil, Palette, Tag, EllipsisVertical, Pin} from "lucide-react"

// You will pass the props from the parent component
function TaskCard({ task, onUpdateTask, deletePopup, togglePin, handleUpdateTaskPopup, styles }) {
  const [hoveredCardId, setHoveredCardId] = useState(null); // Keep hover state here for better encapsulation
  
  // All your date and priority logic can stay here
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
      {/* Your pin and other JSX goes here */}
      {(task.isPinned || hoveredCardId === task._id) && (
        <div className={`pin ${task.isPinned ? 'pinned' : ''}`} onClick={() => togglePin(task._id, task.isPinned)}>
          <Pin fill={task.isPinned ? '#4e4e4e' : 'none'}/>
        </div>
      )}
      <p className="title text-xl font-bold text-gray-800">{task.title}</p>
      <TruncatedText className={"description text-sm  italic"} text={task.description} wordLimit={30}/>
                <div className="cardProperties">
                  {localizedDate && (
                  <div className="dueDate text-sm  flex items-center space-x-2 d-flex" 
                  style={{color : (task.cardColor === '#ffffff' || task.cardColor === '#f3f3f3' ?
                       '#ff9a00' : '#4e4e4e')}}
                       >
                    <svg className="h-4 w-4 text-gray-500" width="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2.5 9H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span> {localizedDate}</span>
                  </div>
                  )}
                  <div className="priority text-sm  flex items-center space-x-2 d-flex">
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


// {taskList.map((task) => {
//           const hasDueDate = task.dueDate && task.dueDate.trim().length > 0;
//           const localizedDate = hasDueDate
//           ? new Date(task.dueDate).toLocaleDateString()
//           : null;
//           let flag = 'none'
//           if(task.priority === 3) flag = '#198754'
//           else if(task.priority === 2) flag = '#ffec2e'
//           else if(task.priority === 1) flag = '#de1313ff'
//           return (
//             <Container key={task._id} 
//             className="task-card  rounded-lg shadow-md p-4 space-y-2" 
//             style={{...styles.taskCard, backgroundColor: task.cardColor}}
//             ref={popupRef}
//             onMouseEnter={() => setHoveredCardId(task._id)}
//             onMouseLeave={() => setHoveredCardId(null)}
//             >
//               {(task.isPinned || hoveredCardId === task._id) && (
//                 <div className={`pin ${task.isPinned ? 'pinned' : ''}`} onClick={() => togglePin(task._id, task.isPinned)}>
//                   <Pin fill={task.isPinned ? '#4e4e4e' : 'none'}/>
//                 </div>
//               )}
//               <p className="title text-xl font-bold text-gray-800">{task.title}</p>
//               <TruncatedText className={"description text-sm  italic"} text={task.description} wordLimit={30}/>
//                 <div className="cardProperties">
//                   {localizedDate && (
//                   <div className="dueDate text-sm  flex items-center space-x-2 d-flex" 
//                   style={{color : (task.cardColor === '#ffffff' || task.cardColor === '#f3f3f3' ?
//                        '#ff9a00' : '#4e4e4e')}}
//                        >
//                     <svg className="h-4 w-4 text-gray-500" width="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2.5 9H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
//                     </svg>
//                     <span> {localizedDate}</span>
//                   </div>
//                   )}
//                   <div className="priority text-sm  flex items-center space-x-2 d-flex">
//                     <span>Priority {task.priority} 
//                       <svg viewBox="0 0 24 24" style={{width:'1em'}} fill={flag} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke={flag==='none'? '#000' : flag} strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
//                     </span>
//                   </div>
//                   <div className="d-flex">
//                     <div className="label-tag-container">
//                       {task.labels.map((label, index) => (
//                         <div key={index} className="label-tag">
//                           <span>{label}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>  
//                 </div>
//               <div className="menuBtnContainer flex justify-end gap-2 mt-1 text-end" style={styles.cardMenuPosition}>
//                 <div className="taskInfo">
//                 </div>
//                 <Dropdown>
//                   <Dropdown.Toggle  id="task-btn" className="btn">
//                     {/* <img src={MenuDot} alt='menuDots' className='sidebarImage' style={styles.rotationStyle}></img> */}
//                     <EllipsisVertical color={'#2d2d2dff'}/>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item onClick={() => {
//                       handleUpdateTaskPopup(task._id);
//                       }}><Pencil /> Edit</Dropdown.Item>
//                     <Dropdown.Item onClick={() => {
//                       handleUpdateTaskPopup(task._id);
//                       }}><Tag /> Label</Dropdown.Item>
//                     <Dropdown.Item 
//                       onClick={() => setShowColorPicker(!showColorPicker)}
//                       ><Palette /> Color</Dropdown.Item>
//                       {/* {showColorPicker && (
//                       <div className="color-picker-container">
//                         {['#fdfbd5', '#f9a6a6', '#b1cbf2', '#c2ebbc', '#f3f3f3', '#ffffff'].map((c) => (
//                           <div
//                             key={c}
//                             className="color-swatch"
//                             style={{ backgroundColor: c }}
//                             onClick={() => handleColorChange(task.id, c)}
//                           ></div>
//                         ))}
//                         </div>)} */}
//                       <hr style={{margin: '0'}}/>
//                     <Dropdown.Item onClick={() => {
//                       deletePopup(task._id, task.title)
//                       }}><Trash2 color="#ff0000ff"/><span style={{color: "#ff0000ff"}}> Delete</span></Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </Container>
//           );
//         })}