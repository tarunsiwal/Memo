// src/components/TaskCard.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
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

function TaskCard({
  task,
  deletePopup,
  togglePin,
  handleUpdateTaskPopup,
  styles,
}) {
  const [hoveredCardId, setHoveredCardId] = useState(null);

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

  return (
    <Container
      key={task._id}
      className="task-card rounded-lg shadow-md p-4 space-y-2"
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
        className={'title text-xl font-bold text-gray-800'}
        text={task.title}
        wordLimit={25}
        type={'p'}
      />
      <TruncatedText
        className={'description text-sm  italic mb-0'}
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
      <div className="menuBtnContainer" style={styles.cardMenuPosition}>
        <Dropdown>
          <Dropdown.Toggle id="task-btn" className="btn">
            <EllipsisVertical color={'#2d2d2dff'} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleUpdateTaskPopup(task._id)}>
              <Pencil /> Edit
            </Dropdown.Item>
            <hr style={{ margin: '0' }} />
            <Dropdown.Item onClick={() => deletePopup(task._id, task.title)}>
              <Trash2 color="#ff0000ff" />
              <span style={{ color: '#ff0000ff' }}> Delete</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Container>
  );
}

export default TaskCard;
