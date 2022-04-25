import React from 'react'
import {
    Typography,
    Grid,
    Container,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Paper,
    Button

} from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { blue } from '@mui/material/colors';
import { fullname,  } from '../../../utils/Utilities';
import { useNavigate } from "react-router-dom";

const ViewPhysician = ({ user }) => {
    const navigate = useNavigate();
    if (Object.entries(user).length !== 0) {
        const basicInfo = [
            {
                text: `PRC License: ${user?.doc?.prc_license}`,
                icon: <ReceiptLongIcon />
            },
            {
                text:   `PTR No. ${user?.doc?.ptr_no}`,
                icon: <NumbersIcon />
            },
            {
                text: user?.doc?.user_id?.email,
                icon: <AlternateEmailIcon />
            }
        ]
        return (
            <>
                <Container>
                    <Button
                        component="a"
                        startIcon={(<ArrowBackIcon fontSize="small" />)}
                        sx={{ mt: 3 }}
                        variant="contained"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                    <Grid container spacing={3}>
                        <Grid item xs={12} >
                            <Avatar

                                alt={fullname(user?.doc?.name).toUpperCase()}
                                src={`/api/images/${user?.doc?.photo}`}
                                sx={{
                                    width: 200,
                                    height: 200,
                                    bgcolor: blue[500],
                                    fontSize: 40,
                                    boxShadow: 3,
                                    margin: 'auto'
                                }}
                            />
                            <Typography variant="h4" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
                                {fullname(user?.doc?.name).toUpperCase()}
                            </Typography>
                            <Typography variant="h5" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
                                {user.doc.user_id.role}
                            </Typography>

                        </Grid>
                        <Grid item xs={12} md={6} sx={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    About
                                </Typography>
                                <Typography variant="body1" gutterBottom component="div">
                                    {user.doc.details}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Basic Info
                                </Typography>
                                <List>
                                    {basicInfo?.map((item, i) => (
                                        <ListItem key={i}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {item.icon}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.text}
                                            />
                                        </ListItem>
                                    ))}

                                </List>
                            </Paper>
                        </Grid>
                    </Grid>

                </Container>
            </>
        )
    }
    return 'Loading...'
}

export default ViewPhysician