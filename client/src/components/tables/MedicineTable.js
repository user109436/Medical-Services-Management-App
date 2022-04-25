import * as React from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import MedicineContext from '../../provider/MedicineProvider';
import GlobalContext from '../../provider/GlobalProvider';



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
const MedicineTable = () => {
  const {
    medicines,
    setMedicines,
    setMedicineForm
  } = React.useContext(MedicineContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows = medicines ? medicines.doc : [{_id:'1', name:'Medicine Name Goes Here', brand:'Brand Name of Medicine Goes Here'}];
  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'brand', headerName: 'Brand', width: 250 },
  ];
  const handleClick = (e) => {
    //show data on screen
    setMedicineForm({name:e.row.name, brand:e.row.brand?e.row.brand:''});
    setMedicines({ ...medicines,deleteUpdate:e.row });
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
        // checkboxSelection
        onRowClick={handleClick}
      />
    </div>
  );
};

export default MedicineTable;

