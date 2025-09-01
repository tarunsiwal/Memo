import { useState, useEffect} from 'react'
import Task from '../components/task'


function Inbox (){
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavActive, setIsNavActive] = useState(true);

  const sortTasks = (taskList) => {
    return taskList.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  
  const refreshTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/tasks`);
      if (!response.ok) {
        // console.log(response)
        throw new Error("Network response was not ok");
      }
      const { tasks: fetchedTasks } = await response.json();
      const sortedTasks = sortTasks(fetchedTasks);
      setTasks(sortedTasks);
      // console.log(sortedTasks)
    } catch (err) {
      setError("Failed to fetch tasks. Please ensure you are connected.");
      console.error("Fetching error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    refreshTasks();
  }, []);

  return (
      <Task
        taskList={tasks}
        isLoading={isLoading}
        error={error}
        onTaskDeleted={refreshTasks}
      />
  )
}

export default Inbox