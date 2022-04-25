import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import {
  Grid,
  Typography
} from '@mui/material';
import GlobalContext from '../../../provider/GlobalProvider';
import { fullname, formatDate } from '../../../utils/Utilities'



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

const extractMedicalRecord = (activities, id) => {
  let medicalRecordActivitiy = [];
  let prescriptionsActivity = [];
  let staff_ids = [];
  let student_ids = [];
  if (activities.length === 0) return false;
  activities.forEach((activity) => {
    if (activity.user_id.role === 'student') {
      student_ids.push(activity.user_id._id);
    } else {
      staff_ids.push(activity.user_id._id);
    }
    if (activity?.physician_id._id === id) {
      medicalRecordActivitiy.push(activity.user_id);
    }
    if (activity?.prescriptions) {
      activity.prescriptions.forEach((prescription) => {
        if (prescription.physician_id._id === id) {
          let meds = '';
          prescription.medicine.forEach((med) => {
            meds += `${med.details}`
          })

          prescriptionsActivity.push({
            user_id: activity.user_id,
            medicines: meds,
            date: formatDate(prescription.createdAt)
          });
        }
      })
    }

  });
  return {
    medicalRecordActivitiy,
    prescriptionsActivity,
    staff_ids,
    student_ids
  }
}
const extractUser = (users, user_ids) => {
  let extractedUser = [];
  if (users.length === 0 && user_ids.length === 0) return false;
  users.forEach((user) => {
    if (user_ids.includes(user.user_id._id)) {
      extractedUser.push({ _id: user.user_id._id, name: user.name })
    }
  })
  return extractedUser;
}
const insertNameOnMedicalRecordActivity = (medicalRecordActivitiy, extractedUser) => {
  medicalRecordActivitiy.forEach((activity) => {
    extractedUser.forEach((user) => {
      if (activity._id === user._id) {
        activity.name = fullname(user.name);
        activity.uniqueID = makeid(32);

      }
    });
  })
}
const insertNameOnPrescriptionActivity = (prescriptionsActivity, extractedUser) => {
  prescriptionsActivity.forEach((activity) => {
    extractedUser.forEach((user) => {
      if (activity.user_id._id === user._id) {
        activity.name = fullname(user.name);
        activity.uniqueID = makeid(32);
      }
    });
  })
}
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
const PhysicianTable = ({ id }) => {
  const {
    getData
  } = React.useContext(GlobalContext);
  const [tableData, setTableData] = React.useState({
    medicalRecordActivitiy: "",
    prescriptionsActivity: ""
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const activities = await getData(`api/physicians/${id}/activities`);
      const staffs = await getData(`api/staffs`);
      const students = await getData(`api/students`);
      if(activities.doc.length===0){ //if no activities don't extract details
        return false;
      }
      const { medicalRecordActivitiy, prescriptionsActivity, staff_ids, student_ids } = extractMedicalRecord(activities?.doc, id);
      const extractedStaff = extractUser(staffs?.doc, staff_ids);
      const extractedStudent = extractUser(students?.doc, student_ids);
      if (extractedStudent.length > 0) {
        insertNameOnMedicalRecordActivity(medicalRecordActivitiy, extractedStudent);
        insertNameOnPrescriptionActivity(prescriptionsActivity, extractedStudent);
      }
      if (extractedStaff.length > 0) {
        insertNameOnMedicalRecordActivity(medicalRecordActivitiy, extractedStaff);
        insertNameOnPrescriptionActivity(prescriptionsActivity, extractedStaff);
      }
      setTableData({ medicalRecordActivitiy, prescriptionsActivity });
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  const medicalRecordRows = tableData?.medicalRecordActivitiy || [];
  const medicalRecordColumns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'role', headerName: 'Patient Type', width: 250 },
  ];
  const prescriptionRows = tableData?.prescriptionsActivity || [];
  const prescriptionColumns = [
    { field: 'date', headerName: 'Date Issued', width: 100,  editable:true },
    { field: 'name', headerName: 'Name', width: 350 },
    {
      field: 'role', headerName: 'Patient Type', width: 120, valueGetter: (params) => {
        return params.row.user_id.role
      }
    },
    { field: 'medicines', headerName: 'Medicines', width: 400, editable:true },


  ];
  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom component="div" sx={{paddingTop:2}}>
          Medical Records Created
        </Typography>
        <DataGrid
          rows={medicalRecordRows}
          columns={medicalRecordColumns}
          getRowId={(row) => row.uniqueID}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Grid>
      <Grid item xs={12}>
      <Typography variant="h6" gutterBottom component="div" sx={{paddingTop:6}}>
          Prescriptions Created
        </Typography>
        <DataGrid
          rows={prescriptionRows}
          columns={prescriptionColumns}
          getRowId={(row) => row.uniqueID}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default PhysicianTable;

