import React from 'react';

const TruncatedText = ({ text, wordLimit, className }) => {
  console.log(className.typeOf)
  if (!text) {
    return null;
  }
  const words = text.split(/\s+/); 
  if (words.length <= wordLimit) {
    return <p className={className}>{text}</p>;
  }
  const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
  return <p className={className}>{truncatedText}</p>;
};

export default TruncatedText;