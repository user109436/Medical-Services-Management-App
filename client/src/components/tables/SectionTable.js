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
import SectionContext from '../../provider/SectionProvider';



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
const SectionTable = () => {
  const {
    sections,
    setSections,
    setSectionForm
  } = React.useContext(SectionContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows =sections?.doc||[];
  const columns = [
    { field: 'section', headerName: 'Section', width: 250 },
  ];
  const handleClick = (e) => {
    //show data on screen
    setSectionForm({section:e.row.section});
    setSections({ ...sections,deleteUpdate:e.row });
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

export default SectionTable;

