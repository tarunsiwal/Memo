import React, { useRef } from 'react';
import { useState, useContext } from 'react';
import TruncatedText from '../helper/truncatedText';
import { MobileContext } from '../../App';

import {
  Trash2,
  Pencil,
  Palette,
  Tag,
  EllipsisVertical,
  Pin,
  CalendarFold,
  Flag,
} from 'lucide-react';
import PopperDropdown from '../helper/popperDropdown';

function TaskCard({
  task,
  deletePopup,
  togglePin,
  handleUpdateTaskPopup,
  styles,
}) {
  const taskDropdownContainerRef = useRef(null);
  const taskMenuBtnRef = useRef(null);
  const taskDropdownRef = useRef(null);

  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [isTaskUtilMenuOpen, setisTaskUtilMenuOpen] = useState(false);

  const isMobile = useContext(MobileContext);
  const hasDueDate = task.dueDate && task.dueDate.trim().length > 0;
  const localizedDate = hasDueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  let flag = '#4e4e4e';
  let fill = 'none';
  if (task.priority === 3) flag = 'green' && (fill = 'green');
  else if (task.priority === 2) flag = '#ffec2e' && (fill = '#ffec2e');
  else if (task.priority === 1) flag = 'red' && (fill = 'red');

  const handleUtilMenuToggle = () => {
    setisTaskUtilMenuOpen(!isTaskUtilMenuOpen);
  };

  return (
    <div
      key={task._id}
      className="task-card container "
      style={{ ...styles.taskCard, backgroundColor: task.cardColor }}
      onMouseEnter={() => setHoveredCardId(task._id)}
      onMouseLeave={() => setHoveredCardId(null)}
    >
      {(isMobile || task.isPinned || hoveredCardId === task._id) && (
        <div
          className={`pin ${task.isPinned ? 'pinned' : ''}`}
          onClick={() => togglePin(task._id, task.isPinned)}
        >
          <Pin fill={task.isPinned ? '#4e4e4e' : 'none'} />
        </div>
      )}
      <TruncatedText
        className={'title'}
        text={task.title}
        wordLimit={25}
        type={'p'}
      />
      <TruncatedText
        className={'description'}
        text={task.description}
        wordLimit={100}
        type={'span'}
      />
      <div className="cardProperties">
        {localizedDate && (
          <div
            className="dueDate"
            style={{
              color:
                task.cardColor === '#ffffff' || task.cardColor === '#f3f3f3'
                  ? '#ff9a00'
                  : '#4e4e4e',
            }}
          >
            <CalendarFold width={'1em'} height={'1em'} />
            <span> {localizedDate}</span>
          </div>
        )}
        <div className="priority">
          <span>
            Priority {task.priority}
            <Flag color={flag} width={'1em'} height={'1em'} fill={fill} />
          </span>
        </div>
        <div className="d-flex">
          <div className="label-tag-container">
            {task.labels.map((label, index) => (
              <div key={index} className="label-tag">
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <PopperDropdown
        containerRef={taskDropdownContainerRef}
        btnRef={taskMenuBtnRef}
        dropdownRef={taskDropdownRef}
        isOpen={isTaskUtilMenuOpen}
        setIsOpen={setisTaskUtilMenuOpen}
        content={
          <div
            className="menuBtnContainer"
            style={styles.cardMenuPosition}
            ref={taskDropdownContainerRef}
          >
            <button
              onClick={handleUtilMenuToggle}
              id="task-btn"
              className="btn"
              ref={taskMenuBtnRef}
            >
              <EllipsisVertical color={'#2d2d2dff'} />
            </button>
            {isTaskUtilMenuOpen ? (
              <ul className="task-dropdown-menu" ref={taskDropdownRef}>
                <li onClick={() => handleUpdateTaskPopup(task._id)}>
                  <Pencil /> Edit
                </li>
                <hr style={{ margin: '0' }} />
                <li onClick={() => deletePopup(task._id, task.title)}>
                  <Trash2 color="#ff0000ff" />
                  <span style={{ color: '#ff0000ff' }}> Delete</span>
                </li>
              </ul>
            ) : null}
          </div>
        }
      />
    </div>
  );
}

export default TaskCard;
