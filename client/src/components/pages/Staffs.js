import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {
  Container,
  Alert,
} from '@mui/material';
// PROVIDER
import GlobalContext from '../../provider/GlobalProvider';
import StaffContext from '../../provider/StaffProvider';
// COMPONENTS
import CardUserStaff from '../cards/CardUserStaff';
import StaffForm from '../form-modals/StaffForm';
import ViewUser from './view/ViewUser';
import {
  addLabelField,
  filterArrayObj
} from "../../utils/Utilities";
const Staffs = () => {
  let { id } = useParams();

  const { setStaffs, setUsers, setStaff, staff } = useContext(StaffContext);
  const { message, getData, change } = useContext(GlobalContext);
  const [medicalRecord, setMedicalRecord] = useState({});


  //DEFAULT VIEW
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const staff = await getData(`api/staffs/${id}`);
        const res = await getData(`api/medical-records/user/${staff.doc.user_id._id}`);
        setStaff(staff ? staff : []);
        setMedicalRecord(res ? res : []);
        return true;
      }
      const res = await getData('api/staffs');
      let accounts = await getData('api/users');
      accounts = filterArrayObj(accounts.doc, 'role','faculty', 'non-faculty','encoder', 'admin');
      setStaffs(res ? res : []);
      //add a label field for Combo Box
      addLabelField(accounts?.doc, 'email');
      setUsers({ ...accounts });
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [change,id]);

  if (id) {
    
    return (
      <>
        <ViewUser medicalRecord={medicalRecord} user={staff} />
      </>
    );

  }

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
        <StaffForm />
        <CardUserStaff />

      </Container>

    </>
  )
}


export default Staffs