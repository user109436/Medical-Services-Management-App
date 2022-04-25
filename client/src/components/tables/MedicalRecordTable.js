import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import GlobalContext from '../../provider/GlobalProvider';
import MedicalRecordContext from '../../provider/MedicalRecordProvider';



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
const MedicalRecordTable = () => {
  const {
    medicalRecords,
    setMedicalRecords,
    setMedicalRecordForm
  } = React.useContext(MedicalRecordContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows =medicalRecords?medicalRecords.doc:[]; //{_id:'1', year:'Year Name Goes Here'}
  const columns = [
    { field: 'user_id', headerName: 'Patient', flex:1 },
    { field: 'physician_id', headerName: 'Patient', flex:1 },
    { field: 'symptoms', headerName: 'Patient', flex:1 },


  ];
  const handleClick = (e) => {
    //show data on screen
    setMedicalRecordForm({year:e.row.year});
    setMedicalRecords({ ...medicalRecords,deleteUpdate:e.row });
    setOpen(true);
  }
  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row._id}
        components={{
          Toolbar: CustomToolbar,
        }}
        onRowClick={handleClick}
      />
    </div>
  );
};

export default MedicalRecordTable;

