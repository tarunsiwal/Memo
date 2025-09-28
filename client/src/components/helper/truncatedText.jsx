import React from 'react';

const TruncatedText = ({ text, wordLimit, className , type}) => {
  if (!text) {
    return null;
  }
  console.log(text)
  const words = text.split(/\s+/); 
  if (words.length <= wordLimit) {
    return type === 'p' ? <p className={className}>{text}</p> : 
    <span className={className}>{text}</span>
  }
  const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
  return type === 'p' ?  <p className={className}>{truncatedText}</p> : 
  <span className={className}>{truncatedText}</span>
};

export default TruncatedText;