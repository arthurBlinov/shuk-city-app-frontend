import React, { useState } from 'react';
import './CommentPopup.css';
import axios from 'axios';
import baseUrl from '../../utils/baseURL';
function CommentPopup({ comment, onClose, user, onCommentEdit }) {
  const isUserComment = user._id === comment.user;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDescription, setEditedDescription] = useState(comment.description);

  const handleEditComment = () => {
    setIsEditMode(true);
  };

  const handleDeleteComment = () => {
    console.log('Deleting comment:', comment._id);
  };

  const handleSaveEdit = async () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Accept": "application/json",
        "Authorization": `Bearer ${user?.token}`
      }
    };
    try {
      // Call the API to update the comment
      await axios.put(`${baseUrl}/netcraft/post/update-post/${comment?._id}`, {
        description: editedDescription
      }, config);

      onCommentEdit(comment._id, editedDescription);

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedDescription(comment.description); 
  };

  return (
    <div className="comment-popup-overlay">
      <div className="comment-popup-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {isEditMode ? (
          <>
           
            <textarea
              className="comment-content-edit"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          </>
        ) : (
          <>
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



