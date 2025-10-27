import { useState, useEffect, useMemo, useContext, useCallback } from 'react';

import '../assets/css/sidebar.css';
import '../assets/css/popup.css';

import DynamicCalendarIcon from './helper/dynamicCalendarIcon';
import arrow from '../assets/images/svg/arrow-in-circle.svg';
import profile from '../assets/images/profile.jpg';
import { MobileContext, TokenContext } from '../App';
import TruncatedText from './helper/truncatedText';
import TaskPopup from './popups/taskPopup';

import {
  X,
  Inbox,
  CalendarDays,
  FunnelPlus,
  LogOut,
  CirclePlus,
} from 'lucide-react';
import LogoutPopup from './popups/logoutPopup';

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
  const isDev = import.meta.env.REACT_APP_ENV === 'development';

  const [isAddTaskPopupOpen, setIsAddTaskPopupOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);

  const onAddTask = useCallback(
    async (taskData) => {
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
            isPinned: taskData.isPinned,
          }),
        });
        if (response.ok) {
          isDev === 'development'
            ? console.log('Task added successfully!')
            : null;
          refreshTrigger();
        } else {
          throw new Error('Failed to add task :(');
        }
        setIsAddTaskPopupOpen(false);
      } catch (err) {
        console.error('Failed to add task:', err);
      }
    },
    [token, apiUrl, refreshTrigger, isDev],
  );

  const handleAddTask = useCallback(() => {
    setIsSidebarOpen(false);
    setIsAddTaskPopupOpen(true);
  }, []);
  const navItems = [
    {
      name: 'Inbox',
      path: 'Inbox',
      imgSrc: <Inbox className="sidebarImage" strokeWidth="1.6" />,
    },
    { name: 'Today', path: 'Today', imgSrc: <DynamicCalendarIcon /> },
    {
      name: 'Upcoming',
      path: 'Upcoming',
      imgSrc: <CalendarDays className="sidebarImage" strokeWidth="1.6" />,
    },
    {
      name: 'Filter/Labels',
      path: 'FilterLabels',
      imgSrc: <FunnelPlus className="sidebarImage" strokeWidth="1.6" />,
    },
  ];

  const style = useMemo(
    () => ({
      hideSpan: {
        display: isSidebarOpen ? 'block' : 'none',
      },
      widthLI: {
        width: isSidebarOpen ? 'unset' : 'calc(10px + 1.2rem)',
      },
      widthBT: {
        width: isSidebarOpen ? '100%' : 'unset',
      },
    }),
    [isSidebarOpen],
  );

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
          <li className=" addTask" style={style.widthLI}>
            <button onClick={handleAddTask} style={style.widthBT}>
              <div className="image-container">
                <CirclePlus width={'1.1em'} strokeWidth="1.8" color="#ff9a00" />
              </div>
              <span
                className="txt"
                style={{ ...style.hideSpan, color: '#ff9a00' }}
              >
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
              onClick={() => {
                setIsLogoutPopupOpen(true);
                setIsSidebarOpen(false);
              }}
              className="logout-btn"
              style={style.widthBT}
            >
              <div className="image-container">
                <LogOut className="sidebarImage" strokeWidth={'1.6'} />
              </div>
              <span className="txt" width="14" style={style.hideSpan}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
      <LogoutPopup
        trigger={isLogoutPopupOpen}
        handleLogout={handleLogout}
        onClose={() => setIsLogoutPopupOpen(false)}
      />
      <TaskPopup
        trigger={isAddTaskPopupOpen}
        onClose={() => setIsAddTaskPopupOpen(false)}
        onAddTask={onAddTask}
        action={'add'}
      />
    </div>
  );
}

export default Sidebar;
