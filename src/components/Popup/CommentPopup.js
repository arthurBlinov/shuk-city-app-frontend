import React, { useState } from 'react';
import './CommentPopup.css';
import axios from 'axios';

function CommentPopup({ comment, onClose, user, onCommentEdit }) {
  const isUserComment = user._id === comment.user;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(comment.title);
  const [editedDescription, setEditedDescription] = useState(comment.description);

  const handleEditComment = () => {
    setIsEditMode(true);
  };

  const handleDeleteComment = () => {
    // Handle delete comment logic
    console.log('Deleting comment:', comment._id);
  };

  const handleSaveEdit = async () => {
    // Handle save edited comment logic
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": `Bearer ${user?.token}`
      }
    };
    try {
      // Call the API to update the comment
      await axios.put(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/post/update-post/${comment?._id}`, {
        title: editedTitle,
        description: editedDescription
      }, config);

      // Update the comment in the parent component (Comments) via callback
      onCommentEdit(comment._id, editedTitle, editedDescription);

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTitle(comment.title); // Reset to original title
    setEditedDescription(comment.description); // Reset to original description
  };

  return (
    <div className="comment-popup-overlay">
      <div className="comment-popup-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {isEditMode ? (
          <>
            <input
              type="text"
              className="comment-title-edit"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="comment-content-edit"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <h2 className="comment-title">{editedTitle}</h2>
            <p className="comment-content">{editedDescription}</p>
          </>
        )}
        {isUserComment && (
          <div className="comment-actions">
            {isEditMode ? (
              <>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <button onClick={handleEditComment}>Edit</button>
            )}
            <button onClick={handleDeleteComment}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentPopup;



