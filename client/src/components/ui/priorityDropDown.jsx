import { useState, useRef } from "react";

const PriorityDropdown = ({ priority, onPriorityChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (value) => {
        onPriorityChange(value);
        setIsOpen(false);
    };

    const flagSVG = (p) => {
        let flagColor;
        if (p === 1) flagColor = 'red';
        else if (p === 2) flagColor = 'yellow';
        else if (p === 3) flagColor = 'green';
        else flagColor = 'gray';

        return (
            <svg viewBox="0 0 24 24" style={{ width: '1em' }} fill={flagColor} xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M5 22V14M5 14V4M5 14L7.47067 13.5059C9.1212 13.1758 10.8321 13.3328 12.3949 13.958C14.0885 14.6354 15.9524 14.7619 17.722 14.3195L17.9364 14.2659C18.5615 14.1096 19 13.548 19 12.9037V5.53669C19 4.75613 18.2665 4.18339 17.5092 4.3727C15.878 4.78051 14.1597 4.66389 12.5986 4.03943L12.3949 3.95797C10.8321 3.33284 9.1212 3.17576 7.47067 3.50587L5 4M5 4V2" stroke={flagColor === 'gray' ? '#000' : flagColor} strokeWidth="1.5" strokeLinecap="round"></path>
                </g>
            </svg>
        );
    };

    const options = [
        { value: 1, label: 'Priority 1' },
        { value: 2, label: 'Priority 2' },
        { value: 3, label: 'Priority 3' },
        { value: 4, label: 'Priority 4' },
    ];

    const selectedOption = options.find(opt => opt.value === priority);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                className="w-full text-left p-2 border border-gray-300 rounded-md bg-white flex items-center justify-between"
                onClick={toggleDropdown}
            >
                <span className="flex items-center gap-2">
                    {flagSVG(priority)}
                    {selectedOption ? selectedOption.label : 'Select Priority'}
                </span>
                <svg className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {flagSVG(option.value)}
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PriorityDropdown;