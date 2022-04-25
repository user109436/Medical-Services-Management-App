import React, { useState, useEffect, useContext, memo } from 'react'
import {
    Grid,
    Divider,
    TextField,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Typography,
    Autocomplete

} from '@mui/material';
import AuthContext from '../../provider/AuthProvider';
import ChatContext from '../../provider/ChatProvider';
import GlobalContext from '../../provider/GlobalProvider';
import { fullname, addLabelField } from '../../utils/Utilities';
const ChatRooms = () => {
    const { loggedInUser } = React.useContext(AuthContext);
    const {
        setChatRoomMessages,
        setSelectedChatRoom,
        chatrooms,
        chatRoomMessages,
        setChatRooms,
        hasChatRoom,
        setHasChatRoom
    } = React.useContext(ChatContext);
    const { getData, updateData } = useContext(GlobalContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const handleSelectChatRoom = async (id) => { //fetch all messages in that room
        await updateData(`api/chats/${id}`); //set all chat room messages seen by the  currently logged in user
        setSelectedChatRoom(id);
        const messages = await getData(`api/chats/${id}`);
        setChatRoomMessages(messages);

    }
    const handleSearchChange = async (e, child) => {
        if (!child) return false;
        let id = child.user_id._id;
        // fetch messages or chatrooms of this user and the currently log-in users
        const hasChatRoom = await getData(`api/chats/chat-rooms/${id}/search`);
        let chatroomID;
        if (hasChatRoom.length > 0) {
            // fetch their chatroom messages
            chatroomID = hasChatRoom.doc[0]._id;
            handleSelectChatRoom(chatroomID);
            return true;
        }
        setHasChatRoom(
            {
                hasChatroom: false,
                selectedUser: id,
                name:child?.name,
            }
        );
        setSelectedChatRoom('no-chatroom');
        console.log('no chatroom is triggered');
        setChatRoomMessages(null);
        return true;
    }
    const handleChange = (e) => {
        setSearch(e.target.value);
    }
    console.log('re render from ChatRooms.js');
    useEffect(() => {
        const fetchData = async () => {
            let chatRooms = await getData(`api/chats/chat-rooms/${loggedInUser?.user_id?._id}`);
            if (chatRooms?.doc) {
                setChatRooms([...chatRooms.doc]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (!loggedInUser) return false;
        fetchData();
    }, [loggedInUser,chatRoomMessages]);

    //fetch users
    useEffect(() => {
        const fetchData = async () => {
            let students = await getData('api/students');
            let staffs = await getData('api/staffs');
            if (staffs?.doc && students?.doc) {
                let mergeUsers = [...students.doc, ...staffs.doc];
                addLabelField(mergeUsers, 'name');
                setUsers([...mergeUsers]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchData();
    }, [])
    if (chatrooms?.length === 0 || users.length === 0) {
        return 'Loading Patients...'
    }
    return (
        <div>
            <Grid container>
                <Grid item xs={12} style={{ padding: '10px' }}>
                    <Autocomplete
                        sx={{ marginTop: 2 }}
                        clearOnEscape
                        options={users || []}
                        defaultValue={users?.find((v) => v.label)}
                        fullWidth
                        onChange={handleSearchChange}
                        size="small"
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        renderInput={(params) => (
                            <TextField {...params}
                                onChange={handleChange}
                                label={`Selected Patient:${fullname(hasChatRoom?.name)||'No-Selected'}`} />
                        )}
                    />
                </Grid>
            </Grid>
            <Divider />
            <List dense>
                {chatrooms.length > 0 ? (
                    chatrooms?.map((room, i) => (
                        <div key={`${room._id}`}>
                            <ListItem button onClick={() => handleSelectChatRoom(room._id)}>
                                <ListItemIcon>
                                    <Avatar alt={fullname(room.users[0]?.name)|| room.roomName} src={`/api/images/${room.users[0].photo}`} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            noWrap
                                            variant="body2"
                                            className={
                                                room?.lastMessage?.seenBy?.includes(loggedInUser.user_id._id) ? '' : 'font-bold'
                                            }
                                        >
                                            {fullname(room.users[0]?.name) || room.roomName}
                                        </Typography>}
                                    secondary={
                                        <Typography
                                            noWrap
                                            variant="subtitle2"
                                            sx={{ fontSize: '12px' }}
                                            className={
                                                room?.lastMessage?.seenBy?.includes(loggedInUser.user_id._id) ? '' : 'font-bold'
                                            }
                                        >
                                            {
                                                 `${fullname(room.lastMessage?.sender?.name)}:${room.lastMessage?.message || 'send message/files'}`
                                            }
                                        </Typography>}
                                >
                                    {room.roomName}
                                </ListItemText>

                            </ListItem>
                            <Divider />
                        </div>
                    ))
                ) : (
                    "No Conversation Found"
                )}

            </List>
        </div>
    )
}

export default memo(ChatRooms)