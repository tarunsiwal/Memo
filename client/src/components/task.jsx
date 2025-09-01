import React from "react";
import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import MenuDot from "../assets/images/svg/menu-dots.svg"

function Tasks({ taskList, isLoading, error, onTaskDeleted }) {
 const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Item deleted successfully!");
        if (onTaskDeleted) {
          onTaskDeleted();
        }
      } else {
        console.error("Failed to delete task.");
      }
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };
  const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
  // Check for loading or error state first to prevent rendering issues.
  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Check if taskList is empty before trying to map over it.
  if (!taskList || taskList.length === 0) {
    return <p>No tasks found.</p>;
  }
   const rotationStyle = { transform: 'rotate(90deg)' };
  return (
    <div className="flex flex-col gap-4 p-4">
      {taskList.map((task) => {
        const dateObject = new Date(task.dueDate);
        const localizedDate =
          dateObject instanceof Date && !isNaN(dateObject)
            ? dateObject.toLocaleDateString()
            : null;

        return (
          <Container key={task._id} className="container-sm border rounded-lg shadow-md p-4 space-y-2 tasks-card">
            <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
            <p className="text-sm text-gray-600 italic">{task.description}</p>
            {localizedDate && (
              <div className="text-sm text-gray-600 flex items-center space-x-2 d-flex gap-1">
                <svg className="h-4 w-4 text-gray-500" width="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M7 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M17 4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="16.5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2.5 9H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>{localizedDate}</span>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-1 text-end">
              <img src={MenuDot} alt='menuDots' className='sidebarImage' style={rotationStyle}></img>
            </div>
          </Container>
        );
      })}
    </div>
  );
}

export default Tasks;
