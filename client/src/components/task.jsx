import React from "react";
import { useState, useEffect, useRef } from "react";
import Spinner from "./helper/spinner"
import TaskCard from "./ui/taskCard";
import DeletePopup from "./popups/confirmDeletePopup"
import { TextAlignCenter } from "lucide-react";

function Tasks({  taskList, 
                  isLoading, 
                  error, 
                  isGridClose, 
                  handleRefresh, 
                  handleUpdateTaskPopup, 
                  page, 
                  onPinTask,}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const [isdeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');

  const popupRef = useRef(null);

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
  const togglePin = (id, isCurrentlyPinned) => {
    onPinTask(id, !isCurrentlyPinned);
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
  const pinnedTasks = taskList.filter(task => task.isPinned);
  const unpinnedTasks = taskList.filter(task => !task.isPinned);

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
    rotationStyle : {
      transform: 'rotate(90deg)' 
    },
    taskCard : { 
      marginLeft: isGridClose ? 'auto' : '0',
      marginRight: isGridClose ? 'auto' : '0',
    },
    gridHeading : {
      textAlign: isGridClose ? 'unset' : 'center'
    }
  };
  return (
    <div className='taskContainer sm' >
    {/* Pinned Tasks Section */}
    {pinnedTasks.length > 0 && (
      <div className="pinned-tasks-section" >
        <h3 className="section-title" style={styles.gridHeading}>Pinned Tasks</h3>
        <div className="pinned-tasks-grid" style={styles.taskContainer}>
          {pinnedTasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              togglePin={togglePin} 
              deletePopup={deletePopup} 
              handleUpdateTaskPopup={handleUpdateTaskPopup} 
              styles={styles}
            />
          ))}
        </div>
      </div>
    )}

    {/* Other Tasks Section */}
    {unpinnedTasks.length > 0 && (
      <div className="other-tasks-section">
        <h3 className="section-title" style={styles.gridHeading}>Other Tasks</h3>
        <div className="other-tasks-grid" style={styles.taskContainer}>
          {unpinnedTasks.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              togglePin={togglePin} 
              deletePopup={deletePopup} 
              handleUpdateTaskPopup={handleUpdateTaskPopup} 
              styles={styles} 
            />
          ))}
        </div>
      </div>
    )}
    <DeletePopup
          trigger={isdeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)} 
          title={title}
          deleteTask={handleDelete}
        />
  </div>
  );}

export default Tasks;
