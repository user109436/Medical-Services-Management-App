import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
// import MedicalRecordTable from "../tables/MedicalRecordTable";
// import MedicalRecordForm from "../form-modals/MedicalRecordForm";
import GlobalContext from '../../provider/GlobalProvider';
import MedicalRecordContext from '../../provider/MedicalRecordProvider';


const MedicalRecords = () => {
  const { getData, change, message } = useContext(GlobalContext);
  const { setMedicalRecords } = useContext(MedicalRecordContext);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/medical-records');
      setMedicalRecords(res?res:{});
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
        {/* <MedicalRecordForm className={classes.mt} />
        <MedicalRecordTable /> */}
      </Container>
    </>
  );
};

export default MedicalRecords;
