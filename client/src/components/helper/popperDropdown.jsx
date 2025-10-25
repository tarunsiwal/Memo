import React, { useEffect } from 'react';
import { createPopper } from '@popperjs/core';

function PopperDropdown({
  containerRef,
  btnRef,
  dropdownRef,
  isOpen,
  setIsOpen,
  content,
}) {
  // --- POPPER.JS EFFECT (Dropdown Positioning and Autoadjust) ---
  useEffect(() => {
    let popperInstance = null;
    if (isOpen && btnRef.current && dropdownRef.current) {
      popperInstance = createPopper(btnRef.current, dropdownRef.current, {
        placement: 'bottom-start',
        modifiers: [
          { name: 'offset', options: { offset: [0, 8] } },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top-start', 'right-start', 'left-start'],
            },
          },
          { name: 'preventOverflow', options: { padding: 8 } },
        ],
      });
    }

    return () => {
      popperInstance?.destroy();
    };
  }, [isOpen, btnRef, dropdownRef]);

  // --- OUT-CLICK EFFECT ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, containerRef, setIsOpen]);

  return <>{content}</>;
}

export default PopperDropdown;
