import { createContext, useState, memo } from "react";
const StaffContext = createContext({});

export const StaffProvider = memo(({ children }) => {
    // STUDENTS
    const [staffs, setStaffs] = useState({});
    const [users, setUsers]=useState({});//refers to Account of Each User
    const [staffForm, setStaffForm] = useState({
        selectedID:"",
        employee_no: "",
        user_id:"",
        department_id: "",
        email:"", //user_id
        department: "",
        name: {
            firstname: "",
            middlename: "",
            lastname: "",
            suffix: "",
            firstnameError: false,
            lastnameError: false,
        },
        sex: "",
        birthday: "",
        age: "",
        civil_status: "",
        religion: "",
        address: [],
        contact: [],
        //ERROR VALIDATION
        employee_noError: false,
        //we don't use year_id_Error,course..,section.. because ID will not be shown in the Input Year
        departmentError: false,
        sexError: false,
        birthdayError: false,
        ageError: false,
        civil_statusError: false,
        religionError: false,
        emailError:false
    });
    const [staff, setStaff]=useState({});

    return (
        <StaffContext.Provider value={{
            staffs,//STUDENTS
            setStaffs,
            staffForm,//FORM
            setStaffForm,
            users,
            setUsers,
            staff,
            setStaff
        }}>
            {children}
        </StaffContext.Provider>
    );
});

export default StaffContext;
