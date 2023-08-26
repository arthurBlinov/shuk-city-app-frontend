import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isVerified, setIsVerified] = useState(localStorage.getItem('isVerified') === 'true' || false);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateIsVerified = (value) => {
    setIsVerified(value);
    localStorage.setItem('isVerified', value.toString()); 
  };

  return (
    <UserContext.Provider value={{ user, isVerified, updateUser, updateIsVerified }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}





