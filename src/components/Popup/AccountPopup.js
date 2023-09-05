import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import { TextField } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useUserContext } from '../User/UserContext';
import baseUrl from '../../utils/baseURL';
const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    maxWidth: '400px',
  },
});

const StyledDialogContent = styled(DialogContent)({
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

const StyledAvatar = styled(Avatar)({
  width: '80px',
  height: '80px',
});

const StyledInputContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
});

const AccountPopup = ({ open, handleClose, userDetails }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userDetails?.name);
  const [editedEmail, setEditedEmail] = useState(userDetails?.email);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const theUser = useUserContext();
  
  useEffect(() => {
    setEditedName(userDetails?.name);
    setEditedEmail(userDetails?.email);
  }, [userDetails]);
  const handleClick = () => {
    setIsEditing(!isEditing)
  }

  const handleEditClick = async() => {
    const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
    }
    await axios.put(`${baseUrl}/netcraft/user/update-profile/${userDetails?._id}`,{
                name: editedName,
                email: editedEmail
    }, config)
    
    setIsEditing(!isEditing);
    handleClose();
    localStorage.setItem('user')
    window.location.reload();
};
  
const handleChangePassword = async() => {
    const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
    }
    await axios.put(`${baseUrl}/netcraft/user/password`,{
            password: newPassword
    }, config)
    setIsEditing(!isEditing);
    handleClose();
    window.location.reload();
}
  const handleInputChangeName = (e) => {
    setEditedName(e.target.value);
  };

  const handleInputChangeEmail = (e) => {
    setEditedEmail(e.target.value);
  };
  const handleClosePopup = () => {
    setIsEditing(false); 
    handleClose();
  };
  const handleToggleChangePassword = (e) => {
    setShowChangePassword(!showChangePassword);
  };
  function uint8ArrayToBase64(uint8Array) {
    let binary = '';
    for (let i = 0; i < uint8Array?.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
  }
  return (
    <StyledDialog open={open} onClose={handleClosePopup} style={{direction: 'rtl'}}>
      <StyledDialogContent>
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleClosePopup}
          aria-label="close"
          style={{ position: 'absolute', top: '8px', right: '8px' }}
        >
          <CloseIcon />
        </IconButton>
        <StyledAvatar alt="User Avatar" src={userDetails?.profilePhoto?.fileType ? `data:${userDetails?.profilePhoto?.fileType};charset=utf-8;base64,${uint8ArrayToBase64(userDetails?.profilePhoto?.image?.data?.data)}` : null}/>
        <h2>
          {!isEditing ? (
            <span>
            {userDetails?.name}
              <EditIcon style={{ marginRight: '5px', cursor: 'pointer' }} onClick={handleClick}/>
            </span>
          ) : (
            <p>מצב עריכה</p>
          )}
        </h2>
        <p>
          {!isEditing ? (
            <span>
              {userDetails?.email}
              <EditIcon
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                onClick={handleClick}
              />
            </span>
          ) : (
            ''
          )}
        </p>
        {isEditing ? (
          <div>
            <StyledInputContainer>
              <input
                type="text"
                name="name"
                value={editedName}
                onChange={handleInputChangeName}
                placeholder="Name"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="email"
                name="email"
                value={editedEmail}
                onChange={handleInputChangeEmail}
                placeholder="Email"
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
              />
            </StyledInputContainer>
            <Button
              onClick={handleEditClick}
              variant="contained"
              startIcon={<EditIcon />}
              style={{marginRight: '5px'}}
            >
              לשמור שינוים
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
            >
              למחוק פרופיל
            </Button>
            <Button
              variant="outlined"
              startIcon={!showChangePassword ? <LockIcon /> : 'close'}
              style={{ marginTop: '16px' }}
              onClick={handleToggleChangePassword}

            >
              שינוי סיסמה
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              style={{ marginTop: '16px' }}
            >
              למחוק פרופיל
            </Button>
            <Button
              variant="outlined"
              startIcon={!showChangePassword ? <LockIcon /> : 'close'}
              style={{ marginTop: '16px' }}
              onClick={handleToggleChangePassword}
              
            >
              שינוי סיסמה
            </Button>
            
          </div>
          
        )}
        {showChangePassword && (
              <div>
               <TextField
                  type="password"
                  label="Old Password"
                  variant="outlined"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  type="password"
                  label="New Password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Button
                  variant="contained"
                  startIcon={<LockIcon/>}
                  onClick={handleChangePassword}
                  fullWidth
                  style={{ marginTop: '16px' }}
                >
                  שינוי סיסמה
                </Button>
              </div>
            )}
      </StyledDialogContent>
    </StyledDialog>
  );
};

export default AccountPopup;




