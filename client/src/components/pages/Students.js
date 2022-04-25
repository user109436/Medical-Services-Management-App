import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {
  Container,
  Alert,
} from '@mui/material';
// PROVIDER
import GlobalContext from '../../provider/GlobalProvider';
import StudentContext from '../../provider/StudentProvider';
// COMPONENTS
import CardUserStudent from '../cards/CardUserStudent';
import StudentForm from '../form-modals/StudentForm';
import ViewUser from './view/ViewUser';
import {
  addLabelField,
  filterArrayObj
} from "../../utils/Utilities";
const Students = () => {
  const { id } = useParams();

  const { setStudents, setUsers, setStudent, student } = useContext(StudentContext);
  const { message, getData, change } = useContext(GlobalContext);
  const [medicalRecord, setMedicalRecord] = useState({});


  //DEFAULT VIEW
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const student = await getData(`api/students/${id}`);
        const res = await getData(`api/medical-records/user/${student.doc.user_id._id}`);
        setStudent(student ? student : []);
        setMedicalRecord(res ? res : []);
        return true;
      }
      const res = await getData('api/students');
      let accounts = await getData('api/users');
      accounts = filterArrayObj(accounts.doc, 'role','student');

      setStudents(res ? res : []);
      //add a label field for Combo Box
      addLabelField(accounts?.doc, 'email');
      setUsers({ ...accounts });
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [change,id]);

  if (id) {
    return (
      <>
        <ViewUser medicalRecord={medicalRecord} user={student} />
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
        <StudentForm />
        <CardUserStudent />

      </Container>

    </>
  )
}


export default Students