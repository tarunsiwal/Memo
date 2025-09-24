import { Link } from "react-router-dom";
import { useState, useEffect, useRef} from "react";

import '../assets/css/sidebar.css'
import '../assets/css/popup.css'

import DynamicCalendarIcon from "./helper/dynamicCalendarIcon"
import widget from '../assets/images/svg/widget.svg'
import inbox from '../assets/images/svg/inbox.svg'
import calenderUpcoming from '../assets/images/svg/calendar-upcoming.svg'
import arrow2 from '../assets/images/svg/arrow.svg'
import arrow from '../assets/images/svg/arrow-in-circle.svg'
import cross from '../assets/images/svg/cross.svg'
import profile from '../assets/images/profile.jpg'
import add from '../assets/images/svg/add.svg'
import burger from '../assets/images/svg/burger-menu.svg'

import AddTaskPopup from "./popups/addTaskPopup";

function Sidebar({refreshTrigger, isMobile, isSidebarOpen, setIsSidebarOpen, handleCloseSidebar}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);

  const onAddTask = async (taskData) => {    
    try {
    const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            dueDate: taskData.dueDate,
            labels: taskData.labels,
            priority: taskData.priority,
            cardColor: taskData.color,
        }),
    });
    if (response.ok) {
      console.log("Task added successfully!")
      refreshTrigger();
    } 
    else {
        throw new Error("Failed to add task :(");
    }
    setIsAddTaskPopupOpen(false);
    } catch (err) {
        console.error("Failed to add task:", err);
    }
  };
  const handleAddTask = () => {
    setIsAddTaskPopupOpen(true)
  }

  const style = {
    sideBar : {
    left: '-4rem',
  }}
  
  return (
    <div className={isSidebarOpen === false ? (isMobile ? 'sideBar mobile' : 'sideBar active'): 'sideBar'}>
      <div className='profileContainer'>
        <div className="profile">
        <img src={profile} alt='profile' className='profileImage'></img>
        <span>Tarun</span>
        </div>
        {isMobile ? (isMobile && isSidebarOpen === true &&(
            <button  className="btn">
              <img onClick={() => setIsSidebarOpen(false)} className='sidebarImage' src={cross} alt="" />
            </button>
          )) : null}
      </div>
      <div className="sidebarToggle">
        <hr></hr>
        {
        !isMobile ? 
        <div className="burgerContainer">
          <img onClick={handleCloseSidebar} src={arrow} alt='sidebar' className='sidebarImage arrow'></img>
        </div> 
        : null
        }
      </div>
      <div className="sideBarMenu">
        <ul>
          <li className='active addTask'>
          <a onClick={handleAddTask}>
            <img src={add} alt='sidebar' className='sidebarImage'></img>
            <span className="txt">Add task</span>
          </a>
        </li>
        <li>
          <Link to='/inbox'>
            <img src={inbox} alt='inbox' className='sidebarImage'></img>
            <span className="txt">Inbox</span>
          </Link>
        </li>
        <li>
          <Link to='/today'>
            <DynamicCalendarIcon />
            <span className="txt">Today</span>
          </Link>
        </li>
        <li>
          <Link to='/upcoming'>
            <img src={calenderUpcoming} alt='calenderUpcoming' className='sidebarImage'></img>
            <span className="txt">Upcoming</span>
          </Link>
        </li>
        <li>
          <Link to='/filterLabels'>
            <img src={widget} alt='widget' className='sidebarImage'></img>
            <span className="txt">Update & Labels</span>
          </Link>
        </li>
      </ul>
      </div>
      <AddTaskPopup 
      trigger={isAddTaskPopupOpen} 
      onClose={() => setIsAddTaskPopupOpen(false)} 
      onAddTask={onAddTask}/>
    </div>
  );
}

export default Sidebar;