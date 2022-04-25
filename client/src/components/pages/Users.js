import React, { useContext, useEffect } from "react";
import {
  Container,
  Alert
} from "@mui/material";
import UserTable from "../tables/UserTable";
import UserForm from "../form-modals/UserForm";
import GlobalContext from '../../provider/GlobalProvider';
import UserContext from '../../provider/UserProvider';
const Users = () => {
  const { setUsers} = useContext(UserContext);
  const { message,  getData, change  } = useContext(GlobalContext);


  useEffect(() => {
    const fetchData = async () => {
      const res = await getData('api/users');
      setUsers(res);
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
        <UserForm />
        <UserTable />
      </Container>
    </>
  );
};


export default Users;
