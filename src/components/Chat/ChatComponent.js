import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useUserContext } from '../User/UserContext';

const socket = io('https://forum-netcraft-backend-0ea87a3f4f22.herokuapp.com/'); // Replace with your server URL

const ChatComponent = ({ selectedReceiver }) => {
  const user = useUserContext();
  const [username, setUsername] = useState(user?.user?.name);
  const [message, setMessage] = useState('');
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('');
  
  
  const handleTyping = () => {
    socket.emit('typing', `${username} is typing`);
  };

  // const handleSendMessage = () => {
  //   const chatMessage = {
  //    message // Add the current room ID
  //   };
  //   console.log(socket);
  //   socket.emit('sendMessage', chatMessage);
  
  //   setMessage('');
  //    // Clear the message input
  // };
  // useEffect(() => {
  //   // Listen for the 'messageResponse' event
  //   // socket.on('privateRoomJoined', (data) => {
  //   //   console.log(data);
  //   // })
    
  
  //   // Clean up event listener when component unmounts
  //   // return () => {
  //   //   socket.off('messageResponse');
  //   // };
  // });
  // useEffect(() => {
  //   // Scroll to bottom every time messages change
  //   lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);
  const handleSendMessage = () => {
   
socket.emit('create', { from: username, to: selectedReceiver?.name });

const chatMessage = {
  from: username,
  to: selectedReceiver?.name,
  message,
};
socket.emit('message', chatMessage);
setMessage('');
  };
  useEffect(() => {
    const roomID = [username, selectedReceiver?.name].sort().join('');
  
    socket.on('privateRoomJoined', (data) => {
      console.log('Private room joined:', data);
      setCurrentRoom(data);
    });
  
    if (currentRoom === roomID) {
      socket.on('messageResponse', (data) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    }
  
    return () => {
      socket.off('messageResponse');
    };
  }, [currentRoom, selectedReceiver, username]);
  // useEffect(() => {
  //   socket.on('privateRoomJoined', (data) => {
  //     console.log('Private room joined:', data);
  //     setCurrentRoom(data);
  //   });
  
   
  //     socket.on('messageResponse', (data) => {
  //       setMessages((prevMessages) => [...prevMessages, data]); // Update state correctly
  //     });
    
  
  //   // Clean up event listeners when the component unmounts or currentRoom changes
  //   return () => {
  //     socket.off('messageResponse');
  //   };
  // }, [currentRoom, chatId, selectedReceiver, user]);
  // useEffect(() => {
  //   // Emit join event when component mounts
  //   const chatOfUsers = {
  //     from: selectedReceiver,
  //     to: username
  //   };
  //   socket.emit('join', chatOfUsers, (roomID) => {
  //       setCurrentRoom(roomID); // Set the current room ID
  //     });

  //   // Listen for typing response
  //   socket.on('typingResponse', (data) => setTypingStatus(data));

  //   // Clean up event listeners
  //   // return () => {
  //   //   socket.off('typingResponse');
  //   // };
  //   // return () => {
  //   //     socket.disconnect('disconnect')
  //   // }
  // }, [selectedReceiver, username]);

  return (
    <div>
      <div>
         <input
            type="text"
            placeholder="Write message"
            className="message"
            value={message}
            // onKeyDown={handleTyping}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>SEND</button>
      </div>
     <div className="message__container">
        {messages.map((message, index) => (
          <div key={index}><p>{message?.message}</p></div>
        ))}

        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
      </div>
      
    </div>
  );
};

export default ChatComponent;




