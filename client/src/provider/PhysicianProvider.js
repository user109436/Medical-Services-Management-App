import { createContext, useState, memo } from "react";
const PhysicianContext = createContext({});

export const PhysicianProvider = memo(({ children }) => {
    // STUDENTS
    const [physicians, setPhysicians] = useState({});
    const [users, setUsers]=useState({});//refers to Account of Each User
    const [physicianForm, setPhysicianForm] = useState({
        selectedID:"",
        user_id:"",
        email:"",
        name: {
            firstname: "",
            middlename: "",
            lastname: "",
            suffix: "",
            firstnameError: false,
            lastnameError: false,
        },
        prc_license:"",
        ptr_no:"",
        details:"",
        photo:"",
        hide_license_field:false,
        emailError:false,
        prc_licenseError:false,
        ptr_noError:false,
        detailsError:false
    });
    const [physician, setPhysician]=useState({});

    return (
        <PhysicianContext.Provider value={{
            physicians,//STUDENTS
            setPhysicians,
            physicianForm,//FORM
            setPhysicianForm,
            users,
            setUsers,
            physician,
            setPhysician
        }}>
            {children}
        </PhysicianContext.Provider>
    );
});

export default PhysicianContext;
