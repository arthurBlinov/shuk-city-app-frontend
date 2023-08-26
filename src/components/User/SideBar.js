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
import { useParams } from 'react-router-dom';
import CreatePostPopup from '../Popup/CreatePostPopup';
import ChatPopup from '../Popup/ChatPopup';
import AccountPopup from '../Popup/AccountPopup';
const drawerWidth = 440;

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
  width: drawerWidth,
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
  padding: '0 8px',
  justifyContent: 'flex-end',
});

const StyledUserInfo = styled('div')({
  width: drawerWidth,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
  marginTop: '38px',
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
  marginTop: '16px',
  alignItems: 'center',
});

const StyledIcon = styled('div')({
  fontSize: '32px',
  marginBottom: '12px',
  color: '#ffcc00',
  transition: 'transform 0.3s, color 0.3s',
  '&:hover': {
    color: '#ffd600',
    transform: 'scale(1.2)',
    cursor: 'pointer',
  },
});

const StyledAvatar = styled(Avatar)({
  width: '80px',
  height: '80px',
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
  const {id} = useParams();
  const [userDetails, setUserDetails] = useState({});
  const user = useUserContext();
  const [isCreatePostPopupOpen, setIsCreatePostPopupOpen] = useState(false);
  const [isChatPopupOpen, setIsChatPopupOpen] = useState(false);
  const [isAccountPopupOpen, setIsAccountPopupOpen] = useState(false);
  const uploadInputRef = useRef(null);
  
  useEffect(() => {
    const getUserDetails = async() => {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${user?.user?.token}`
        }
      }
      try {
        const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/${user?.user?._id}`, config)
        setUserDetails(response?.data)
    }  
       catch (error) {
        
      }
    }
    getUserDetails();
  }, [user]);
  const handleCategoriesPopup = () => {
    setIsCreatePostPopupOpen(true);
  }
  const handleChatPopup = () => {
    setIsChatPopupOpen(true);
  };
  const handleAccountPopup = () => {
    setIsAccountPopupOpen(true);
  };
  const handleUploadPhoto = () => {
    uploadInputRef.current.click();
  };
 
  const updatePhotoFileUpload = async(selectedFile) => {
    console.log(selectedFile);
    const formData = new FormData(); 
    formData.append('file', selectedFile);
  
    
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": 'multipart/form-data;',
        "Accept": '*/*',
        "Authorization": `Bearer ${user?.user?.token}`
      }
    }
    try {
      await axios.put(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/upload-profile-photo/${user?.user?._id}`,{
                image: selectedFile
                // formData
      }, config);
  }  
     catch (error) {
        console.log(error);
    }
  }
  return (
    <StyledDrawer variant="persistent" anchor="left" open={open}>
      <div>
        <StyledDrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </StyledDrawerHeader>
        <StyledUserInfo>
          <StyledAvatar
            alt="User Avatar"
            src={userDetails?.profilePhoto}
          />
          <Typography variant="h6" gutterBottom>
            {userDetails?.name}
          </Typography>
          <Typography variant="subtitle1">{userDetails?.profession}</Typography>
          <Typography variant="subtitle2">
            <i className="fas fa-envelope"></i> {userDetails?.email}
          </Typography>
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
          updatePhotoFileUpload(e?.target?.files[0])}}
      />
    </StyledDrawer>
  );
};

export default SideBar;




















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './UserAccount.css';
// import { useParams } from 'react-router-dom';
// import { useUserContext } from '../User/UserContext';

// function UserAccount() {
//   const [user, setUser] = useState({});
//   const [categories, setCategories] = useState([]);
//   const {id} = useParams();
//   const userContext = useUserContext();
//   console.log(userContext);
//   useEffect(() => {
//     // Fetch user data and categories from the API
//     const fetchUserData = async () => {
//       try {
//         const config = {
//           headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Content-Type": "application/json",
//             "Accept": 'application/json',
//             "Authorization": `Bearer ${userContext?.user?.token}`
//           }
//         }
//         const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/${id}`, config);
//         setUser(response.data);
//         setCategories(response.data.categories);
//         console.log(categories);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <div className="user-account-container">
//   <div className="user-profile">
//     <div className="profile-photo">
//       <img src={user.profilePhoto} alt="User Profile" />
//     </div>
//     <div className="profile-details">
//       <h2>{user.name}</h2>
//       <p>{user.email}</p>
//     </div>
//   </div>
//   <div className="divider"></div>
//   <div className="user-categories">
//     <h3>Your Categories</h3>
//     <ul>
//       {categories.map((category) => (
//         <li key={category.id}>
//           <div className="category-title">{category.title}</div>
//           <div className="category-description">{category.description.substring(0, 35)}</div>
//         </li>
//       ))}
//     </ul>
//   </div>
// </div>


//   );
// }

// export default UserAccount;
