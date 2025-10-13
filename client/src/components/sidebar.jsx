import { useState, useEffect, useRef, useContext, useCallback } from 'react';

import '../assets/css/sidebar.css';
import '../assets/css/popup.css';

import DynamicCalendarIcon from './helper/dynamicCalendarIcon';
import arrow from '../assets/images/svg/arrow-in-circle.svg';
import profile from '../assets/images/profile.jpg';
import add from '../assets/images/svg/add.svg';
import { MobileContext, TokenContext } from '../App';
import TruncatedText from './helper/truncatedText';

import {
  X,
  Inbox,
  CalendarDays,
  FunnelPlus,
  LayoutGrid,
  LogOut,
  StickyNote,
} from 'lucide-react';
import AddTaskPopup from './popups/addTaskPopup';

function Sidebar({
  refreshTrigger,
  isSidebarOpen,
  setIsSidebarOpen,
  handleCloseSidebar,
  onNavigate,
  currentPage,
  handleLogout,
  user,
}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const isMobile = useContext(MobileContext);
  const token = useContext(TokenContext);

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);

  const onAddTask = async (taskData) => {
    try {
      const response = await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
        console.log('Task added successfully!');
        refreshTrigger();
      } else {
        throw new Error('Failed to add task :(');
      }
      setIsAddTaskPopupOpen(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleAddTask = () => {
    setIsAddTaskPopupOpen(true);
  };
  const navItems = [
    {
      name: 'Sticky Note',
      path: 'Sticky Note',
      imgSrc: <StickyNote className="sidebarImage" strokeWidth="1.8" />,
    },
    {
      name: 'Inbox',
      path: 'Inbox',
      imgSrc: <Inbox className="sidebarImage" strokeWidth="1.8" />,
    },
    { name: 'Today', path: 'Today', imgSrc: <DynamicCalendarIcon /> },
    {
      name: 'Upcoming',
      path: 'Upcoming',
      imgSrc: <CalendarDays className="sidebarImage" strokeWidth="1.8" />,
    },
    {
      name: 'Filter/Labels',
      path: 'FilterLabels',
      imgSrc: <FunnelPlus className="sidebarImage" strokeWidth="1.8" />,
    },
  ];

  const style = {
    hideSpan: {
      display: isSidebarOpen ? 'block' : 'none',
    },
    widthLI: {
      width: isSidebarOpen ? 'unset' : 'calc(10px + 1.2rem)',
    },
    widthBT: {
      width: isSidebarOpen ? '100%' : 'unset',
    },
  };

  return (
    <div
      className={
        isSidebarOpen === false
          ? isMobile
            ? 'sideBar mobile'
            : 'sideBar active'
          : 'sideBar'
      }
    >
      <div className="profileContainer">
        <div className="profile">
          <img src={profile} alt="profile" className="profileImage"></img>
          <TruncatedText text={user} wordLimit={10} type={'span'} />
        </div>
        {isMobile
          ? isMobile &&
            isSidebarOpen === true && (
              <button className="btn" onClick={() => setIsSidebarOpen(false)}>
                <X className="sidebarImage" />
              </button>
            )
          : null}
      </div>
      <div className="sidebarToggle">
        <hr></hr>
        {!isMobile ? (
          <div className="burgerContainer">
            <img
              onClick={handleCloseSidebar}
              src={arrow}
              alt="sidebar"
              className="sidebarImage arrow"
            ></img>
          </div>
        ) : null}
      </div>
      <div className="sideBarMenu">
        <ul className="space-y-2 flex-grow">
          <li className="active addTask" style={style.widthLI}>
            <button onClick={handleAddTask} style={style.widthBT}>
              <img src={add} alt="sidebar" className="sidebarImage"></img>
              <span className="txt" style={style.hideSpan}>
                Add task
              </span>
            </button>
          </li>
          {navItems.map((item) => (
            <li
              key={item.path}
              style={style.widthLI}
              className={item.path === currentPage ? 'active' : ''}
            >
              <button
                onClick={() => onNavigate(item.path)}
                style={style.widthBT}
              >
                <div className="image-container">{item.imgSrc}</div>
                <span className="txt" style={style.hideSpan}>
                  {item.name}
                </span>
              </button>
            </li>
          ))}
          <li style={style.widthLI}>
            <button
              onClick={handleLogout}
              className="logout-btn"
              style={style.widthBT}
            >
              <div className="image-container">
                <LogOut className="sidebarImage" />
              </div>
              <span className="txt" width="14" style={style.hideSpan}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
      <AddTaskPopup
        trigger={isAddTaskPopupOpen}
        onClose={() => setIsAddTaskPopupOpen(false)}
        onAddTask={onAddTask}
      />
    </div>
  );
}

export default Sidebar;
