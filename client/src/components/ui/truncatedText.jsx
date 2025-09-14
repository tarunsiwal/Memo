import React from 'react';

const TruncatedText = ({ text, wordLimit, className }) => {
  if (!text) {
    return null;
  }
  const words = text.split(/\s+/); 
  if (words.length <= wordLimit) {
    return <span className={className}>{text}</span>;
  }
  const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
  return <span className={className}>{truncatedText}</span>;
};

export default TruncatedText;