import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Comments.css';
import axios from 'axios';
import { useUserContext } from '../User/UserContext';
import CommentPopup from '../Popup/CommentPopup';
import CommentInput from './CommentInput';
function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState(null);
  const user = useUserContext();
  const [selectedComment, setSelectedComment] = useState(null);
  const [forImages, setForImages] = useState([])
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
  useEffect(() => {
    fetchData();
  }, [id]);
  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
  };

  const handleCloseCommentPopup = () => {
    setSelectedComment(null);
  };

  const handleCommentEdit = (commentId, editedDescription) => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            description: editedDescription
          };
        }
        return comment;
      })
    );
  };

  if (!comments) {
    return null; 
  }
  const handleAddComment = async (commentData) => {
    try {
        await axios.post(
          `https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/post/create-post/${id}`,
          {
            description:commentData?.description,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              "Accept": 'application/json',
              "Authorization": `Bearer ${user?.user.token}`
  
            }
          }
        )
          
      
      fetchData();

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  return (
    <div className="comment-popup-overlay">
      <div className="comment-popup-content">
        <button className="close-button">
          <Link to="/" className="link">
            Back to Categories
          </Link>
        </button>
      <CommentInput onSubmit={handleAddComment} />

        <ul className="comments-list">
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
                <li className="comment" onClick={() => handleCommentClick(comment)}>
                  
                  {comment?.description}
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


