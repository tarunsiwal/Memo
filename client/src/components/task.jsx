import React from "react";
import { Container } from "react-bootstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import { useState, useEffect } from "react";

import MenuDot from "../assets/images/svg/menu-dots.svg"
import LabelTag from "../assets/images/svg/tag.svg"
import Spinner from "./helper/spinner"
import DeletePopup from "./popups/confirmDeletePopup"
import TruncatedText from "./ui/truncatedText"

function Tasks({ taskList, isLoading, error, isGridClose, handleRefresh, handleUpdateTaskPopup, page }) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const [isdeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');


  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Item deleted successfully!");
        handleRefresh();
      } else {
        console.error("Failed to delete task.");
      }
      setIsDeletePopupOpen(false)
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };
  const deletePopup = (id, title) => {
    setId(id)
    setTitle(title)
    setIsDeletePopupOpen(true)
  };
  if (isLoading) {
    return (<div className='mainContainer gap-4 p-4'>
      <Spinner/>
      </div>)
  };
  if (error) {
    return (<div className='mainContainer gap-4 p-4'>
      <p>Error: {error.message}</p>
      </div>)
  };
  if (!taskList || taskList.length === 0) {
    if(page === 'Today') return <p>No task for today.</p>;
    return <p>Please add Tasks.</p>;
  };

  const styles = {
    taskContainer: {
      display: isGridClose ? 'block' : 'grid',
      justifyContent: 'center',
      justifyItems: 'start', 
      gridTemplateColumns: `repeat(auto-fit, minmax(240px, 240px))`,
      gap: '1rem', 
    },
    cardMenuPosition: {
      position: isGridClose ? 'absolute' : 'unset'
    },
    cardDisplayItemPosition: {
      display: isGridClose ? 'flex' : 'block'
    },
    rotationStyle : {
      transform: 'rotate(90deg)' 
    },
    taskCard : { 
      marginLeft: isGridClose ? 'auto' : '0',
      marginRight: isGridClose ? 'auto' : '0',
    }
  };
  return (
      <div className='taskContainer sm' style={styles.taskContainer}>
        {taskList.map((task) => {
          const hasDueDate = task.dueDate && task.dueDate.trim().length > 0;
          const localizedDate = hasDueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : null;
          let flag = 'none'
          if(task.priority === 3) flag = '#198754'
          else if(task.priority === 2) flag = '#ffec2e'
          else if(task.priority === 1) flag = '#de1313ff'
          return (
            <Container key={task._id} 
            className="tasks-card  rounded-lg shadow-md p-4 space-y-2" style={styles.taskCard}>
              <p className="title text-xl font-bold text-gray-800">{task.title}</p>
              <TruncatedText className={"description text-sm  italic"} text={task.description} wordLimit={30}/>
                <div className="cardProperties text-sm  flex items-center space-x-2  gap-3" style={styles.cardDisplayItemPosition}>
                  {localizedDate && (
                  <div className="dueDate text-sm  flex items-center space-x-2 d-flex">
                    <svg className="h-4 w-4 text-gray-500" width="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" /><path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M2.5 9H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>{localizedDate}</span>
                  </div>
                  )}
                  <div className="priority text-sm  flex items-center space-x-2 d-flex">
                    <span>Priority {task.priority} 
                      <svg viewBox="0 0 24 24" style={{width:'1em'}} fill={flag} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke={flag==='none'? '#000' : flag} strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
                    </span>
                  </div>
                  <div className="d-flex">
                    {task.label}
                  </div>  
                </div>
              <div className="btnContainer flex justify-end gap-2 mt-1 text-end" style={styles.cardMenuPosition}>
                <div className="taskInfo">
                </div>
                <button className="btn">
                  <img src={LabelTag} alt='label' className="sidebarImage" style={{rotate:'180deg'}}></img>
                </button>
                <Dropdown>
                  <Dropdown.Toggle  id="task-menu">
                    <img src={MenuDot} alt='menuDots' className='sidebarImage' style={styles.rotationStyle}></img>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                      handleUpdateTaskPopup(task._id);
                      }}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => {
                      deletePopup(task._id, task.title)
                      }}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Container>
          );
        })}
        <DeletePopup
          trigger={isdeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)} 
          title={title}
          deleteTask={handleDelete}
        />
      </div>
  );
}

export default Tasks;
