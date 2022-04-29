import React from 'react';
import moment from 'moment';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    Avatar,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Paper,
    Button,
    Box,
    ImageList,
    ImageListItem

} from '@mui/material';
import AuthContext from '../../../provider/AuthProvider';
import ChatContext from '../../../provider/ChatProvider';
import { formatDate, fullname } from '../../../utils/Utilities';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ScienceIcon from '@mui/icons-material/Science';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import MedicationIcon from '@mui/icons-material/Medication';
import DownloadIcon from '@mui/icons-material/Download';
import { blue, red, pink, purple, green } from '@mui/material/colors';
import axios from 'axios';
import ChatImageForm from '../../form-modals/ChatImageForm';
import {hasFileExtension} from '../../../utils/Utilities'
const colors = {
    blue: blue[500],
    red: red[500],
    pink: pink[500],
    purple: purple[500],
    green: green[500],
    text: 'white'
}

export const MedicalRecordAccordion = ({ medicalRecord}) => {
    const { loggedInUser } = React.useContext(AuthContext);
    const [laboratoriesImg, setLaboratiesImg]=React.useState([]);
    const medicalRecordExist = Object.keys(medicalRecord).length !== 0;
    const allowedDownloads = ['doctor', 'dentist'];



    const downloadMedicalRecord = async (e) => {
        e.preventDefault();
        // QUICKFIX:DOWNLOAD MEDICAL RECORD
        window.open(`https://e-consultation-app.herokuapp.com/api/medical-records/${medicalRecord._id}/export`, '_self');
        // https://stackoverflow.com/questions/41938718/how-to-download-files-using-axios
    }
    const downloadPrescriptionRecord = async (id) => {
        let host = 'https://e-consultation-app.herokuapp.com';
        window.open(`${host}/api/medical-records/${medicalRecord._id}/prescriptions/${id}/export`, '_self');
    }
     React.useEffect(() => {
        const fetchData = async () => {
            try{
                const laboratories = await axios.get(`api/medical-records/${medicalRecord._id}/laboratories`);
                let labImages=[];
                laboratories?.data?.doc?.forEach((lab)=>{
                    lab.files?.forEach((file)=>{
                        labImages.push(file);
                    })
                })
                setLaboratiesImg([...labImages]);
                return true;
            }catch(e){
                console.log(e.response);
            }
                
        }
        fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (medicalRecordExist) {
        return (
            <>
                <ChatImageForm/>
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
                                    primary={moment(medicalRecord.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                                />
                            </ListItem>
                        </List>
                    </AccordionSummary>
                    <AccordionDetails>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                            {allowedDownloads.includes(loggedInUser.user_id.role)?(
                                <Button
                                    variant="outlined"
                                    color="primary"
                                onClick={downloadMedicalRecord}
                                >
                                    <DownloadIcon />
                                    Download Medical Record
                                </Button>
                            ):('')}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Paper elevation={1} sx={{ padding: 3, backgroundColor: colors.blue, color: colors.text }}>
                                    <Typography variant='h6'>
                                        <FindInPageIcon /> Diagnosis
                                    </Typography>
                                    {medicalRecord?.diagnosis?.map((item, i) => (
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
                                    {medicalRecord?.laboratories?.map((item, i) => (
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
                                    {medicalRecord?.symptoms?.map((item, i) => (
                                        <Typography key={i}>
                                            - {item.symptom}
                                        </Typography>
                                    ))}
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={1} sx={{ padding: 3, backgroundColor: colors.blue, color: colors.text }}>
                                    <Typography variant='h6'>
                                        <MedicationIcon /> Prescriptions
                                    </Typography>
                                    <br />
                                    <Grid container spacing={2}>
                                        {medicalRecord?.prescriptions.reverse()?.map((item, i) => (
                                            <Grid item xs={12} md={4} key={i}>
                                                <Paper elevation={1} sx={{ padding: 3 }}>
                                                    <Typography >
                                                        Date Issued:{formatDate(item.createdAt)}
                                                    </Typography>

                                                    <br />
                                                    {
                                                        item?.medicine?.map((med, j) => (
                                                            <Typography key={j} >
                                                                - {med.details}
                                                            </Typography>
                                                        ))}
                                                    <br />
                                                    <Avatar

                                                        alt={fullname(item.physician_id.name).toUpperCase()}
                                                        src={`/api/images/${item.physician_id.photo}`}
                                                        sx={{
                                                            width: 80,
                                                            height: 80,
                                                            bgcolor: blue[500],
                                                            fontSize: 40,
                                                            boxShadow: 3,
                                                            margin: 'auto'
                                                        }}
                                                    />
                                                    <Typography align="center">
                                                        Prescribed by:
                                                        <br />
                                                        {fullname(item.physician_id.name)}
                                                    </Typography>
                                                    <Box
                                                        sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}
                                                    >
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => downloadPrescriptionRecord(item._id)}
                                                            size="small"
                                                            align="center"
                                                        >
                                                            <DownloadIcon />
                                                            Download
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            </Grid>

                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                    </AccordionDetails>
                    <Grid container>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            {laboratoriesImg.length>0?'Laboratories Image':'No Laboratories Image Found'}
                        </Typography>
                        {laboratoriesImg.length>0?(
                        <Paper 
                        elevation={6} 
                        >
                        <StandardImageList itemData={laboratoriesImg} />
                        </Paper>
                        ):("")}
                        </Grid>
                    </Grid>
                </Accordion>
            </>
        )
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
            {itemData?.map((item, i) => {
                
                let path = hasFileExtension(
                                item
                              )
                                ? `/api/images/${item}`
                                :item;
                return (
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
