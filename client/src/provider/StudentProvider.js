import { createContext, useState, memo } from "react";
const StudentContext = createContext({});

export const StudentProvider = memo(({ children }) => {
    // STUDENTS
    const [students, setStudents] = useState({});
    const [users, setUsers]=useState({});//refers to Account of Each User
    const [studentForm, setStudentForm] = useState({
        selectedID:"",
        student_no: "",
        user_id:"",
        // year_id: "",
        // section_id: "",
        course_id: "",
        email:"", //user_id
        // year: "",
        // section: "",
        course: "",
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
        student_noError: false,
        //we don't use year_id_Error,course..,section.. because ID will not be shown in the Input Year
        // yearError: false,
        // sectionError: false,
        courseError: false,
        sexError: false,
        birthdayError: false,
        ageError: false,
        civil_statusError: false,
        religionError: false,
        emailError:false
    });
    const [student, setStudent]=useState({});

    return (
        <StudentContext.Provider value={{
            students,//STUDENTS
            setStudents,
            studentForm,//FORM
            setStudentForm,
            users,
            setUsers,
            student,
            setStudent
        }}>
            {children}
        </StudentContext.Provider>
    );
});

export default StudentContext;
