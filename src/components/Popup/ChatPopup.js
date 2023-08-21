import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { useUserContext } from '../User/UserContext';
import axios from 'axios';
import { useState } from 'react';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const ReceiverWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  padding: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const ReceiverAvatar = styled(Avatar)({
  marginRight: '16px',
});

const ChatPopup = ({ open, handleClose }) => {
  const theUser = useUserContext();
  const [receivers, setReceivers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserChats = async() => {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
      }
      
      try {
        const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/receivers/${theUser?.user?._id}`, config);
        setReceivers(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
    
    fetchUserChats();
  }, [theUser])
  const navigateToChat = (selectedUser) => {
    // Use the navigate function to go to the chat route with the selectedUser's ID
    navigate(`/netcraft/user/certain-chat/${selectedUser._id}`, {state: {selectedUser}});
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm" // Adjust the maximum width as needed
      fullWidth // Use full width for responsiveness
    >
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
        {/* Chat content goes here */}
        <div style={{ padding: '16px' }}>
          <h2>Chat Receivers</h2>
          {receivers.map((receiver) => (
            <ReceiverWrapper
              key={receiver._id}
              onClick={() => navigateToChat(receiver)} // Pass the selectedUser to navigate function
            >
              <ReceiverAvatar alt={receiver.name} src={receiver.profilePhoto} />
              <span>{receiver.name}</span>
            </ReceiverWrapper>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;

