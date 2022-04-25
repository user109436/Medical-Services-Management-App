import React from 'react'
import Chat from '../chats/Chat';
import ChatRooms from '../chats/ChatRooms';
import MedicalRecordForm from '../form-modals/MedicalRecordForm';
import ChatImageForm from '../form-modals/ChatImageForm';
import { makeStyles } from '@mui/styles';
import {
  Grid
} from '@mui/material';
import AuthContext from '../../provider/AuthProvider';
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
const Chats = () => {
  const { loggedInUser } = React.useContext(AuthContext);
  const technicals = ['admin', 'encoder'];
  const classes = useStyles();
  if (!loggedInUser) {
    return 'Authenticating...';
  }
  return (
    <>
      <ChatImageForm />
      <Grid container className={classes.chatSection} >
        <Grid item xs={!technicals.includes(loggedInUser.user_id.role)?3:3} className={classes.borderRight500}>
          <ChatRooms />
        </Grid>
        <Grid item xs={!technicals.includes(loggedInUser.user_id.role)?5:9}>
          <Chat />
        </Grid>
        {!technicals.includes(loggedInUser.user_id.role) ? (
          <Grid item xs={4} sx={{ height: '100%' }}>
            <MedicalRecordForm />
          </Grid>
        ) : ("")}
      </Grid>
    </>
  )
}

export default Chats;
