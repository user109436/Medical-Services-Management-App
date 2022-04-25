import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import GlobalContext from '../../../provider/GlobalProvider';
import {fullname} from '../../../utils/Utilities';
import moment from 'moment';
import {Typography} from '@mui/material';
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
const ActivityLogs = () => {
  const {getData}=React.useContext(GlobalContext);
  const [logs, setLogs]=React.useState(null);

  React.useEffect(()=>{
        const fetchData = async () => {
      const res = await getData('api/logs');
      console.log(res);
      setLogs(res);
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  if(!logs){
      return "Loading Activity Logs..."
  }
  const rows =logs?.doc||[];
  const columns = [
   {
      field: 'createdAt', headerName: 'Date Created', width: 230,valueGetter: (params) => {
        return moment(params.row.createdAt).format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    {
      field: 'name', headerName: 'Name', width: 230,editable:true, valueGetter: (params) => {
        return fullname(params.row.user_id.name)
      }
    },

    { field: 'role', headerName: 'Role', width: 150,valueGetter: (params) => {
        return params.row.user_id.role
        }
    },
    { field: 'activity', headerName: 'Activity', width: 250 }



  ];
  return (
    <div style={{ height: '80vh', width: '100%' }}>
    <Typography>Activity Logs</Typography>
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
};

export default ActivityLogs;

