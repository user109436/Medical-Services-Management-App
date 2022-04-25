import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import {
  Container,
  Alert,
} from '@mui/material';
// PROVIDER
import GlobalContext from '../../provider/GlobalProvider';
import PhysicianContext from '../../provider/PhysicianProvider';
// COMPONENTS
import CardUserPhysician from '../cards/CardUserPhysician';
import PhysicianForm from '../form-modals/PhysicianForm';
import ViewPhysician from './view/ViewPhysician';
import PhysicianTable from '../tables/logs/PhysicianLogs';
import {
  addLabelField,
  filterArrayObj
} from "../../utils/Utilities";
const Physicians = () => {
  let { id } = useParams();

  const { setPhysicians, setUsers, setPhysician, physician } = useContext(PhysicianContext);
  const { message, getData, change } = useContext(GlobalContext);


  //DEFAULT VIEW
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const physician = await getData(`api/physicians/${id}`);
        setPhysician(physician ? physician : []);
        return true;
      }
      const res = await getData('api/physicians');
      let accounts = await getData('api/users');
      accounts = filterArrayObj(accounts.doc, 'role','nurse', 'dentist', 'doctor');
      setPhysicians(res ? res : []);
      //add a label field for Combo Box
      addLabelField(accounts?.doc, 'email');
      setUsers({ ...accounts });
    }
    fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [change,id]);

  if (id) {
    
    return (
      <>
        <ViewPhysician user={physician} />
        <Container>
        <PhysicianTable id={id} />
        </Container>
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
        <PhysicianForm />
        <CardUserPhysician />

      </Container>

    </>
  )
}


export default Physicians