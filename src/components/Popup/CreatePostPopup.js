import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUserContext } from '../User/UserContext';
import { useCategoryContext } from '../Categories/CategoryContext';
const CreatePostPopup = ({ open, handleClose }) => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState({});
  const theUser = useUserContext();
  const {updateCategories} = useCategoryContext()
  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };

  const handleCreatePost = async() => {
     
    try {
        if(selectedFile){
            await axios.post(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/create-category`,
           {title: postTitle,
            description: postContent,
            image: selectedFile
        }
        , {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": 'multipart/form-data;',
                "Accept": '*/*',
                "Authorization": `Bearer ${theUser?.user.token}`
            }
        })
        }else{
            await axios.post(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/category/create-category`,
            {title: postTitle,
             description: postContent,
         }
         , {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              "Accept": 'application/json',
              "Authorization": `Bearer ${theUser?.user.token}`

            }
          })  
        }
        await updateCategories()
        handleClose();

    } catch (error) {
        console.log(error);
    }
   
    setPostTitle('');
    setPostContent('');
    setSelectedFile({});
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogContent>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClose}
          aria-label="close"
          style={{ position: 'absolute', top: '8px', right: '8px' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Create a New Post
        </Typography>
        <input
          type="text"
          placeholder="Post Title"
          value={postTitle}
          onChange={handlePostTitleChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <textarea
          rows="4"
          placeholder="Write your post here..."
          value={postContent}
          onChange={handlePostContentChange}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            resize: 'none'
          }}
        ></textarea>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '12px' }}
        />
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleCreatePost}
            style={{
              backgroundColor: '#1976d2',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            Create Post
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostPopup;

