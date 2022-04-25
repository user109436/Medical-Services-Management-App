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
import YearContext from '../../provider/YearProvider';



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
const YearTable = () => {
  const {
    years,
    setYears,
    setYearForm
  } = React.useContext(YearContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows =years?.doc||[];
  const columns = [
    { field: 'year', headerName: 'Year', width: 250 },
  ];
  const handleClick = (e) => {
    //show data on screen
    setYearForm({year:e.row.year});
    setYears({ ...years,deleteUpdate:e.row });
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

export default YearTable;

