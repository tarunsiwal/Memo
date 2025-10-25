import { useState, useRef, useEffect } from 'react';
import '../../assets/css/priority.css';
import { Flag } from 'lucide-react';
import PopperDropdown from '../helper/popperDropdown';

const PriorityDropdown = ({ priority, onPriorityChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const propertyBtnRef = useRef(null);
  const propertyDropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (value) => {
    onPriorityChange(value);
    setIsOpen(false);
  };
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

  const options = [
    { value: 1, label: 'Priority 1' },
    { value: 2, label: 'Priority 2' },
    { value: 3, label: 'Priority 3' },
    { value: 4, label: 'Priority 4' },
  ];

  return (
    <PopperDropdown
      containerRef={dropdownRef}
      btnRef={propertyBtnRef}
      dropdownRef={propertyDropdownRef}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      content={
        <div className="" ref={dropdownRef}>
          <button
            type="button"
            className="btn"
            id="task-btn"
            onClick={toggleDropdown}
            ref={propertyBtnRef}
          >
            <span className="flex items-center gap-2">
              {renderFlag(priority)}
            </span>
          </button>
          {isOpen && (
            <div className="priority-list-container" ref={propertyDropdownRef}>
              <ul className="">
                {options.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {renderFlag(option.value, 'list')}
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    />
  );
};

export default PriorityDropdown;
