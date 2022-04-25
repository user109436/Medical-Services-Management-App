import React, { useEffect, memo } from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import {
    Box,
    Grid,
    TextField,
    List,
    ListItem,
    ListItemText,
    Avatar,
    ImageList,
    ImageListItem,
    Typography,
    IconButton,

} from '@mui/material';
import { blue } from '@mui/material/colors';
import AuthContext from '../../provider/AuthProvider';
import GlobalContext from '../../provider/GlobalProvider';
import ChatContext from '../../provider/ChatProvider';
import SendIcon from '@mui/icons-material/Send';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import moment from 'moment'
import { formatDate, fullname, hasFileExtension,encodeImageFileAsURL } from '../../utils/Utilities';
import io from "socket.io-client";
var socket;
const Input = styled('input')({
    display: 'none',
});
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '93vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '80vh',
        overflowY: 'auto',
        borderRight: '1px solid #e0e0e0'


    }
});
const Chat = () => {
    const classes = useStyles();
    const { loggedInUser } = React.useContext(AuthContext);
    const { addData, getData, updateData } = React.useContext(GlobalContext);
    const {
        chatRoomMessages,
        setChatRoomMessages,
        selectedChatRoom,
        setSelectedChatRoom,
        setChatRooms,
        hasChatRoom,
        setHasChatRoom
    } = React.useContext(ChatContext);
    const [message, setMessage] = React.useState({
        message: "",
        chatRoom: "",
        images: [],
        base64Images:[]
    });
    const [processing, setProcessing]=React.useState(false);
    const scrollRef = React.useRef();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage({ ...message, [name]: value });
    };

    const submitOnEnter = (e) => {
        if ((e.keyCode === 13 || e.which === 13) && !e.shiftKey) {
            handleSubmit();
            return true;
        }
        return false;
    }
    const handleSelectChatRoom = async (messages, id) => { //fetch all messages in that room
        await updateData(`api/chats/${id}`); //set all chat room messages seen by the  currently logged in user
        setChatRoomMessages(messages);
    }
    const handleSubmit = async (e) => {
        if(!chatRoomMessages){
            return false;
        }
        if(processing)return false;//if message is still being processed, we wait until it is sent
        setProcessing(true);
        //error validation
        if (message.message.length === 0 && message.images.length === 0) return false;
        if (selectedChatRoom === 'no-chatroom') {
            //message
            let obj = {
                users: [loggedInUser?.user_id?._id, hasChatRoom?.selectedUser],
                message: message?.message || 'chatroom created',
                images: message?.images,
            }
            //endpoint expects a 'text-message' to be send before sending files
            let res = await addData(`api/chats/chat-rooms`, obj);
            // get chatroom id from response 
            let chatroomID = res?.chatroom?._id;
            if (message.images.length > 0 && message.images.length <= 10) {
                const formData = new FormData();
                for (const image of message.images) {
                    formData.append('images', image);
                }
                res = await addData(`api/chats/${chatroomID}/files`, formData);
            }
            //fetch messages
            const messages = await getData(`api/chats/${chatroomID}`);
            setChatRoomMessages({ ...messages });
            setSelectedChatRoom(chatroomID);
            //reload chatrooms
            resetState();
            return true;

        }
        message.chatRoom = selectedChatRoom;
        //send message
        if (message.message) {
            await addData(`api/chats/${selectedChatRoom}`, message);
        }
        //send files
        if (message.images.length > 0 && message.images.length <= 10) {
            const formData = new FormData();
            for (const image of message.images) {
                formData.append('images', image);
            }
            await addData(`api/chats/${selectedChatRoom}/files`, formData);
        }
        const messages = await getData(`api/chats/${selectedChatRoom}`);
        const chatrooms = await getData(`api/chats/chat-rooms`);
        socket.emit('send-message', messages, selectedChatRoom);
        socket.emit('updateChatrooms', chatrooms);
        setChatRoomMessages(messages);
        resetState();
        setProcessing(false);

    }
    const resetState = () => {
        setMessage({
            message: "",
            chatRoom: "",
            images: []
        });
        setHasChatRoom({
            hasChatroom: false,
            selectedUser: '',//user_id of search user
            name: '',
        });
    }
    const handleImageChange = async(e) => {
        if (e.target.files.length > 0 && message.images.length<10) {
            //clear
            message.images=[];
            message.base64Images=[];
            //make an array copy
            let files = [];
            for (const file of e.target.files){
                files.push(file);
            }
            Promise.all(
                files.map(async(item)=>{
                    let base64=await encodeImageFileAsURL(item);
                    message.base64Images.push(base64);
                })
            )
            setMessage({ ...message, images: [...e.target.files] });
            return true;
        }
        return false;
    }
    console.log(`re-render from Chat.js`);
    useEffect(() => {
        if(window.location.hostname.indexOf('local')!==-1){
        socket = io('http://localhost:3001');
        }else{
            console.log('production')
            socket=io();//`${window.location.protocol}//${window.location.hostname}`
        }
        return () => {
            socket.disconnect();
        }
    }, []);
    useEffect(() => {
        socket.off('receive-message').on('receive-message', (message, room) => {
            console.log('useEffect receive messsage update');
            if (room === selectedChatRoom) {
                handleSelectChatRoom(message, room); //update message
            }
        });
         socket.off('receive-chatrooms-update').on('receive-chatrooms-update', async(chatrooms)=>{
            console.log('update chatrooms');
            if(chatrooms?.doc){
                setChatRooms([...chatrooms.doc]);
            }else{
                const chatrooms = await getData(`api/chats/chat-rooms`);
                setChatRooms([...chatrooms.doc]);
            }
        });
        scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
    });
    //join chatroom
    useEffect(() => {
        if (!selectedChatRoom) return false;
        console.log('joining');
        const rooms = [selectedChatRoom, loggedInUser?.user_id?._id]
        socket.emit('join-room', rooms);
    }, [selectedChatRoom])
    return (
        <div>
            {chatRoomMessages?.length > 0 ? (
                <List className={classes.messageArea}>
                    {chatRoomMessages?.doc?.map((message) => (
                        <ListItem key={message._id}>
                            <Grid container>
                                <Grid item xs={12}>
                                    {message.sender._id === loggedInUser.user_id._id ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                            <StandardImageList itemData={message?.files} />
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                            <StandardImageList itemData={message?.files} />
                                        </Box>
                                    )}

                                    <ListItemText
                                        align={message.sender._id === loggedInUser.user_id._id ? 'right' : 'left'} primary={
                                            message.sender._id === loggedInUser.user_id._id ? (
                                                <>
                                                 <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: 'block',
                                                        color:'gray'
                                                    }}
                                                     >{"You"}
                                                </Typography>
                                                {message?.message && (
                                                <Typography
                                                    sx={{
                                                        backgroundColor: blue[800],
                                                        color: 'white',
                                                        padding: '5px 12px',
                                                        borderRadius: '50px',
                                                        display: 'inline-block'
                                                    }}
                                                    variant="body2" >{message?.message}
                                                </Typography>
                                                )}
                                                </>
                                            ) : (
                                                <>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: 'block',
                                                        color:'gray'
                                                    }}
                                                     >{fullname(message?.sender.name)}
                                                </Typography>
                                                <Box sx={{display:'flex'}}>
                                    <Avatar alt={fullname(message?.sender.name)}  sx={{
                                                            width: 30,
                                                            height: 30,
                                                            alignSelf:'center'
                                                        }} src={`/api/images/${message?.sender.photo}`} />
                                                {message.message && (
                                                <Typography
                                                className={
                                                    message.sender.role==='doctor'?'blue-800':
                                                    message.sender.role==='dentist'?'indigo-800':
                                                    message.sender.role==='nurse'?'pink-800'
                                                    :'grey-800'
                                                }
                                                    sx={{
                                                        color: 'white',
                                                        padding: '5px 12px',
                                                        borderRadius: '50px',
                                                        display: 'inline-block',
                                                        alignSelf:'center'
                                                    }}
                                                    variant="body2" >{message?.message}
                                                </Typography>
                                                )}
                                                </Box>
                                                </>
                                            )
                                        }>
                                    </ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <div ref={scrollRef}>
                                        <ListItemText align={message.sender._id === loggedInUser.user_id._id ? 'right' : 'left'} secondary={
                                            <Typography variant="caption" sx={{
                                                        color:'gray'
                                                    }} >
                                                {
                                                    formatDate(message.createdAt) === formatDate(new Date(Date.now())) ? (
                                                        `${moment(message.createdAt).startOf('hour').fromNow()} - ${moment(message.createdAt).format('LT')}`
                                                    ) : (
                                                        moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a')
                                                    )

                                                }
                                            </Typography>
                                        }></ListItemText>
                                    </div>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <List className={classes.messageArea}>
                    {selectedChatRoom ? (`No Conversation Found ${fullname(hasChatRoom?.name) || ''}`) : ("Select a Chatroom")}
                </List>

            )}
            {/* <form noValidate> */}
            <Grid container style={{ padding: '20px', border: '1px solid #e0e0e0' }}>
                <Grid item xs={12} sx={{display:'flex', flexDirection:'row', flexWrap:'wrap'}}>
                    {message.images.length > 0 ? (
                        message?.images?.map((item, i) =>(
                            <Avatar
                                key={i}
                                alt={`img`}
                                src={message.base64Images[i]}
                                variant='square'
                                margin="dense"
                                sx={{
                                    height: '10rem',
                                    width: '10rem',
                                }}
                            />
                        )
                        )
                    ) : ("")

                    }
                </Grid>
                <Grid item xs={11}>
                    <TextField
                        autoFocus
                        variant="outlined"
                        margin="dense"
                        label="Type Something"
                        name='message'
                        multiline
                        value={message.message}
                        onChange={handleChange}
                        onKeyUp={submitOnEnter}
                        fullWidth
                        disabled={processing}
                    />
                </Grid>
                <Grid item xs={1} align="right">
                    <Box color="primary" aria-label="add" onClick={(e) => handleSubmit(e)}>
                        <IconButton color="primary" aria-label="send message" component="span">
                            <SendIcon />
                        </IconButton>
                    </Box>
                    <Box color="primary" aria-label="add" >
                        <label htmlFor="icon-button-file">
                            <Input
                                disabled={processing}
                                accept="image/*"
                                id="icon-button-file"
                                multiple type="file"
                                name="photos"
                                onChange={handleImageChange}
                            />
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <AddPhotoAlternateIcon />
                            </IconButton>
                        </label>
                    </Box>
                </Grid>
            </Grid>
            {/* </form> */}

        </div>
    );
}

const StandardImageList = ({ itemData }) => {
    const {
        openImageModal,
        setOpenImageModal
    } = React.useContext(ChatContext);
    if (itemData.length === 0) return false;

    const handleClick = (img) => {
        console.log('img to open:', img);
        openImageModal.open = true;
        openImageModal.img = img;
        setOpenImageModal({ ...openImageModal });
    }
    return (
        <ImageList sx={{ width: "80%", height: 200 }} cols={3} rowHeight={100}>
            {itemData?.map((item, i) => {
                let path = hasFileExtension(
                                item
                              )
                                ? `/api/images/${item}`
                                :item;
                return(
                <ImageListItem key={i}>
                    <img
                        src={path}
                        srcSet={path}
                        alt='img'
                        loading="lazy"
                        onClick={() => { handleClick(path) }}
                    />
                </ImageListItem>
            )})}
        </ImageList>
    );
}


export default memo(Chat);