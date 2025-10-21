import { useState, useEffect, useContext } from 'react';
import Task from './task';
import { TokenContext } from '../App';
import TaskPopup from './popups/taskPopup';

function Inbox({
  isGridClose,
  page,
  refreshTrigger,
  handleRefresh,
  searchQuery,
  setSearchQuery,
}) {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const TASK_API_BASE_URL = `${apiUrl}/tasks`;
  const token = useContext(TokenContext);
  const isDev = import.meta.env.REACT_APP_ENV === 'development';

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState(null);

  const sortTasks = (taskList) => {
    return taskList.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  const getTasks = async () => {
    setIsLoading(true);
    setError(null);
    const endpoint = `/api/tasks`;
    try {
      const response = await fetch(`${TASK_API_BASE_URL}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Check your internet connection and try again.');
      }
      const { tasks: fetchedTasks, count } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure you are connected.');
      console.error('Fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const getTasksByToday = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${TASK_API_BASE_URL}/today`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Check your internet connection and try again.');
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure you are connected.');
      console.error('Fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const getUpcomingTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${TASK_API_BASE_URL}/upcoming`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Check your internet connection and try again.');
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure you are connected.');
      console.error('Fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const onUpdateTask = async (taskData) => {
    try {
      console.log(taskData);
      const response = await fetch(`${TASK_API_BASE_URL}/${taskData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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
          ? console.log('Task updated successfully!', taskData)
          : null;
        handleRefresh();
      } else {
        console.error('Failed to update task.');
      }
      setIsUpdatePopupOpen(false);
    } catch (err) {
      console.error('Fetching error:', err);
    }
  };
  const onPinTask = async (taskId, isPinned) => {
    try {
      const response = await fetch(`${TASK_API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned }),
      });
      if (response.ok) {
        console.log('Pin status updated successfully!');
        handleRefresh();
      } else {
        console.error('Failed to update pin status.');
      }
    } catch (err) {
      console.error('Fetching error:', err);
    }
  };
  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${TASK_API_BASE_URL}/search?query=${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        },
      );
      if (!response.ok)
        throw new Error('Check your internet connection and try again.');
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to search tasks.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      if (page === 'Inbox') {
        getTasks();
      } else if (page === 'Today') {
        getTasksByToday();
      } else if (page === 'Upcoming') {
        getUpcomingTasks();
      }
    }
  }, [page, refreshTrigger, searchQuery]);

  const handleUpdateTaskPopup = (taskId) => {
    const foundTask = tasks.find((task) => task._id === taskId);
    if (foundTask) {
      setTaskDetails(foundTask);
      setIsUpdatePopupOpen(true);
    } else {
      console.error(`Task with ID ${taskId} not found.`);
    }
  };
  const style = {
    objectContainer: {
      width: isGridClose ? '700px' : '100%',
    },
  };
  return (
    <div className="mainContainer">
      <div className="objectContainer" style={style.objectContainer}>
        <TaskPopup
          key={taskDetails?._id || 'add-new-task'}
          trigger={isUpdatePopupOpen}
          onClose={() => setIsUpdatePopupOpen(false)}
          onUpdateTask={onUpdateTask}
          taskDetails={taskDetails}
          action={'update'}
        />
        <Task
          taskList={tasks}
          isLoading={isLoading}
          error={error}
          isGridClose={isGridClose}
          handleRefresh={handleRefresh}
          page={page}
          handleUpdateTaskPopup={handleUpdateTaskPopup}
          onPinTask={onPinTask}
        />
      </div>
    </div>
  );
}

export default Inbox;
