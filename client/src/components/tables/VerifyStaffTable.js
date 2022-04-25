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
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GlobalContext from '../../provider/GlobalProvider';
import { formatDate, fullname } from '../../utils/Utilities';


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
const VerifyStaffTable = ({ staffs }) => {
  const {
    sendVerification,
    updateData,
    setChange,
    change
  } = React.useContext(GlobalContext);
  const [disableButton, setDisableButton] = React.useState(false);
  const handleActivate = async (id) => {
    setDisableButton(true);
    const res = await updateData(`api/users/${id}`, { active: true });
    setDisableButton(false);
    setChange(!change);
  }
  const rows = staffs?.doc || [];
  const columns = [
    {
      field: 'createdAt', headerName: 'Date Created', width: 120, valueGetter: (params) => {
        return formatDate(params.row.log_id.createdAt)
      }
    },
    {
      field: 'employee_no', headerName: 'Employee No.', width: 150
    },
    {
      field: 'email', headerName: 'Email', editable: true, width: 150, valueGetter: (params) => {
        return (params.row.user_id.email)
      },
    },
    {
      field: 'Name', headerName: 'Name', editable: true, width: 150, valueGetter: (params) => {
        return fullname((params.row.user_id.name))
      },
    },

    {
      field: 'active',
      headerName: 'Active',
      width: 130,
      renderCell: (params) => {
        if (params.row.user_id.active) {
          return (
            <CheckCircleOutlineIcon sx={{ color: green[500] }} />
          );
        }
        return (
          <Button color="warning" disabled={disableButton} variant='contained' onClick={() => handleActivate(params.row.user_id._id)} >
            <VerifiedUserIcon />Activate
          </Button>
        );

      }
    },
    {
      field: 'verified',
      headerName: 'Verified',
      width: 250,
      renderCell: (params) => {
        if (params.row.user_id.verified) {
          return (
            <CheckCircleOutlineIcon sx={{ color: green[500] }} />
          );
        }
        return (
          <Button color="error" variant='contained' onClick={() => sendVerification(params.row.user_id.email)} >
            <SendIcon /> Send Verification
          </Button>
        );

      }
    },
  ];
  if (staffs?.doc?.length > 0) {
    return (
      <div style={{ height: '80vh', width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    );
  }
  return 'Loading..';
};

export default VerifyStaffTable;

