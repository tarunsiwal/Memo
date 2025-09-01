
function Popup({ type, data, onClose }) {
  let content = null;

  switch (type) {
    case 'addTask':
      title = 'Add New Task';
      content = 
       <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="text-area"
              placeholder={placeholderText}
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="text-area"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3" // This sets the initial visible height
              required
            />
          </div>
          <div className="popup-btn">
            <div className="task-dueDate-Priority">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                name="event-date"
              ></input>
              <select
                className="btn"
                value={priority}
                onChange={(e) => setPriority(e.target.priority)}
              >
                {/* <option value="1">Priority</option> */}
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                      color={priorityColors[priority]}
                  </option>
                ))}
              </select>
            </div>
            <div className="submit-btn">
              <button className="btn submit" type="submit">
                Add task
              </button>
              <button
                className="btn cancel"
                type="button"
                onClick={handleCloseAndClear}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      break;
    case 'updateTask':
      title = 'Update Task';
      content = <p>Form to update task "{data?.name}" will go here.</p>;
      break;
    case 'alert':
      title = 'Alert Message';
      content = <p>Your alert message goes here.</p>;
      break;
    case 'deleteTask':
      title = 'Confirm Deletion';
      content = <p>Are you sure you want to delete this task?</p>;
      break;
    default:
      title = 'Popup';
      content = <p>Default content.</p>;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onAddTask({ title, description, dueDate, priority });
      console.log("Task submitted:", { title, description, dueDate, priority });
      setTitle(""); 
      setDescription("");
      setDueDate("");
      setPriority("");
    }
    onClose();
  };
  const handleCloseAndClear = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    onClose();
  };
  return (
    <div className="popup-container">
      <div className="popup">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 text-3xl leading-none">&times;</button>
      </div>
    </div>
  );
}

export default Popup