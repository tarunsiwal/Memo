import React, { useEffect, useCallback, useContext, useState } from 'react';
import { TokenContext } from '../App';
import { Flag } from 'lucide-react';
function FilterLabels() {
  const apiUrl = import.meta.env.VITE_APP_API_URL;
  const token = useContext(TokenContext);

  const [isLoading, setIsLoading] = useState(false);
  const [labels, setLabels] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(0);

  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

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
  }, []);

  const handlePrioritySelect = useCallback((p) => {
    setSelectedPriority((prev) => (prev === p ? 0 : p));
  }, []);

  const handleLabelSelect = useCallback((labelName) => {
    setSelectedLabels((prev) => {
      if (prev.includes(labelName)) {
        return prev.filter((l) => l !== labelName);
      } else {
        return [...prev, labelName];
      }
    });
  }, []);
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
      <div className="objectContainer filterLabels ">
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
                >
                  {label.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>result</div>
      </div>
    </div>
  );
}

export default FilterLabels;
