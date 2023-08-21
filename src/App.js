import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Chat from './components/Chat/Chat';
import Navbar from './components/NavbarAndFooter/Navbar';
import { UserProvider } from './components/User/UserContext';
import EditCategory from './components/Categories/EditCategories';
import Comments from './components/Comments/Comments';
import UserAccount from './components/User/UserAccount';
import ChatWithSelectedUser from './components/Chat/ChatWithSelectedUSer';
function App() {
  return (
    <div>
      <BrowserRouter>
      <UserProvider>
      
      <Navbar/>
          <Routes>
              <Route exact path='/' element={<Main/>}/>
              {/* <Route exact path='/chats' element={<Chat/>}/> */}
              <Route exact path='/netcraft/user/certain-chat/:id' element={<ChatWithSelectedUser/>}/>
              <Route exact path='/netcraft/category/fetch-category/:categoryId' element={<EditCategory/>}/>
              <Route exact path='/netcraft/category/fetch-comments/:id' element={<Comments/>}/>
              <Route exact path='/netcraft/user/:id' element={<UserAccount/>} />
          </Routes>
          </UserProvider>

      </BrowserRouter>
    </div>
  );
}

export default App;
