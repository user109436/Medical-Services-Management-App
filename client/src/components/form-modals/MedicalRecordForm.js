import React, { useState, useContext, useEffect, memo } from 'react'
import {
    TextField,
    Button,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Autocomplete,
    Avatar,
    Alert,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Paper

} from "@mui/material";
import { blue, red } from '@mui/material/colors';
import GlobalContext from '../../provider/GlobalProvider';
import AuthContext from '../../provider/AuthProvider';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { addLabelField, fullname, formatDate } from '../../utils/Utilities';
import { useJwt } from "react-jwt";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import ScienceIcon from '@mui/icons-material/Science';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import MedicationIcon from '@mui/icons-material/Medication';



const MedicalRecordForm = () => {
    const { getData, addData, updateData, setMessage, message } = useContext(GlobalContext);
    const { auth } = useContext(AuthContext);
    const [medicalRecord, setMedicalRecord] = useState({});
    const [medicalRecordForm, setMedicalRecordForm] = useState({
        medicalRecordID: "",
        symptoms: [],
        diagnosis: [],
        laboratories: [],
        prescriptions: [{
            medicine: [],
            physician_id: ""
        }],
        //for previews only
        name: "",
        photo: "",
        //__________________
        user_id: "",//patient id from: select patient
        physician_id: "", //from jwt decode/ currently log-in physician,
        nameError: false// for selecting patient
    });
    const [medicalRecordList, setMedicalRecordList] = useState({ selectedMedicalRecord: "",date:"", doc: [] });
    const [users, setUsers] = useState([]);//merge of students & staffs model
    const [initForm, setInitForm] = useState({
        selectedID: "", //IMPORTANT:for editing items
        symptom: "",
        diagnose: "",
        laboratory: "",
        //temporarily store and then push to prescription.medicine
        details: "",
        detailsError: false,
        symptomError: false,
        laboratoryError: false,

    });
    //rows and cols for table
    const [symptomsData, setSymptomsData] = useState({
        rows: "",
        columns: [
            {
                field: 'symptom', headerName: 'Symptoms', width: 400, editable: true
            }
        ],
        field: 'symptom'
    });
    const [diagnosisData, setDiagnosisData] = useState({
        rows: "",
        columns: [
            {
                field: 'diagnose', headerName: 'Diagnosis', width: 400, editable: true
            }
        ],
        field: 'diagnose'

    });
    const [laboratoriesData, setLaboratoriesData] = useState({
        rows: "",
        columns: [
            {
                field: 'laboratory', headerName: 'Laboratories', width: 400, editable: true
            }
        ],
        field: 'laboratory'
    });
    const [prescriptionData, setPrescriptionData] = useState({
        rows: "",
        columns: [
            {
                field: 'createdAt', headerName: 'Date Issued', width: 120
            },
            {
                field: 'details', headerName: 'Details', width: 300, editable: true
            },
            {
                field: 'physician', headerName: 'Prescribe by:', width: 200
            },
        ],
        field: 'details'

    });
    const dataArray = [//will be used in looping datagrid
        {
            title: 'Symptoms',
            data: symptomsData,
        },
        {
            title: 'Diagnosis',
            data: diagnosisData,
        },
        {
            title: 'Laboratories',
            data: laboratoriesData,
        },
        {
            title: 'Prescriptions',
            data: prescriptionData,
        }

    ]
    const { decodedToken } = useJwt(localStorage.getItem('token'));

    const dataArrayPreview = [ //will be used for the editable preview of FORM (Blue Print)
        {
            title: 'Symptoms',
            icon: <CoronavirusIcon fontSize="small" />,
            singular: 'symptom',
            plural: 'symptoms',
            data: medicalRecordForm?.symptoms
        },
        {
            title: 'Diagnosis',
            icon: <FindInPageIcon fontSize="small" />,
            singular: 'diagnose',
            plural: 'diagnosis',
            data: medicalRecordForm?.diagnosis
        },
        {
            title: 'Laboratories',
            icon: <ScienceIcon fontSize="small" />,
            singular: 'laboratory',
            plural: 'laboratories',
            data: medicalRecordForm?.laboratories
        },
        {
            title: 'Prescriptions',
            icon: <MedicationIcon fontSize="small" />,
            singular: 'details',
            plural: 'details',
            data: medicalRecordForm?.prescriptions[0]?.medicine
        }

    ]
    const getPhysicianByUserId = async (id) => {
        if (!id) return false;
        const res = await getData(`api/physicians/user-id/${id}`);
        if (!res) {
            return false;
        }
        return res.doc[0]._id;
    }
    const idExist = (item, idToCompare, field) => {
        if (item.id === initForm[idToCompare]) {
            item[field] = initForm[field];
            item.id = initForm[idToCompare];
            initForm[idToCompare] = "";
            initForm[field] = "";
            setMedicalRecordForm({ ...medicalRecordForm });
            setInitForm({ ...initForm });
            return true;
        }
        return false;
    }
    //ordinary array objects
    const addToMedicalForm = async (input, field) => {
        initForm[`${field}Error`] = false;
        setInitForm({ ...initForm });
        if (input) {
            let field2 = '', id = new Date().getTime().toString();
            if (field === 'diagnose') field2 = 'diagnosis';
            if (field === 'laboratory') field2 = 'laboratories';
            if (field === 'symptom') field2 = 'symptoms';

            if (initForm.selectedID) {//:IMPORTANT:for editing/updating items
                if (field === 'details') {//necessary
                    medicalRecordForm.prescriptions[0].medicine.forEach((item) => {
                        idExist(item, 'selectedID', field);
                    });
                    return true;
                }
                medicalRecordForm[field2].forEach((item) => {
                    idExist(item, 'selectedID', field);
                });
                return true;
            }
            let obj = {
                id,
                [field]: input
            }
            if (field === 'details') {//necessary -nested array objects
                const technicals = ['encoder', 'admin'];
                if (!medicalRecordForm.prescriptions[0].physician_id && !technicals.includes(decodedToken.role)) {
                    medicalRecordForm.prescriptions[0].physician_id = await getPhysicianByUserId(decodedToken.id);
                }
                medicalRecordForm.prescriptions[0].medicine.push(obj);
            } else { //ordinary array objects
                medicalRecordForm[field2].push(obj);
            }
            initForm[field] = '';
            setInitForm({ ...initForm });
            return true;
        }
        initForm[`${field}Error`] = true;
        setInitForm({ ...initForm });
    }
    const removeItem = (id, field) => {
        let newFields;
        if (field === 'details') {//medicines array
            newFields = medicalRecordForm.prescriptions[0].medicine.filter(item => item.id !== id);
            medicalRecordForm.prescriptions[0].medicine = [...newFields];
            setMedicalRecordForm({ ...medicalRecordForm });
            return true;
        }
        newFields = medicalRecordForm[field].filter(item => item.id !== id);
        setMedicalRecordForm({ ...medicalRecordForm, [field]: [...newFields] });
    }
    const editItem = (item, field) => {
        initForm.selectedID = item.id;
        initForm[field] = item[field];
        setInitForm({ ...initForm });
    }
    //fetch all medical record and populate it in medical records select
    const fetchMedicalRecords = async (e, child) => {//from autocomplete: select patient
        if (!child) return false;
        medicalRecordForm.user_id = child.user_id._id;
        medicalRecordForm.name = fullname(child?.name);
        medicalRecordForm.photo = child?.photo;
        //fetch all records
        let resMedicalRecord = await getData(`api/medical-records/user/${medicalRecordForm.user_id}`);

        //populate select medical record
        if (resMedicalRecord.length > 0) {
            addLabelField(resMedicalRecord.doc, 'createdAt');
            setMedicalRecordList({ ...medicalRecordList, doc: [...resMedicalRecord.doc] });
            setMedicalRecordForm({ ...medicalRecordForm });
        }

    }

    //will fetch specific medical record for editing
    const handleSelectedMedicalRecord = async (e, child) => {//from autocomplete: select medical record
        if (!child) return false;
        setMedicalRecordList({ ...medicalRecordList, selectedMedicalRecord: child._id, date:child.label });
        let resMedicalRecord = await getData(`api/medical-records/${child._id}`);//TODO: change to fetch specific medical record
        console.log(resMedicalRecord);
        if (resMedicalRecord) {
            symptomsData.rows = resMedicalRecord.doc.symptoms;
            laboratoriesData.rows = resMedicalRecord.doc.laboratories;
            diagnosisData.rows = resMedicalRecord.doc.diagnosis;

            setSymptomsData({ ...symptomsData });
            setDiagnosisData({ ...diagnosisData });
            setLaboratoriesData({ ...laboratoriesData });
            //merge all rows of medicine include doctor per prescription
            let prescriptions = []; //note:prescription would not be editable because it has a refernce of medicine name in Medicine Model
            resMedicalRecord?.doc?.prescriptions.forEach((item) => {
                item.medicine.forEach((meds) => {
                    let newObj = {};
                    newObj.physician = fullname(item.physician_id.name);
                    newObj.details = meds.details
                    newObj.id = meds._id; //id of details
                    newObj.createdAt = formatDate(item.createdAt);
                    prescriptions.push(newObj);
                })
            });
            prescriptionData.rows = prescriptions;
            setPrescriptionData({ ...prescriptionData });
            medicalRecordForm.medicalRecordID = resMedicalRecord.doc._id;
            setMedicalRecordForm({ ...medicalRecordForm });
        }
        // if role is admin do not assign id
        const technicals = ['encoder', 'admin'];
        if (!technicals.includes(decodedToken.role)) {
            medicalRecordForm.physician_id = await getPhysicianByUserId(decodedToken.id);//do not overwrite physician id if already exist
        }
        setMedicalRecordForm({ ...medicalRecordForm });
        setMedicalRecord(resMedicalRecord);
    }
    const handleSubmit = async () => {
        medicalRecordForm.nameError = false;
        setMedicalRecordForm({ ...medicalRecordForm });
        let error = 0;
        if (!medicalRecordForm.user_id) {
            medicalRecordForm.nameError = true;
            error++;
        }
        //atleast 1 field is filled, form should not be totally empty when saving
        let diagnosis = medicalRecordForm.diagnosis.length;
        let symptoms = medicalRecordForm.symptoms.length;
        let laboratories = medicalRecordForm.laboratories.length;
        let medicines = medicalRecordForm.prescriptions[0].medicine.length;//prescriptions
        let hasContent = diagnosis || symptoms || laboratories || medicines;

        if (!hasContent) {
            setMessage({ text: 'Medical Record Form Should Contain atleast 1 entry when Saving', success: false });
            return false;
        }
        if (error) {
            setMedicalRecordForm({ ...medicalRecordForm });
            setMessage({ text: 'Medical Record Form must have an Owner', success: false });
            return false;
        }
        const technicals = ['encoder', 'admin']; //technicals does not have right to make or update medical records 
        if (technicals.includes(decodedToken.role)) {
            setMessage({ text: 'Only Physicians can make/update Medical Records', success: false });
            return false;
        }
        if (!medicines) {
            delete medicalRecordForm.prescriptions;
        }
        // update - copy contents of medicalRecordForm to medicalRecord: -submit medicalRecord
        if (medicalRecordForm.medicalRecordID) {
            let { diagnosis, symptoms, laboratories, prescriptions } = medicalRecordForm;
            let { doc } = medicalRecord;
            // console.log(symptoms);
            medicalRecord.doc.symptoms = [...symptoms, ...doc.symptoms];
            medicalRecord.doc.diagnosis = [...diagnosis, ...doc.diagnosis];
            medicalRecord.doc.laboratories = [...laboratories, ...doc.laboratories];
            if (medicines) {//this will prevent sending empty objects
                medicalRecord.doc.prescriptions = [...prescriptions, ...doc.prescriptions];
            }
            const res = updateData(`api/medical-records/${medicalRecordForm.medicalRecordID}`, medicalRecord.doc);
            if (!res) {
                return false;
            }
            handleClear();
            setMessage({ text: `Medical Record of ${medicalRecordForm.name}  Successfully Updated`, success: true });
            return true;
        }
        // create - submit medicalRecordForm
        if(!medicalRecordForm.physician_id)medicalRecordForm.physician_id=await getPhysicianByUserId(decodedToken.id);
        const res = await addData(`api/medical-records`, medicalRecordForm);
        if (!res) {
            return false;
        }
        //reset
        handleClear();
        setMessage({ text: `Medical Record of ${medicalRecordForm.name}  Successfully Saved`, success: true });

    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInitForm({ ...initForm, [name]: value });
    }
    const handleClear = () => {
        setMedicalRecord({});
        setMessage({ text: '' });
        setMedicalRecordForm({
            ...medicalRecordForm,
            medicalRecordID: "",
            symptoms: [],
            diagnosis: [],
            laboratories: [],
            prescriptions: [{
                medicine: [],
                physician_id: ""
            }],
            name: "",
            photo: "",
            //__________________
            user_id: "",
            physician_id: "",
            nameError: false
        });
        setInitForm({
            ...initForm,
            selectedID: "",
            symptom: "",
            diagnose: "",
            laboratory: "",
            id: "",
            details: "",
            medicine: "",
            detailsError: false,
            symptomError: false,
            laboratoryError: false,
            medicineError: false,
        });
        setMedicalRecordList({ selectedMedicalRecord: "",date:"", doc: [] });
    }
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
        fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (users.length === 0 || !auth) {
        return 'Loading...';
    }
    return (
        <>
            <Box component="div" sx={{ padding: 2, overflowY: 'scroll', height: '100%', marginBottom: 5 }}>
                <Typography sx={{ marginBottom: 2 }}>Medical Record Form</Typography>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleSubmit}
                >
                    SAVE
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={handleClear}
                >
                    CLEAR
                </Button>
                <form noValidate className='w-full' >
                    {
                        message.text ?
                            <Alert
                                severity={message.success ? 'success' : "error"}
                            >
                                {message.text}
                            </Alert> : ""
                    }
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Avatar
                            src={`/api/images/${medicalRecordForm?.photo}`}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: blue[500],
                                fontSize: 40, boxShadow: 3,
                            }}
                        />
                    </Box>
                    <Autocomplete
                        sx={{ marginTop: 2 }}
                        clearOnEscape
                        options={users || []}
                        defaultValue={users.find((v) => v.label)}
                        fullWidth
                        onChange={fetchMedicalRecords}
                        size="small"
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        renderInput={(params) => (
                            <TextField {...params}
                                name="name"
                                error={medicalRecordForm.nameError}
                                required
                                onChange={handleChange}
                                label={`Selected Patient:${medicalRecordForm.name ? medicalRecordForm.name : ""}`} />
                        )}
                    />
                    {/* <Autocomplete
                        sx={{ marginTop: 2 }}
                        clearOnEscape
                        options={medicalRecordList?.doc || []}
                        defaultValue={medicalRecordList?.doc?.find((v) => v.label)}
                        fullWidth
                        onChange={handleSelectedMedicalRecord}
                        size="small"
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        renderInput={(params) => (
                            <TextField {...params}
                                name="selectedMedicalRecord"
                                onChange={handleSelectedMedicalRecord}
                                label={`Selected Medical Record:`}
                            />
                        )}
                    /> */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', aligntItems: 'center' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="symptom"
                            name="symptom"
                            label="Symptom"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="ex. High Fever"
                            error={initForm.symptomError}
                            value={initForm.symptom}
                            variant="standard"
                            onChange={handleChange}
                            size="small"
                        />
                        <Button color="primary" sx={{ width: 150 }} onClick={() => addToMedicalForm(initForm.symptom, 'symptom')} >
                            <AddCircleIcon fontSize="large" /> Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', aligntItems: 'center' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="diagnose"
                            name="diagnose"
                            label="Diagnosis"
                            placeholder="ex. Sugar Levels"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={4}
                            error={initForm.diagnoseError}
                            value={initForm.diagnose}
                            variant="standard"
                            onChange={handleChange}
                            size="small"
                        />
                        <Button color="primary" sx={{ width: 150 }} onClick={() => addToMedicalForm(initForm.diagnose, 'diagnose')}>
                            <AddCircleIcon fontSize="large" /> Add
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', aligntItems: 'center', marginBottom: 5 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="laboratory"
                            name="laboratory"
                            label="Laboratory"
                            placeholder="ex. Urinary Test"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={4}
                            error={initForm.laboratoryError}
                            value={initForm.laboratory}
                            variant="standard"
                            onChange={handleChange}
                            size="small"
                        />
                        <Button color="primary" sx={{ width: 150 }} onClick={() => addToMedicalForm(initForm.laboratory, 'laboratory')} >
                            <AddCircleIcon fontSize="large" /> Add
                        </Button>
                    </Box>
                    {/* Prescription */}
                    <Typography sx={{ marginBottom: 2 }}>Prescription</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', aligntItems: 'center', marginBottom: 5 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="details"
                            name="details"
                            label="Prescription Details"
                            placeholder="ex. 500mg 2x a day for 2 weeks"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={4}
                            error={initForm.detailsError}
                            value={initForm.details}
                            variant="standard"
                            onChange={handleChange}
                            size="small"
                        />
                        <Button color="primary" sx={{ width: 150 }} onClick={() => addToMedicalForm(initForm.details, 'details')}>
                            <AddCircleIcon fontSize="large" /> Add
                        </Button>
                    </Box>
                </form>
                <Divider />
                {/* list all added fields */}
                <Box sx={{ marginBottom: 10 }}>
                    <Typography sx={{ marginBottom: 2 }}>Form Blue Print</Typography>
                    <List>
                        {dataArrayPreview?.map((obj, i) => (
                            <div key={i}>
                                <Typography sx={{ marginBottom: 2 }}>{obj.title}</Typography>
                                {obj.data?.map((item, i) => (
                                    <ListItem
                                        disableGutters
                                        dense
                                        key={item.id}
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => removeItem(item.id, obj.plural)} >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{ width: 28, height: 28, bgcolor: red[500] }}
                                            >
                                                {obj.icon}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            onClick={() => editItem(item, obj.singular)}
                                            primary={item[obj.singular]}
                                        />
                                    </ListItem>
                                ))}
                            </div>
                        )
                        )
                        }

                    </List>
                </Box>
                <Divider />
                {medicalRecord?.doc ? (
                    <Box component="div" sx={{ marginTop: 2, marginBottom: 15 }}>
                        {dataArray.map((item, i) => (
                            <Accordion key={i} sx={{ boxShadow: 3, backgroundColor: blue[500], color: 'white' }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography >{item.title}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Paper>
                                        {
                                            message.text ?
                                                <Alert
                                                    severity={message.success ? 'success' : "error"}
                                                >
                                                    {message.text}
                                                </Alert> : ""
                                        }
                                        <MedicalRecordTable
                                            data={item.data}
                                            setInitForm={setInitForm}
                                            initForm={initForm}
                                            medicalRecord={medicalRecord}
                                            setMedicalRecord={setMedicalRecord}
                                        />
                                    </Paper>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : ("")}

            </Box>
        </>
    )
}

function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}
const MedicalRecordTable = ({ data, initForm, setInitForm, medicalRecord, setMedicalRecord }) => {
    const { updateData, setMessage } = useContext(GlobalContext);
    const rows = data.rows || [];
    const columns = data.columns || [];
    const handleCommit = async (e) => {
        let update = false, text = '';
        if (data.field === 'symptom') {
            medicalRecord?.doc?.symptoms?.map((item) => {
                if (item.id === e.id) {
                    item.symptom = e.value;
                    update = true;
                    text = `Symptom:${e.value}`
                    return true;
                }
                return false;
            })
        }
        if (data.field === 'laboratory') {
            medicalRecord?.doc?.laboratories?.map((item) => {
                if (item.id === e.id) {
                    item.laboratory = e.value;
                    update = true;
                    text = `Laboratory:${e.value}`
                    return true;
                }
                return false;
            })
        }
        if (data.field === 'diagnose') {
            medicalRecord?.doc?.diagnosis?.map((item) => {
                if (item.id === e.id) {
                    item.diagnose = e.value;
                    update = true;
                    text = `Diagnosis:${e.value}`
                    return true;
                }
                return false;
            })
        }
        if (data.field === 'details') {
            medicalRecord?.doc?.prescriptions?.map((item) => {
                item.medicine.map((med) => {
                    if (med._id === e.id) {
                        med.details = e.value;
                        update = true;
                        text = `Prescription:${e.value}`;
                        return true;
                    }
                    return false;
                });
                return false;
            })
        }
        if (update) {//update db
            text += ' Saved';
            const res = await updateData(`api/medical-records/${medicalRecord?.doc._id}`, medicalRecord.doc);
            if (!res) {
                return false;
            }
            setMessage({ text, success: true });
            setMedicalRecord({ ...res });
        }
    }
    return (
        <div style={{ height: '50vh', width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                components={{
                    Toolbar: CustomToolbar,
                }}
                onCellEditCommit={handleCommit}
            />
        </div>
    );
};
export default memo(MedicalRecordForm)