import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import DepartmentTable from "../tables/DepartmentTable";
import DepartmentForm from "../form-modals/DepartmentForm";
import { makeStyles } from '@mui/styles';
import GlobalContext from '../../provider/GlobalProvider';
import DepartmentContext from '../../provider/DepartmentProvider';

const classes = makeStyles({
  mt: {
    marginTop: 16,
  },
});

const Departments = () => {
  const { setDepartments} = useContext(DepartmentContext);
  const { message,  getData, change  } = useContext(GlobalContext);


  useEffect(() => {
    const fetchData = async () => { 
      const res = await getData('api/departments');
      setDepartments(res);
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [change]);

  return (
    <>
      <Container>
        {
          message.text ?
            <Alert
              severity={message.success ? 'success' : "error"}
            >
              {message.text}
            </Alert> : ""
        }
        <DepartmentForm className={classes.mt} />
        <DepartmentTable />
      </Container>
    </>
  );
};


export default Departments;
