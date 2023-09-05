import React, { useState } from 'react';
import './CommentInput.css';

const CommentInput = ({ onSubmit }) => {
  const [commentDescription, setCommentDescription] = useState('');

  const handleDescriptionChange = (e) => {
    setCommentDescription(e.target.value);
  };

  const handleSubmit = () => {
    const commentData = {
      description: commentDescription,
    };

    onSubmit(commentData);

    setCommentDescription('');
  };

  return (
    <div className="comment-input-container" style={{direction: 'rtl'}}>
       <textarea
        placeholder="לכתוב קומנט..."
        value={commentDescription}
        onChange={handleDescriptionChange}
      ></textarea>
      <button onClick={handleSubmit}>להוסיף קומנט</button>
    </div>
  );
};

export default CommentInput;
