import { createContext, useState } from "react";
const ChatContext = createContext({});

export const ChatProvider = ({ children }) => {
  const [chatRoomMessages, setChatRoomMessages] = useState(null);
  const [selectedChatRoom,setSelectedChatRoom]=useState(null);
  const [chatrooms, setChatRooms]=useState([]); //trigger for re-renders
  const [openImageModal, setOpenImageModal]=useState({
    open:false,
    img:''
  });
  const [hasChatRoom, setHasChatRoom]=useState({
    hasChatroom:false,
    selectedUser:'',//user_id of search user
    name:'',
  });
  return (
    <ChatContext.Provider value={{
      chatRoomMessages,
      setChatRoomMessages,
      selectedChatRoom,
      setSelectedChatRoom,
      chatrooms,
      setChatRooms,
      openImageModal,
      setOpenImageModal,
      hasChatRoom,
      setHasChatRoom
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
