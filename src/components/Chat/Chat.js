import React, { useState, useEffect } from 'react';
import { useUserContext } from '../User/UserContext';
import axios from 'axios';
import './Chat.css';
import { useLocation } from 'react-router-dom';
import ChatComponent from './ChatComponent';
function Chat() {
  const location = useLocation();
  const selectedUser = location?.state?.selectedUser;
  console.log(selectedUser);
  // const { user, isVerified } = useUserContext();
  const [selectedChat, setSelectedChat] = useState(null);
  const [userChats, setUserChats] = useState([]);
  const [receivers, setReceivers] = useState([]); // Renamed 'recievers' to 'receivers'
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const theUser = useUserContext()

  const getChatsOfUser = async () => {
    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
      };
      
        const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/${theUser?.user?._id}`, config);
        setUserChats(response?.data?.chats);
      
     
    } catch (error) {
      console.error("Error fetching user chats:", error);
    }
  };

  const getReceiversOfUser = async () => {
    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
      };
      
      const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/user/receivers/${theUser?.user?._id}`, config);
      setReceivers(response?.data);
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  };

  
  const getChat = async(id) => {
    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.user?.token}`
        }
      };
      
      const response = await axios.get(`https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/chat/fetch-chat/${id}`, config);
      setSelectedChat(response?.data);
    } catch (error) {
      console.error("Error fetching receivers:", error);
    }
  }
  const handleReceiverClick = (receiver) => {
    setSelectedReceiver(receiver);
  };
  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage) return; // Don't send empty messages

    try {
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Accept": 'application/json',
          "Authorization": `Bearer ${theUser?.token}`
        }
      };
      
      await axios.post(
        `https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/netcraft/chat/create-chat`,
        {
          chatId: selectedChat?._id,
          message: newMessage
        },
        config
      );

      // Refresh the chat after sending a message
      await getChat(selectedChat?._id);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Fetch chat data for the selected receiver
  useEffect(() => {
    if (selectedReceiver) {
      
      userChats.forEach(async (userChat) => {
        if (userChat?.reciever === selectedReceiver._id) {
          await getChat(userChat._id);
        }
      });
    }
  }, [selectedReceiver, userChats]);
  useEffect(() => {
    getChatsOfUser();
    getReceiversOfUser();
  }, []);
  return (
    <div className="chat-container">
      <div className="receiver-list">
        {receivers?.map(receiver => (
          <div
            className={`receiver ${selectedReceiver?._id === receiver ? 'selected' : ''}`}
            key={receiver?._id}
            onClick={() => handleReceiverClick(receiver)}
          >
            {receiver?.name}
            {selectedUser?.name}

          </div>
        ))}
      </div>
      <div className="user-chat">
        {selectedReceiver && (
          <div>
            <h2>Chat with {selectedReceiver.name}</h2>
            <div className="message-list">
              {selectedChat?.messages?.map(message => (
                <div
                  key={message?._id}
                  className={`user-chat-item ${message.sender ? 'sender' : 'receiver'}`}
                >
                  <div className="message-content">
                    {message.message}
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={handleMessageChange}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
        {!selectedReceiver && <p>Select a receiver to view userChat</p>}
      <ChatComponent selectedReceiver={selectedReceiver}/>
      
      </div>
    </div>
  );
  
  
}

export default Chat;
