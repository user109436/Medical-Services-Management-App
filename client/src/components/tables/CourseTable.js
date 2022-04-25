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
import CourseContext from '../../provider/CourseProvider';



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
const CourseTable = () => {
  const {
    courses,
    setCourses,
    setCourseForm
  } = React.useContext(CourseContext);
  const {
    setOpen
  } = React.useContext(GlobalContext);
  const rows =courses?.doc||[];
  const columns = [
    { field: 'course', headerName: 'Course', width: 250 },
    { field: 'course_code', headerName: 'Course Code', width: 250 },

  ];
  const handleClick = (e) => {
    //show data on screen
    setCourseForm({course:e.row.course, course_code:e.row.course_code});
    setCourses({ ...courses,deleteUpdate:e.row });
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

export default CourseTable;

