import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { red, green } from '@mui/material/colors';
import {
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SendIcon from '@mui/icons-material/Send';
import GlobalContext from '../../provider/GlobalProvider';
import UserContext from '../../provider/UserProvider';
import { formatDate } from '../../utils/Utilities'


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
const UserTable = () => {
  const {
    users,
    userForm,
    setUserForm
  } = React.useContext(UserContext);
  const {
    setOpen,
    sendVerification
  } = React.useContext(GlobalContext);
  const rows = users?.doc || [];
  const columns = [
    {
      field: 'createdAt', headerName: 'Date Created', width: 130, valueGetter: (params) => {
        return formatDate(params.row.log_id.createdAt)
      }
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Account Type', width: 150 },
    {
      field: 'active',
      headerName: 'Active',
      width: 150,
      renderCell: (params) => {
        if (params.row.active) {
          return (
            <CheckCircleOutlineIcon sx={{ color: green[500] }} />
          );
        }
        return (
          <CancelOutlinedIcon sx={{ color: red[500] }} />
        );

      }
    },
    {
      field: 'verified',
      headerName: 'Verified',
      width: 250,
      renderCell: (params) => {
        if (params.row.verified) {
          return (
            <CheckCircleOutlineIcon sx={{ color: green[500] }} />
          );
        }
        return (
          // <CancelOutlinedIcon sx={{ color: red[500] }} />
          <Button color="error" variant='contained' onClick={()=>sendVerification(params.row.email)}>
            <SendIcon/> Send Verification
          </Button>
        );

      }
    },
  ];
  const handleClick = (e) => {
    //show data on screen
    userForm.selectedID = e.row._id;
    userForm.email = e.row.email;
    userForm.active = e.row.active;
    userForm.role = e.row.role;
    userForm.password = '';
    setUserForm({ ...userForm });
    setOpen(true);
  }
  if (users?.doc?.length > 0) {
    return (
      <div style={{ height: '80vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          components={{
            Toolbar: CustomToolbar,
          }}
          onRowDoubleClick={handleClick}
        />
      </div>
    );
  }
  return 'Loading..';
};

export default UserTable;

