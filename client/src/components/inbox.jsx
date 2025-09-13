import { useState, useEffect} from 'react'
import Task from './task'
import UpdateTaskPopup from './popups/updateTaskPopup';


function Inbox ({isGridClose, page, refreshTrigger, handleRefresh}){
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
  }
  
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
  return (
    <div className='mainContainer gap-4 p-4' >
      <h2>{page}</h2>
      <hr/>
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
        onTaskDeleted={handleTaskAdded}
        isGridClose={isGridClose}
        handleRefresh={handleRefresh}
        handleUpdateTaskPopup={handleUpdateTaskPopup}
      />
    </div>
  )
}

export default Inbox