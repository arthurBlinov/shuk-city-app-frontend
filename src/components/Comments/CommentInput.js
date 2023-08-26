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
    <div className="comment-input-container">
       <textarea
        placeholder="Write your comment..."
        value={commentDescription}
        onChange={handleDescriptionChange}
      ></textarea>
      <button onClick={handleSubmit}>Add Comment</button>
    </div>
  );
};

export default CommentInput;
