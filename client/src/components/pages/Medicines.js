import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import MedicineTable from "../tables/MedicineTable";
import MedicineForm from "../form-modals/MedicineForm";
import { makeStyles } from '@mui/styles';
import GlobalContext from '../../provider/GlobalProvider';
import MedicineContext from '../../provider/MedicineProvider';


const classes = makeStyles({
  mt: {
    marginTop: 16,
  },
});

const Medicines = () => {
  const { getData, change, message } = useContext(GlobalContext);
  const { setMedicines } = useContext(MedicineContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/medicines');
      setMedicines(res?res:{});
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
        <MedicineForm className={classes.mt} />
        <MedicineTable />
      </Container>
    </>
  );
};

export default Medicines;
