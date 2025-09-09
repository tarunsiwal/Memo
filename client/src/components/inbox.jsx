import { useState, useEffect} from 'react'
import Task from './task'


function Inbox ({isGridClose, page, refreshTrigger, handleRefresh}){
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sortTasks = (taskList) => {
    return taskList.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  const handleTaskAdded = async () => {
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
  useEffect(() => {
    handleTaskAdded();
  }, [refreshTrigger]);

  return (
    <div className='mainContainer gap-4 p-4' >
      <h2>{page}</h2>
      <hr/>
      <Task
        taskList={tasks}
        isLoading={isLoading}
        error={error}
        onTaskDeleted={handleTaskAdded}
        isGridClose={isGridClose}
        handleRefresh={handleRefresh}
      />
    </div>
  )
}

export default Inbox