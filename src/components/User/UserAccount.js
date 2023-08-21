import React, { useState } from 'react';
import SideBar from './SideBar';

function UserAccount() {
  const [open, setOpen] = useState(true); // Start with the sidebar closed

  const handleOpenSidebar = () => {
    setOpen(true); // Set the 'open' state to true
  };

  const handleDrawerClose = () => {
    setOpen(false); // Set the 'open' state to false
  };

  return (
    <div>
      <div>
      <SideBar open={open} handleDrawerClose={handleDrawerClose} />
      </div>
        <div>
        <button style={{marginTop: '120px'}} onClick={handleOpenSidebar}>Open Sidebar</button>
        </div>
     
    </div>
  );
}

export default UserAccount;

