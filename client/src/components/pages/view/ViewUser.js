import React from 'react'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Container,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Paper,
    Button,
    Box

} from '@mui/material';
import AuthContext from '../../../provider/AuthProvider';
import {ChatProvider} from '../../../provider/ChatProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import NumbersIcon from '@mui/icons-material/Numbers';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { blue, red, pink, purple, green } from '@mui/material/colors';
import { formatDate, fullname, getYearSection } from '../../../utils/Utilities';
import { useNavigate } from "react-router-dom";
import { MedicalRecordAccordion } from './MedicalRecordAccordion';
const colors = {
    blue: blue[500],
    red: red[500],
    pink: pink[500],
    purple: purple[500],
    green: green[500],
    text: 'white'
}
const ViewUser = ({ medicalRecord, user }) => {
    const { loggedInUser } = React.useContext(AuthContext);
    const allowed = ['doctor', 'dentist', 'nurse'];
    const navigate = useNavigate();
    if (Object.entries(user).length !== 0) {
        const medicalRecordExist = medicalRecord.length !== 0;
        const basicInfo = [
            {
                text: user?.doc?.employee_no || user?.doc?.user_no,
                icon: <NumbersIcon />
            },
            {
                text: user?.doc?.civil_status,
                icon: <AccountCircleIcon />
            },
            {
                text: user?.doc?.sex.toUpperCase(),
                icon: <WcIcon />
            },
            {
                text: user?.doc?.age,
                icon: <DateRangeIcon />
            },
            {
                text: formatDate(user?.doc?.birthday),
                icon: <CakeIcon />
            },
            {
                text: user?.doc?.user_id?.email,
                icon: <AlternateEmailIcon />
            }
        ]
        if (!loggedInUser) {
            return 'Authenticating...'
        }
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
                            {user.doc.user_id.role === 'student' ? (
                                <Typography variant="h5" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
                                    {getYearSection(user.doc)}
                                </Typography>
                            ) : (
                                <Typography variant="h5" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
                                    {user.doc.department_id.department}
                                </Typography>
                            )

                            }

                        </Grid>
                        <Grid item xs={12}>
                            {
                                allowed.includes(loggedInUser.user_id.role) ? (
                                    <Accordion >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"

                                        >
                                            <List>
                                                <ListItem sx={{ padding: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <MedicalServicesIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={medicalRecordExist ? 'Medical Record' : "No Medical Record Found"}
                                                    />
                                                </ListItem>
                                            </List>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {
                                                medicalRecordExist ? (
                                                    <div>
                                                        {medicalRecord?.doc?.map((medicalRecord, i) => (
                                                            <div key={i}>
                                                            <ChatProvider>
                                                           <MedicalRecordAccordion medicalRecord={medicalRecord}/>
                                                            </ChatProvider>
                                                            </div>

                                                        ))}
                                                    </div>
                                                )
                                                    : (
                                                        <Typography variant='h5'>
                                                            Medical Record of Patient Will Appear Here
                                                        </Typography>
                                                    )
                                            }

                                        </AccordionDetails>
                                    </Accordion>
                                ) : ("")
                            }
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ paddingTop: 5, paddingBottom: 5 }}>
                            <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
                                {/* Address */}
                                <Typography variant="h6" gutterBottom component="div">
                                    Address
                                </Typography>
                                <List>
                                    {user.doc?.address?.map((item, i) => (
                                        <ListItem key={i}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <HomeIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${item.house_number} ${item.street} ${item.barangay} ${item.municipality} ${item.city_province}`}
                                            />
                                        </ListItem>
                                    ))}

                                </List>
                                {/* Contact */}
                                <Typography variant="h6" gutterBottom component="div">
                                    Contact
                                </Typography>
                                <List>
                                    {user.doc?.contact?.map((item, i) => (
                                        <ListItem
                                            key={item.id}
                                        >
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <PhoneIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${item.contact}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
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

export default ViewUser