import React from 'react';

const TruncatedText = ({ text, wordLimit: charLimit, className , type}) => { 
  if (!text) {
    return null;
  }
  
  if (text.length <= charLimit) {
    return type === 'p' ? <p className={className}>{text}</p> : 
    <span className={className}>{text}</span>
  }
  const truncatedText = text.slice(0, charLimit) + '...';
  
  return type === 'p' ?  <p className={className}>{truncatedText}</p> : 
  <span className={className}>{truncatedText}</span>
};

export default TruncatedText;