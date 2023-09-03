import React, { useEffect, useState, useRef } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ForumIcon from '@mui/icons-material/Forum';
import ChatIcon from '@mui/icons-material/Chat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/system';
import { keyframes } from '@emotion/react';
import { useUserContext } from './UserContext';
import axios from 'axios';
import CreatePostPopup from '../Popup/CreatePostPopup';
import ChatPopup from '../Popup/ChatPopup';
import AccountPopup from '../Popup/AccountPopup';
import baseUrl from '../../utils/baseURL';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 260;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(50px);
  }
  to {
    transform: translateY(0);
  }
`;

const StyledDrawer = styled(Drawer)({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  transition: 'width 0.55s',
  animation: `${fadeIn} 0.7s ease-in`,
  '&.MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: '#1976d2',
    color: '#fff',
  },
});

const StyledDrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  minHeight: '64px', // Add a minimum height for the header
});

const StyledUserInfo = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  background: '#0d47a1',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.5s, transform 0.5s',
  '&:hover': {
    background: '#1565c0',
    transform: 'scale(1.05)',
  },
});

const StyledIconsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  // marginTop: '16px',
});

const StyledIcon = styled('div')({
  marginBottom: '40px',
  color: '#ffcc00',
  transition: 'transform 0.3s, color 0.3s',
  '& svg': {  // This targets all SVGs (icons) inside the StyledIcon
    fontSize: '33px',  // Set the desired fontSize for the icons
  },
  '&:hover': {
    color: '#ffd600',
    transform: 'scale(1.2)',
    cursor: 'pointer',
  },
});


const StyledAvatarContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '22px',

});

const StyledAvatar = styled(Avatar)({
  width: '80px',
  height: '80px',
  marginTop: '25px',
  marginBottom: '10px'
});

const StyledFooter = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '48px',
  backgroundColor: '#1976d2',
  color: '#fff',
  animation: `${slideIn} 0.7s ease-in`,
  marginTop: 'auto',
});

const SideBar = ({ open, handleDrawerClose }) => {
  const [userDetails, setUserDetails] = useState({});
  const user = useUserContext();
  const [isCreatePostPopupOpen, setIsCreatePostPopupOpen] = useState(false);
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);
  const uploadInputRef = useRef(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const getUserDetails = async () => {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          "Accept": 'application/json',
          "Authorization": `Bearer ${user?.user?.token}`,
        },
      };
      try {
        const response = await axios.get(
          `${baseUrl}/netcraft/user/${user?.user?._id}`,
          config
        );
        setUserDetails(response?.data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserDetails();
  }, [user]);

  const handleCategoriesPopup = () => {
    console.log('hello');
    setIsCreatePostPopupOpen(true);
  };

  const handleChatPopup = () => {
    setIsChatPopupOpen(true);
  };

  const handleAccountPopup = () => {
    setIsAccountPopupOpen(true);
  };

  const handleUploadPhoto = () => {
    uploadInputRef.current.click();
  };

  const updatePhotoFileUpload = async (selectedFile) => {
    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data;',
        Accept: '*/*',
        Authorization: `Bearer ${user?.user?.token}`,
      },
    };
    try {
      await axios.put(
        `${baseUrl}/netcraft/user/upload-profile-photo/${user?.user?._id}`,
        {
          image: selectedFile,
        },
        config
      );
    } catch (error) {
      console.error(error);
    }
  };

  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array?.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }

  return (
    <>
    {isSmallScreen && (
      <StyledDrawer variant='temporary' anchor="left" open={open}>
      <div style={{display: 'grid'}}>
        <StyledDrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </StyledDrawerHeader>
        <StyledUserInfo>
          <StyledAvatarContainer>
            <StyledAvatar
              alt="User Avatar"
              src={`data:${userDetails?.profilePhoto?.image?.fileType};charset=utf-8;base64,${uint8ArrayToBase64(
                userDetails?.profilePhoto?.image?.data?.data
              )}`}
            />
            <Typography margin={'35px'} variant="h6" gutterBottom>
              {userDetails?.name}
            </Typography>
            {/* <Typography variant="subtitle1">{userDetails?.profession}</Typography> */}
            <Typography variant="subtitle2">
              <i className="fas fa-envelope"></i> {userDetails?.email}
            </Typography>
          </StyledAvatarContainer>
        </StyledUserInfo>
        <StyledIconsContainer>
          <StyledIcon>
            <div onClick={handleCategoriesPopup}>
              <ForumIcon />
            </div>
          </StyledIcon>
          <StyledIcon>
            <div onClick={handleChatPopup}>
              <ChatIcon />
            </div>
          </StyledIcon>
          <StyledIcon>
            <div onClick={handleAccountPopup}>
              <AccountCircleIcon />
            </div>
          </StyledIcon>
          <StyledIcon>
            <div onClick={handleUploadPhoto}>
              <PhotoCameraIcon />
            </div>
          </StyledIcon>
        </StyledIconsContainer>
        <StyledFooter>
          <Typography variant="body2">Best wishes!</Typography>
        </StyledFooter>
      </div>
      <CreatePostPopup
        open={isCreatePostPopupOpen}
        handleClose={() => setIsCreatePostPopupOpen(false)}
      />
      <ChatPopup
        open={isChatPopupOpen}
        handleClose={() => setIsChatPopupOpen(false)}
      />
      <AccountPopup
        open={isAccountPopupOpen}
        handleClose={() => setIsAccountPopupOpen(false)}
        userDetails={userDetails}
      />
      <input
        type="file"
        accept="image/*"
        ref={uploadInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          e.preventDefault();
          updatePhotoFileUpload(e?.target?.files[0]);
        }}
      />
    </StyledDrawer>
    )}
    </>
  );
};

export default SideBar;





















