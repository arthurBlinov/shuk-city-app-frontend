import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useUserContext } from '../User/UserContext';
import { useCategoryContext } from '../Categories/CategoryContext';
import baseUrl from '../../utils/baseURL';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CreatePostPopup = ({ open, handleClose }) => {
  const [postContent, setPostContent] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState({});
  const theUser = useUserContext();
  const {updateCategories} = useCategoryContext();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
        if(selectedFile?.name){
            await axios.post(`${baseUrl}/netcraft/category/create-category`,
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
        await updateCategories()
        handleClose();
        setPostTitle('');
        setPostContent('');
        setSelectedFile({});
        }else{
       
        setPostTitle('you need to add a file')
        setPostContent('you need to add a file')
        }
        

    } catch (error) {
        console.log(error);
    }
   
   
  };

  return (
    <>
    {isSmallScreen && (
        <Dialog fullScreen={isSmallScreen}
        style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto'}}
        
     open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogContent 
            style={{
              height: 'auto', 
              position: 'relative', 
              background: 'gray',
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            // style={{ position: 'absolute', top: '8px', right: '8px' }}
          >
            <CloseIcon />
          </IconButton>
          <Typography style={{marginBottom: '20px', color: 'white'}} variant="h5" gutterBottom>
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
              maxWidth: '250px',
              margin: 'auto'
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
              resize: 'none',
              height: 'auto',
              maxWidth: '250px',
              margin: 'auto',
              marginTop: '10px'
            }}
          ></textarea>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: '12px', height: 'auto' }}
          />
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleCreatePost}
              style={{
                height: 'auto',
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
    )}
    </>
    
  );
};

export default CreatePostPopup;

