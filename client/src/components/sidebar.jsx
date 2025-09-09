import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import '../assets/css/sidebar.css'

import DynamicCalendarIcon from "./helper/dynamicCalendarIcon"
import widget from '../assets/images/svg/widget.svg'
import magnifier from '../assets/images/svg/magnifer.svg'
import inbox from '../assets/images/svg/inbox.svg'
import calenderUpcoming from '../assets/images/svg/calendar-upcoming.svg'
import arrow from '../assets/images/svg/arrow-side.svg'
import profile from '../assets/images/profile.jpg'
import add from '../assets/images/svg/add.svg'
import AddTaskPopup from "./addTaskPopup";
import '../assets/css/popup.css'

function Sidebar({refreshTrigger}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  // const uselocation = useLocation()
  const [closeSidebar, setCloseSidebar] = useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false)

  const handleSearchClick = () => {
      console.log("Search clicked!");
      alert("clicked")
  };
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
  const handleCloseSidebar = () => {
      setCloseSidebar(!closeSidebar)
  };

  return (
    <div className={closeSidebar === false ? 'sideBar active': 'sideBar'}>
      <div className='profileContainer'>
        <img src={profile} alt='profile' className='profileImage'></img>
        <span>Tarun</span>
      </div>
      <div className="sidebarToggle">
        <hr></hr>
        <div className="burgerContainer">
          {/* <a onClick={handleCloseSidebar}> */}
            <img onClick={handleCloseSidebar} src={arrow} alt='sidebar' className='sidebarImage'></img>
          {/* </a> */}
        </div>
      </div>
      <div className="sideBarMenu">
        <ul>
          <li className='active'>
          <a onClick={handleAddTask}>
            <img src={add} alt='sidebar' className='sidebarImage'></img>
            <span className="txt">Add task</span>
          </a>
        </li>
        <li>
          <a onClick={handleSearchClick}>
            <img src={magnifier} alt='magnifier' className='sidebarImage'></img>
            <span className="txt">Search</span>
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