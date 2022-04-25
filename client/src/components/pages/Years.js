import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import YearTable from "../tables/YearTable";
import YearForm from "../form-modals/YearForm";
import { makeStyles } from '@mui/styles';
import GlobalContext from '../../provider/GlobalProvider';
import YearContext from '../../provider/YearProvider';

const classes = makeStyles({
  mt: {
    marginTop: 16,
  },
});

const Years = () => {
  const { setYears} = useContext(YearContext);
  const { message,  getData, change  } = useContext(GlobalContext);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/years');
      setYears(res);
    }
    fetchData();// eslint-disable-next-line react-hooks/exhaustive-deps
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
        <YearForm className={classes.mt} />
        <YearTable />
      </Container>
    </>
  );
};


export default Years;
