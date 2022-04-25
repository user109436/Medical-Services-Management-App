import { createContext, useState, memo } from "react";
const UserContext = createContext({});

export const UserProvider = memo(({ children }) => {
  // YEARS
  const [users, setUsers] = useState({});
  const [userForm, setUserForm] = useState({
    selectedID:"",//for updating & deleting
    email:"",
    password:"",//exempt
    role:"",
    active:"",
    emailError:false,
    roleError:false,
  });

  return (
    <UserContext.Provider value={{
      users,//YEARS
      setUsers,
      userForm,//FORM
      setUserForm
    }}>
      {children}
    </UserContext.Provider>
  );
});

export default UserContext;
