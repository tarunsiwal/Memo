import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useContext} from "react";

import '../assets/css/sidebar.css'
import '../assets/css/popup.css'

import DynamicCalendarIcon from "./helper/dynamicCalendarIcon"
import arrow from '../assets/images/svg/arrow-in-circle.svg'
import profile from '../assets/images/profile.jpg'
import add from '../assets/images/svg/add.svg'
import { MobileContext } from "../App";
import TruncatedText from "./helper/truncatedText";

import { X, Inbox, CalendarDays, FunnelPlus, LayoutGrid,LogOut } from "lucide-react"


import AddTaskPopup from "./popups/addTaskPopup";

function Sidebar({refreshTrigger, isSidebarOpen, setIsSidebarOpen, handleCloseSidebar, onNavigate, currentPage, handleLogout, token, user}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const isMobile = useContext(MobileContext);

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);

  const onAddTask = async (taskData) => {    
    try {
    const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' ,
          'Authorization': `Bearer ${token}`
        },
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
  const navItems = [
      { name: 'Inbox', path: 'Inbox', imgSrc: <Inbox className="sidebarImage" strokeWidth="1.8"/> },
      { name: 'Today', path: 'Today', imgSrc: <DynamicCalendarIcon/> },
      { name: 'Upcoming', path: 'Upcoming', imgSrc: <CalendarDays className="sidebarImage" strokeWidth="1.8"/>},
      { name: 'Filter/Labels', path: 'FilterLabels', imgSrc: <FunnelPlus className="sidebarImage" strokeWidth="1.8"/>},
  ];
  
  return (
    <div className={isSidebarOpen === false ? (isMobile ? 'sideBar mobile' : 'sideBar active'): 'sideBar'}>
      <div className='profileContainer'>
        <div className="profile">
        <img src={profile} alt='profile' className='profileImage'></img>
        {console.log(user)}
        {user}
        {/* <TruncatedText text={user} wordLimit={10} type={'p'}/> */}
        </div>
        {isMobile ? (isMobile && isSidebarOpen === true &&(
            <button  className="btn" onClick={() => setIsSidebarOpen(false)}>
              {/* <img onClick={() => setIsSidebarOpen(false)} className='sidebarImage' src={cross} alt="" /> */}
              <X className='sidebarImage'/>
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
      <ul className="space-y-2 flex-grow">
        <li className='active addTask'>
          <button onClick={handleAddTask}>
            <img src={add} alt='sidebar' className='sidebarImage'></img>
            <span className="txt">Add task</span>
          </button>
        </li>
        {navItems.map(item => (
          <li key={item.path}>
              <button
                  onClick={() => onNavigate(item.path)}
                  // className={`w-full flex items-center space-x-3 text-left p-2 rounded-lg transition duration-150 ease-in-out font-medium 
                  //     ${currentPage === item.path 
                  //         ? 'bg-indigo-100 text-indigo-700' 
                  //         : 'text-gray-600 hover:bg-gray-100'}`}
                  
                  >
                  {/* <img 
                      src={item.imgSrc} 
                      alt={item.name} 
                      className='sidebarImage w-6 h-6 rounded-md'
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/24x24/cccccc/000000?text=?"}}
                  /> */}
                  {item.imgSrc}
                  <span className="txt">{item.name}</span>
                </button>
            </li>
            ))}
            <li>
              <button 
                onClick={handleLogout}
                className="logout-btn"
                // className="mt-8 w-full px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg shadow-md hover:bg-red-600 transition duration-150"
              ><LogOut className="sidebarImage"/>
                  <span className="txt" width="14">Logout</span>
              </button>
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