import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import CourseTable from "../tables/CourseTable";
import CourseForm from "../form-modals/CourseForm";
import { makeStyles } from '@mui/styles';
import GlobalContext from '../../provider/GlobalProvider';
import CourseContext from '../../provider/CourseProvider';

const classes = makeStyles({
  mt: {
    marginTop: 16,
  },
});

const Courses = () => {
  const { setCourses} = useContext(CourseContext);
  const { message,  getData, change  } = useContext(GlobalContext);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/courses');
      setCourses(res);
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
        <CourseForm className={classes.mt} />
        <CourseTable />
      </Container>
    </>
  );
};


export default Courses;
