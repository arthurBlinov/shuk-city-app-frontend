import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useUserContext } from '../User/UserContext';
import axios from 'axios';
import io from 'socket.io-client';
import './ChatWithSelectedUser.css'
import baseUrl from '../../utils/baseURL';
const socket = io(`${baseUrl}/`); 
// img
function ChatWithSelectedUser() {
    const location = useLocation();
    const selectedUser = location?.state?.selectedUser;
    const theUser = useUserContext();
    // const {updateUser} = useUserContext();
    // console.log(theUser);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socketMessages, setSocketMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState('');
    const [typingStatus, setTypingStatus] = useState('');
    const lastSocketMessageRef = useRef(null);
    const lastMessageRef = useRef(null);
    useEffect(() => {
        const getCertainChat = async() => {
            const config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Accept": 'application/json',
                  "Authorization": `Bearer ${theUser?.user?.token}`
                }
              };
            const response = await axios.get(`${baseUrl}/netcraft/user/certain-chat/${selectedUser?._id}`, config)
            if(response?.data){
                setMessages(response.data?.messages)
            }
            // let updatedUser;
            // if(response?.data?.chatCreator === theUser?._id){
            //   updatedUser = response?.data?.chatCreator;
            //   updateUser(updatedUser)
            // }else{
            //   updatedUser = response?.data?.reciever;
            //   updateUser(updatedUser)
            // }
        }
        getCertainChat(); 
    }, [theUser, selectedUser]);
    
    const handleSendMessage = () => {
        postChating(message, selectedUser);
        
        const roomID = [theUser?.user?.name, selectedUser?.name].sort().join('');
        const chatMessage = {
            // userMessage: theUser?.user?.name,
            roomID,
            message,
        };
        socket.emit('message', chatMessage);
        setMessage('');
        };
        
        useEffect(() => {
            const roomID = [theUser?.user?.name, selectedUser?.name].sort().join('');
            console.log(roomID);
            socket.emit('joinRoom',  {roomID});
          //  setCurrentRoom(roomID)
            // socket.on('privateRoomJoined', data => {
            //     setCurrentRoom(data);

            // })
          
            socket.on('messageResponse', (data) => {
              setSocketMessages((prevMessages) => [...prevMessages, data]);
              // setTypingStatus('');

            });
          
            return () => {
              socket.off('messageResponse');
              // socket.off('typingResponse');
            };
          })
          // const handleTyping = (e) => {
          //   if (e.target.value && selectedUser) {
          //     socket.emit('typing', {
          //       roomID: currentRoom,
          //       user: theUser?.user?.name,
          //       isTyping: true,
          //     });
          //   } else {
          //     socket.emit('typing', {
          //       roomID: currentRoom,
          //       user: theUser?.user?.name,
          //       isTyping: false,
          //     });
          //   }
          // };
          
          const postChating = async(message, selectedUser) => {
            const config = {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  "Accept": 'application/json',
                  "Authorization": `Bearer ${theUser?.user?.token}`
                }
              };
                try {
                    await axios.post(`${baseUrl}/netcraft/chat/create-chat`,{
                        message: message,
                        reciever: selectedUser,

                    },config)
                } catch (error) {
                    
                }
          }

        useEffect(() => {
            if(lastMessageRef.current && !lastSocketMessageRef.current){
                lastMessageRef.current.scrollIntoView({behavior: 'smooth'})
            }
        })
        useEffect(() => {
            if (lastSocketMessageRef.current) {
            lastSocketMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [socketMessages]);
  return (
    
    <div className="container">
      <div className="msg-header">
        <div className="container1">
          <div className="active">
            <p>Chat with {selectedUser?.name}</p>
          </div>
        </div>
      </div>

      <div className="chat-page">
        <div className="msg-inbox">
          <div className="chats">
            <div className="msg-page">
            {messages ? (messages.map((message) => (
                <div key={message?._id}  ref={message => { if (messages.length - 1) lastMessageRef.current = message; }}
                >
                <div className="received-chats">
                
                {message?.sender === selectedUser?._id && (
                    <div>
                      
                <p>{selectedUser?.name}</p>
                <div className="received-msg">
                        <div className="received-msg-inbox">
                          <p>
                            {message?.message}
                          </p>
                          
                        </div>
                      </div>
                    </div>
                        
                
                )}

                </div>
                <div className="outgoing-chats">
                
                {message?.sender === theUser?.user?._id && (
                    <div>
                       
                  <p>me</p>
                    <div className="outgoing-msg">
                    <div className="outgoing-chats-msg">
                      <p className="multi-msg">
                       {message?.message}
                      </p>
  
                    </div>
                  </div>
                    </div>
                    
                )}
                
              </div>
                     </div>
                        ))) : ''}
             
            {socketMessages && socketMessages.map((socketMessage, index) => (
                <div key={index} ref={socketMessage => { if (index === socketMessages.length - 1) lastSocketMessageRef.current = socketMessage; }}
                >
                    
                     <div className="received-chats">
                        {socketMessage?.userMessage}
                     {socketMessage?.userMessage !== theUser?.user?.name && (
                        <div>
                             
                   
                         <div className="received-msg">
                         <div className="received-msg-inbox">
                           <p className="single-msg">
                            {socketMessage?.message}
                           </p>
                         </div>
                       </div>
                        </div>
                    
                    )}

                    
                   </div>
                   <div className="outgoing-chats">
                   {socketMessage?.userMessage === theUser?.user?.name && (
                    <div>
                       
               
                    <div className="outgoing-msg">
                    <div className="outgoing-chats-msg">
                      <p>
                        {socketMessage?.message}
                      </p>
  
                    </div>
                  </div>
                    </div>
                
                )}
                
              </div>
                   
                </div>
                    
            ))}
         
              
            </div>
          </div>


          <div className="msg-bottom">
            <div className="input-group">
              <input
                type="text"
                      placeholder="Write message"
                      className="form-control"
                      value={message}
                      // onKeyDown={handleTyping}
                      onChange={(e) => setMessage(e.target.value)}
              />

              <span className="input-group-text">
                <button onClick={handleSendMessage} className="send-button">Send</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWithSelectedUser;