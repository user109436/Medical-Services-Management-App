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
import DepartmentContext from '../../provider/DepartmentProvider';



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

const DepartmentTable = () => {
  const {
    departments,
    setDepartments,
    setDepartmentForm
  } = React.useContext(DepartmentContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows =departments?.doc||[];
  const columns = [
    { field: 'department', headerName: 'Department', flex:1},
    { field: 'details', headerName: 'Details',flex:1 },

  ];
  const handleClick = (e) => {
    //show data on screen
    setDepartmentForm({department:e.row.department, details:e.row.details});
    setDepartments({ ...departments,deleteUpdate:e.row });
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

export default DepartmentTable;

