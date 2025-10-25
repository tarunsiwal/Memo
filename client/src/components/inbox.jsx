import { useState, useEffect, useContext, useCallback } from 'react';
import Task from './task';
import { TokenContext } from '../App';
import TaskPopup from './popups/taskPopup';
import { Flag } from 'lucide-react';
import '../App.css';

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
  // filter states
  const [labels, setLabels] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(0);

  const sortTasks = (taskList) => {
    return taskList.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const onUpdateTask = async (taskData) => {
    try {
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
  const fetchTasksWithFilters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams();
    let fetchURL = '';
    const hasStructuredFilters =
      selectedColor || selectedPriority > 0 || selectedLabels.length > 0;
    const hasAnyFilter = searchQuery || hasStructuredFilters;

    if (searchQuery) {
      params.append('query', searchQuery);
    }

    if (page === 'Today') {
      fetchURL = `${TASK_API_BASE_URL}/today`;
    } else if (page === 'Upcoming') {
      fetchURL = `${TASK_API_BASE_URL}/upcoming`;
    } else {
      if (page === 'FilterLabels' || hasStructuredFilters) {
        if (selectedColor) {
          params.append('color', selectedColor);
        }
        if (selectedPriority > 0) {
          params.append('priority', selectedPriority.toString());
        }
        if (selectedLabels && selectedLabels.length > 0) {
          params.append('labels', selectedLabels.join(','));
        }
      }
      if (hasAnyFilter) {
        fetchURL = `${TASK_API_BASE_URL}/search`;
      } else {
        fetchURL = `${TASK_API_BASE_URL}`;
      }
    }
    const queryString = params.toString();

    const finalFetchURL = `${fetchURL}${queryString ? '?' + queryString : ''}`;

    try {
      const response = await fetch(finalFetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Failed response status:', response.status);
        throw new Error('Check your internet connection and try again.');
      }

      const responseData = await response.json();
      const { tasks: fetchedTasks } = responseData;

      const sortedTasks = sortTasks(fetchedTasks || []);
      setTasks(sortedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please ensure you are connected.');
      console.error('Fetching error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    token,
    page,
    searchQuery,
    selectedColor,
    selectedLabels,
    selectedPriority,
    TASK_API_BASE_URL,
  ]);

  useEffect(() => {
    fetchTasksWithFilters();
  }, [fetchTasksWithFilters, refreshTrigger]);

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

  const COLOR_PALETTE = [
    '#fdfbd5',
    '#f9a6a6',
    '#ffb885ff',
    '#b1cbf2',
    '#c2ebbc',
    '#19cbf1',
    '#ff8bf8',
    '#d7ff87',
    '#f3f3f3',
    '#ffffff',
  ];

  const handleColorSelect = useCallback((c) => {
    setSelectedColor((prev) => (prev === c ? '' : c));
  });

  const handlePrioritySelect = useCallback((p) => {
    setSelectedPriority((prev) => (prev === p ? 0 : p));
  });

  const handleLabelSelect = useCallback(
    (labelName) => {
      setSelectedLabels((prev) => {
        if (prev.includes(labelName)) {
          return prev.filter((l) => l !== labelName);
        } else {
          return [...prev, labelName];
        }
      });
    },
    [selectedLabels],
  );

  const getLabels = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/user/labels/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch labels with status: ${response.status}`,
        );
      }
      const responseData = await response.json();
      let fetchedLabels = responseData.userLabels;

      const sortedLabels = fetchedLabels.sort((a, b) =>
        a.label.localeCompare(b.label),
      );

      setLabels(sortedLabels);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token, apiUrl]);

  useEffect(() => {
    getLabels();
  }, [getLabels]);

  const getFlagColor = (p) => {
    switch (p) {
      case 1:
        return 'red';
      case 2:
        return '#ffec2e';
      case 3:
        return 'green';
      default:
        return '#4e4e4e';
    }
  };

  const renderFlag = (value, render) => {
    const color = getFlagColor(value);
    return (
      <Flag
        color={color}
        width={'16px'}
        fill={render === 'list' ? 'none' : color === '#4e4e4e' ? 'none' : color}
      />
    );
  };

  const options = [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }];

  return (
    <div className="mainContainer">
      <div
        className={
          page === 'FilterLabels'
            ? 'objectContainer filterLabels'
            : 'objectContainer'
        }
        style={style.objectContainer}
      >
        {/* handel search filter based */}
        {page === 'FilterLabels' ? (
          <>
            <h6 className="">Color</h6>
            <div className="color-picker-parent-container">
              <div className="color-picker-container">
                {COLOR_PALETTE.map((c) => (
                  <div
                    key={c}
                    className="color-swatch"
                    style={{
                      backgroundColor: c,
                      // Check against the new state variable: selectedColor
                      border:
                        c === selectedColor
                          ? '3px solid #3b82f6'
                          : '2px solid #d1d5db',
                    }}
                    onClick={() => handleColorSelect(c)} // FIX: calling the defined function
                  ></div>
                ))}
              </div>
            </div>
            <hr />
            <div className="select-priority-container">
              <h6 className="">Priorty</h6>
              <ul className="">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handlePrioritySelect(option.value)}
                    className={
                      option.value === selectedPriority ? 'active' : ''
                    }
                  >
                    {renderFlag(option.value, 'list')}
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <h6 className="">Labels</h6>
            {isLoading ? (
              <div className="message-container">Loading labels...</div>
            ) : labels.length === 0 ? (
              <div className="message-container">No labels found.</div>
            ) : (
              <div className="labels-list">
                <ul>
                  {labels.map((label) => (
                    <li
                      key={label._id}
                      onClick={() => handleLabelSelect(label.label)}
                      className={
                        selectedLabels.includes(label.label) ? 'active' : ''
                      }
                    >
                      {label.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}

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
