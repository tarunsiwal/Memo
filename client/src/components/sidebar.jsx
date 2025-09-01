import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import '../assets/css/sidebar.css'

import DynamicCalendarIcon from "./helper/dynamicCalendarIcon"
import widget from '../assets/images/svg/widget.svg'
import magnifier from '../assets/images/svg/magnifer.svg'
import inbox from '../assets/images/svg/inbox.svg'
import calenderUpcoming from '../assets/images/svg/calendar-upcoming.svg'
import sidebar from '../assets/images/svg/sidebar.svg'
import profile from '../assets/images/svg/profile.jpg'
import add from '../assets/images/svg/add.svg'
import Popup from "./popup";

function Sidebar() {
  const uselocation = useLocation()
  const [closeSidebar, setCloseSidebar] = useState(false);

  const handleSearchClick = () => {
      console.log("Search clicked!");
      alert("clicked")
  };
  const handleCloseSidebar = () => {
      setCloseSidebar(!closeSidebar)
  };
  return (
    <div className={closeSidebar === false ? 'sideBar': 'sideBar active'}>
      <div className='profileToggleContainer'>
        <div className='profile'>
          <img src={profile} alt='profile' className='profileImage'></img>
          <span>Tarun</span>
        </div>
        <a onClick={handleCloseSidebar}>
          <img src={sidebar} alt='sidebar' className='sidebarImage'></img>
        </a>
      </div>
      <div className="sideBarMenu">
        <ul>
          <li className='active'>
          <a onClick={handleSearchClick}>
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
    </div>
  );
}

export default Sidebar;