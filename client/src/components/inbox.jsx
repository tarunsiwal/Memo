import { useState, useEffect} from 'react'
import Task from './task'
import UpdateTaskPopup from './popups/updateTaskPopup';
import cross from '../assets/images/svg/cross.svg'


function Inbox ({isGridClose, page, refreshTrigger, handleRefresh, searchQuery, setSearchQuery}){
  const apiUrl = import.meta.env.VITE_APP_API_URL;
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
    try {
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to fetch tasks. Please ensure you are connected.");
      console.error("Fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const getTasksByToday = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks/today`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to fetch tasks. Please ensure you are connected.");
      console.error("Fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const getUpcomingTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks/upcoming`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to fetch tasks. Please ensure you are connected.");
      console.error("Fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const onUpdateTask = async (taskData) => {
    try{
      const response = await fetch(`${apiUrl}/tasks/${taskData.id}`, {
        method : "PUT",
        headers : {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          labels: taskData.labels,
          priority: taskData.priority,
        }),
      });
      if(response.ok){
        console.log('Task updated successfully!')
        handleRefresh();
      } else {
        console.error("Failed to update task.")
      }
      setIsUpdatePopupOpen(false)
    } catch (err){
        console.error("Fetching error:",err)
    }
  };
  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/search?query=${query}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const {tasks: fetchedTasks} = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
    } catch (err) {
      setError("Failed to search tasks.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(searchQuery){
      handleSearch(searchQuery);
    }else{
      if (page === 'Inbox') {
        getTasks();
      } else if (page === 'Today') {
        getTasksByToday();
      } else if (page === 'Upcoming') {
        getUpcomingTasks();
      }
  }}, [page, refreshTrigger, searchQuery]);

  const handleUpdateTaskPopup = (taskId) => {
    const foundTask = tasks.find(task => task._id === taskId);
    if (foundTask) {
      setTaskDetails(foundTask)
      console.log(foundTask);
      setIsUpdatePopupOpen(true);
    } else {
      console.error(`Task with ID ${taskId} not found.`);
    }
  };
  const handleClearSearch = () => {
    setSearchQuery(''); // This triggers the useEffect below
  };

  const style = {
    objectContainer : {
      width: isGridClose ? '700px' : '100%',
    }
  }
  return (
    <div className='mainContainer'>
      <div className='objectContainer' style={style.objectContainer}>
        {/* <h2>{page}</h2> */}
        {/* {searchQuery && (
          <div className="search-tag">
            <span> Searching for: "{searchQuery}"</span>
            <a className="btn-submit" onClick={handleClearSearch}>
              <img style={{width:'1em'}} src={cross}></img>
            </a>
          </div>
        )} */}
        {/* <hr/> */}
        <UpdateTaskPopup 
          trigger={isUpdatePopupOpen}
          onClose={() => setIsUpdatePopupOpen(false)} 
          onUpdateTask={onUpdateTask}
          taskDetails={taskDetails}
        />
        <Task
          taskList={tasks}
          isLoading={isLoading}
          error={error}
          isGridClose={isGridClose}
          handleRefresh={handleRefresh}
          page={page}
          handleUpdateTaskPopup={handleUpdateTaskPopup}
        />
      </div>
    </div>
  )
}

export default Inbox