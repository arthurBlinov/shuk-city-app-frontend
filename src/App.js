import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Navbar from './components/NavbarAndFooter/Navbar';
import { UserProvider } from './components/User/UserContext';
import EditCategory from './components/Categories/EditCategories';
import Comments from './components/Comments/Comments';
import ChatWithSelectedUser from './components/Chat/ChatWithSelectedUSer';
import { CategoryProvider } from './components/Categories/CategoryContext';
import Footer from './components/NavbarAndFooter/Footer';
function App() {
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.body.scrollHeight;

      const isAtBottom = scrollPosition + windowHeight >= documentHeight;

      setShowFooter(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div>
      <BrowserRouter>
      <UserProvider>
      <CategoryProvider>
      <Navbar/>
          <Routes>
              <Route exact path='/' element={<Main/>}/>
              <Route exact path='/netcraft/user/certain-chat/:id' element={<ChatWithSelectedUser/>}/>
              <Route exact path='/netcraft/category/fetch-category/:categoryId' element={<EditCategory/>}/>
              <Route exact path='/netcraft/category/fetch-comments/:id' element={<Comments/>}/>
          </Routes>
          {showFooter && (
            
             <Footer/>

      )}
    </CategoryProvider>
          
          </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
