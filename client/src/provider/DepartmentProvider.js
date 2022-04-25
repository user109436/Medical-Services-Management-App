import { createContext, useState, memo } from "react";
const DepartmentContext = createContext({});

export const DepartmentProvider = memo(({ children }) => {
  // DEPARTMENTS
  const [departments, setDepartments] = useState({});
  const [departmentForm, setDepartmentForm] = useState({
    department: "",
    details:'',
    departmentError: false,
  });

  return (
    <DepartmentContext.Provider value={{
      departments,//DEPARTMENTS
      setDepartments,
      departmentForm,//FORM
      setDepartmentForm
    }}>
      {children}
    </DepartmentContext.Provider>
  );
});

export default DepartmentContext;
