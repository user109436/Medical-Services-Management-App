import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../../../provider/GlobalProvider';
import { useParams } from 'react-router-dom';
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
    Divider,
    Box,
    ImageList,
    ImageListItem

} from '@mui/material';
import ChatContext from '../../../provider/ChatProvider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import NumbersIcon from '@mui/icons-material/Numbers';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ScienceIcon from '@mui/icons-material/Science';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { blue, red, pink, purple, green } from '@mui/material/colors';
import { formatDate, fullname, getYearSection } from '../../../utils/Utilities';
import ChatImageForm from '../../form-modals/ChatImageForm';
const colors = {
    blue: blue[500],
    red: red[500],
    pink: pink[500],
    purple: purple[500],
    green: green[500],
    text: 'white'
}
// PROVIDER

const ViewMedicalRecord = () => {
    const { getData } = useContext(GlobalContext);
    const [medicalRecord, setMedicalRecord] = useState(null);
    const [laboratoriesImg, setLaboratiesImg]=useState([]);
    const [user, setUser] = useState(null);
    const { id } = useParams(); //id must be a medical record id
    /* 
    specific prescription = #
    whole prescription= ##
    basic info = ? 
    laboratoriesImagesFromChats= #lab
    */
    //example: http://localhost:3003/view-medical-record/6208aeec0b1e05bafb60f413/?/#623157b76c6c5c265db41c3b
    const url = window.location.href;//for prescription & basic-info
    let prescriptionID, prescriptionActive, infoActive, laboratoriesActive;
    if (url) {//add red border to accordion
        infoActive = url.indexOf("?") !== -1;
        prescriptionActive = url.indexOf("##") !== -1;
        laboratoriesActive = url.indexOf("#lab") !== -1;
        prescriptionID = url.substr(url.indexOf("#") + 1, url.length);
    }


    const downloadPrescriptionRecord = async (e, id) => {
        e.stopPropagation();
        let host = 'https://e-consultation-app.herokuapp.com';
        window.open(`${host}/api/medical-records/${medicalRecord.doc._id}/prescriptions/${id}/export`, '_self');
    }
    //DEFAULT VIEW
    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const res = await getData(`api/medical-records/${id}`);
                const laboratories = await getData(`api/medical-records/${id}/laboratories`);
                const user = await getData(`api/medical-records/${id}/patient-info`);
                let labImages=[];
                laboratories?.doc?.forEach((lab)=>{
                    lab.files?.forEach((file)=>{
                        labImages.push(file);
                    })
                })
                setLaboratiesImg([...labImages]);
                console.log(laboratories);
                setUser({ ...user });
                setMedicalRecord({ ...res });
                return true;
            }
        }
        fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            setUser(null);
            setMedicalRecord(null);
        }
    }, [id]);
    if (!user?.doc?.name || !medicalRecord) {
        return (
            <p>Loading.... if it takes too long it means record does not exist</p>
        );
    }

    if (id) {
        const basicInfo = [
            {
                text: user?.doc?.employee_no || user?.doc?.student_no,
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
            // {
            //     text: user?.doc?.user_id?.email,
            //     icon: <AlternateEmailIcon />
            // }
        ];
        console.log(laboratoriesImg);
        return (
            <>
                <Container>
                <ChatImageForm/>
                    <Grid container spacing={3}>
                        {/* Avatar */}
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
                            <Typography variant="h4" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize', flex: 1 }}>
                                {fullname(user?.doc?.name).toUpperCase()}
                            </Typography>
                            {user.doc.user_id.role === 'student' ? (
                                <Typography variant="h5" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize', flex: 1 }}>
                                    {getYearSection(user.doc)}
                                </Typography>
                            ) : (
                                <Typography variant="h5" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
                                    {user.doc.department_id.department}
                                </Typography>
                            )

                            }

                        </Grid>
                        {/* Basic Info */}
                        <Grid item xs={12} md={12}>
                            <Accordion
                                elevation={4}
                                className={infoActive ? 'active-accordion' : ''}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <List>
                                        <ListItem sx={{ padding: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <InfoIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={'Info'}
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionSummary>
                                <AccordionDetails sx={{ display: "flex", justifyContent: "space-between", flexWrap: 'wrap', padding: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" gutterBottom component="div">
                                            Basic Info
                                        </Typography>
                                        <List dense>
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
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        {/* Address */}
                                        <Typography variant="h6" gutterBottom component="div">
                                            Address
                                        </Typography>
                                        <List dense>
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
                                        <List dense>
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
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {/* Medical Record */}
                        <Grid item xs={12}>
                            <Accordion elevation={4} >
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
                                                primary={'Medical Record'}
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={1} sx={{ padding: 3, backgroundColor: colors.blue, color: colors.text }}>
                                                <Typography variant='h6'>
                                                    <FindInPageIcon /> Diagnosis
                                                </Typography>
                                                {medicalRecord.doc?.diagnosis.map((item, i) => (
                                                    <Typography key={i}>
                                                        - {item.diagnose}
                                                    </Typography>
                                                ))}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={1} sx={{ padding: 3, backgroundColor: colors.blue, color: colors.text }}>
                                                <Typography variant='h6'>
                                                    <ScienceIcon />   Laboratories
                                                </Typography>
                                                {medicalRecord.doc?.laboratories.map((item, i) => (
                                                    <Typography key={i}>
                                                        - {item.laboratory}
                                                    </Typography>
                                                ))}
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={1} sx={{ padding: 3, backgroundColor: colors.blue, color: colors.text }}>
                                                <Typography variant='h6'>
                                                    <CoronavirusIcon /> Symptoms
                                                </Typography>
                                                {medicalRecord.doc.symptoms.map((item, i) => (
                                                    <Typography key={i}>
                                                        - {item.symptom}
                                                    </Typography>
                                                ))}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        {/* Prescription */}
                        <Grid
                            item
                            xs={12}
                            className={prescriptionActive ? 'active-accordion' : ''}
                        >
                            <Typography variant='h6'>
                                Prescriptions
                            </Typography>
                            {medicalRecord?.doc?.prescriptions.reverse().map((item, i) => (

                                <Accordion
                                    key={i}
                                    id={item._id}
                                    elevation={4}
                                    className={prescriptionID === item._id ? 'active-accordion' : ''}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        sx={{
                                            justifyContent: 'space-between',
                                            flexWrap: "wrap"
                                        }}
                                        className="align-items-center"
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                xs={12}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: " space-evenly",
                                                    alignItems: "center",
                                                    flexWrap: "wrap"
                                                }}
                                            >
                                                <Avatar alt={fullname(item.physician_id.name).toUpperCase()}
                                                    src={`/api/images/${item.physician_id.photo}`}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        bgcolor: blue[500],
                                                        fontSize: 40,
                                                        boxShadow: 3,
                                                        alignContent: 'flex-start',
                                                        margin: 0,
                                                        marginRight: 3
                                                    }}
                                                />
                                                <Typography align="center" sx={{ marginRight: 3 }}>
                                                    {fullname(item.physician_id.name)}
                                                </Typography>
                                                <Typography
                                                    sx={{ marginRight: 3 }}>Date Issued:{formatDate(item.createdAt)}</Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={(e) => downloadPrescriptionRecord(e, item._id)}
                                                    size="small"
                                                    align="center"
                                                >
                                                    <DownloadIcon />
                                                    Download
                                                </Button>
                                            </Grid>
                                        </Grid>

                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Divider />
                                        {
                                            item?.medicine?.map((med, j) => (
                                                <Typography key={j} >
                                                    - {med.details}
                                                </Typography>
                                            ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                        <Typography variant='h6'>
                            {laboratoriesImg.length>0?'Laboratories Image':'No Laboratories Image Found'}
                        </Typography>
                        {laboratoriesImg.length>0?(
                        <Paper 
                        elevation={6} 
                        className={laboratoriesActive ? 'active-accordion' : ''}
                        >
                        <StandardImageList itemData={laboratoriesImg} />
                        </Paper>
                        ):("")}
                        </Grid>
                    </Grid>
                </Container>
            </>
        );

    }
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
        <ImageList sx={{ width: "100%", height: "80vh" }} cols={4} rowHeight={100}>
            {itemData?.map((item, i) => (
                <ImageListItem key={i}>
                    <img
                        src={`/api/images/${item}`}
                        srcSet={`/api/images/${item}`}
                        alt='img'
                        loading="lazy"
                        onClick={() => { handleClick(item) }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}


export default ViewMedicalRecord