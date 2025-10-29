import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import Spinner from './helper/spinner';
import TaskCard from './ui/taskCard';
import DeletePopup from './popups/confirmDeletePopup';
import { TextAlignCenter, User } from 'lucide-react';
import noTask from '../assets/images/message-images/noTasks.png';
import relax from '../assets/images/message-images/relax.png';
import { TokenContext, MobileContext, UserContext } from '../App';

function Tasks({
  taskList,
  isLoading,
  error,
  isGridClose,
  handleRefresh,
  handleUpdateTaskPopup,
  page,
  onPinTask,
  isUpdatePopupOpen,
}) {
  const userName = useContext(UserContext);
  const token = useContext(TokenContext);
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const isMobile = useContext(MobileContext);

  const [isdeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');

  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Item deleted successfully!');
        handleRefresh();
      } else {
        console.error('Failed to delete task.');
      }
      setIsDeletePopupOpen(false);
    } catch (err) {
      console.error('Fetching error:', err);
    }
  };
  const deletePopup = (id, title) => {
    setId(id);
    setTitle(title);
    setIsDeletePopupOpen(true);
  };
  const togglePin = (id, isCurrentlyPinned) => {
    onPinTask(id, !isCurrentlyPinned);
  };
  if (isLoading) {
    return (
      <div className="main-message-container">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="main-message-container">
        <p style={{ fontSize: '14px' }}>{error}</p>
      </div>
    );
  }
  if (!taskList || taskList.length === 0) {
    if (page === 'Today')
      return (
        <div className="main-message-container">
          <img src={relax} alt="No task" style={{ width: '' }} />
          <p>
            Zero tasks on the agenda for today! {userName}
            <br></br>
            <span>Time to relax, or add a quick win!</span>
          </p>
        </div>
      );
    return (
      <div className="main-message-container">
        <img src={noTask} alt="No task" style={{ width: '' }} />
        <p>No task available.</p>
      </div>
    );
  }
  const pinnedTasks = taskList.filter((task) => task.isPinned);
  const unpinnedTasks = taskList.filter((task) => !task.isPinned);

  const styles = {
    taskContainer: {
      // display: isGridClose ? 'block' : undefined,
      // columnCount: isGridClose
      //   ? '1'
      //   : !isMobile
      //   ? '2'
      //   : 'repeat(auto-fit, minmax(240px, 240px))',
      // columnGap: isMobile ? '0.6rem' : '1rem',

      display: isGridClose ? 'block' : 'grid',
      justifyContent: 'center',
      justifyItems: 'start',
      gridTemplateColumns: isMobile
        ? 'repeat(auto-fit, minmax(160px, 160px))'
        : 'repeat(auto-fit, minmax(240px, 240px))',
      gap: isMobile ? '0.6rem' : '1rem',
    },
    cardMenuPosition: {
      position: isGridClose && !isMobile ? 'absolute' : 'unset',
    },
    rotationStyle: {
      transform: 'rotate(90deg)',
    },
    taskCard: {
      marginLeft: isGridClose ? 'auto' : '0',
      marginRight: isGridClose ? 'auto' : '0',
    },
    gridHeading: {
      textAlign: isGridClose ? 'unset' : 'center',
    },
  };
  return (
    <div className="taskContainer sm">
      {/* Pinned Tasks Section */}
      {pinnedTasks.length > 0 && (
        <div className="pinned-tasks-section">
          <h3 className="section-title" style={styles.gridHeading}>
            Pinned Tasks
          </h3>
          <div className="pinned-tasks-grid" style={styles.taskContainer}>
            {pinnedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                togglePin={togglePin}
                deletePopup={deletePopup}
                handleUpdateTaskPopup={handleUpdateTaskPopup}
                styles={styles}
                isUpdatePopupOpen={isUpdatePopupOpen}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Tasks Section */}
      {unpinnedTasks.length > 0 && (
        <div className="other-tasks-section">
          <h3 className="section-title" style={styles.gridHeading}>
            Other Tasks
          </h3>
          <div className="other-tasks-grid" style={styles.taskContainer}>
            {unpinnedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                togglePin={togglePin}
                deletePopup={deletePopup}
                handleUpdateTaskPopup={handleUpdateTaskPopup}
                styles={styles}
                isUpdatePopupOpen={isUpdatePopupOpen}
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
  );
}

export default Tasks;
