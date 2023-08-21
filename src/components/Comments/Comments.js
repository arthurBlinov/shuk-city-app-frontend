import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Comments.css';
import axios from 'axios';
import { useUserContext } from '../User/UserContext';
import CommentPopup from '../Popup/CommentPopup';

function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState(null);
  const user = useUserContext();
  const [selectedComment, setSelectedComment] = useState(null);
  const [forImages, setForImages] = useState([])
  useEffect(() => {
    // Fetch the category data and comments based on id
    const fetchData = async () => {
      try {
        const commentsResponse = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/fetch-category/${id}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json",
            "Authorization": `Bearer ${user?.user?.token}`
          }
        });
    
        const imagesResponse = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/fetch-users-of-posts-cat/${id}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Accept": "application/json",
            "Authorization": `Bearer ${user?.user?.token}`
          }
        });
        setComments(commentsResponse?.data?.posts)
        setForImages(imagesResponse?.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    fetchData();
  }, [id]);
  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
  };

  const handleCloseCommentPopup = () => {
    setSelectedComment(null);
  };

  const handleCommentEdit = (commentId, editedTitle, editedDescription) => {
    // Update the comments list with the edited comment
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            title: editedTitle,
            description: editedDescription
          };
        }
        return comment;
      })
    );
  };

  if (!comments) {
    return null; // Handle loading or error state
  }

  return (
    <div className="comments-popup-overlay">
      <div className="comments-popup-content">
        <button className="close-button">
          <Link to="/" className="link">
            Back to Categories
          </Link>
        </button>
        <ul className="comment-list">
          {comments?.map((comment) => {
            const commentUser = forImages.find(user => user._id === comment.user);
            return (
              <div key={comment?._id}>
                <div className="comment-header">
                  {comment?.user === user?.user?._id ? (
                    <p className="user-name">My Comment</p>
                  ) : (
                    <div className="user-profile">
                      <img
                        src={commentUser?.profilePhoto}
                        alt="User Photo"
                        className="user-profile-photo"
                      />
                      <p>{commentUser?.name}</p>
                    </div>
                  )}
                </div>
                <p>{comment?.title}</p>
                <li className="comment" onClick={() => handleCommentClick(comment)}>
                  {comment.description}
                </li>
              </div>
            );
          })}
        </ul>
      </div>
      {selectedComment && (
        <CommentPopup
          comment={selectedComment}
          user={user.user}
          onClose={handleCloseCommentPopup}
          onCommentEdit={handleCommentEdit}
        />
      )}
    </div>
  );
}

export default Comments;


