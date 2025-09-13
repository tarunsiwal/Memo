import { Link } from "react-router-dom";
import { useState, useEffect, useRef} from "react";

import '../assets/css/sidebar.css'
import '../assets/css/popup.css'

import DynamicCalendarIcon from "./helper/dynamicCalendarIcon"
import widget from '../assets/images/svg/widget.svg'
import magnifier from '../assets/images/svg/magnifer.svg'
import inbox from '../assets/images/svg/inbox.svg'
import calenderUpcoming from '../assets/images/svg/calendar-upcoming.svg'
import arrow from '../assets/images/svg/arrow-side.svg'
import profile from '../assets/images/profile.jpg'
import add from '../assets/images/svg/add.svg'

import AddTaskPopup from "./popups/addTaskPopup";
import SearchPopup from "./popups/searchPopup";

function Sidebar({refreshTrigger}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;

  const [closeSidebar, setCloseSidebar] = useState(false);
  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);


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
  const handleSearchClick = () => {
    setIsSearchPopupOpen(true)
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
          <li className='active addTask'>
          <a onClick={handleAddTask}>
            <img src={add} alt='sidebar' className='sidebarImage'></img>
            {/* <svg className='sidebarImage' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"/><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12.75 9C12.75 8.58579 12.4142 8.25 12 8.25C11.5858 8.25 11.25 8.58579 11.25 9L11.25 11.25H9C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75H11.25V15C11.25 15.4142 11.5858 15.75 12 15.75C12.4142 15.75 12.75 15.4142 12.75 15L12.75 12.75H15C15.4142 12.75 15.75 12.4142 15.75 12C15.75 11.5858 15.4142 11.25 15 11.25H12.75V9Z" /> </g></svg> */}
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
      <SearchPopup
      trigger={isSearchPopupOpen}
      onClose={() => setIsSearchPopupOpen(false)}
      
      />
    </div>
  );
}

export default Sidebar;