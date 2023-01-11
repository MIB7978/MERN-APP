import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory} from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState(null);
  const [selectedchat, setSelectedchat] = useState(null)
  const [chat, setChat] = useState()
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    
    // if (!userInfo) history.push('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedchat,
         setSelectedchat,
         chats,
          setChats
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;