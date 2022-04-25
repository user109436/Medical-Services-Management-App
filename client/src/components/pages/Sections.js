import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import SectionTable from "../tables/SectionTable";
import SectionForm from "../form-modals/SectionForm";
import { makeStyles } from '@mui/styles';
import GlobalContext from '../../provider/GlobalProvider';
import SectionContext from '../../provider/SectionProvider';

const classes = makeStyles({
  mt: {
    marginTop: 16,
  },
});

const Sections = () => {
  const { setSections} = useContext(SectionContext);
  const { message,  getData, change  } = useContext(GlobalContext);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/sections');
      setSections(res);
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
        <SectionForm className={classes.mt} />
        <SectionTable />
      </Container>
    </>
  );
};


export default Sections;
