import "./App.css";
import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue } from "@mui/material/colors";
import { ProtectedRoute } from './utils/Auth';
import { useJwt } from "react-jwt";
import axios from 'axios';
import Sidebar from "./components/Sidebar";
//1. PAGES

//DASHBOARD
import Admin from "./components/pages/Admin";

//USERS
import Login from "./components/pages/Login";
import VerifyAccount from "./components/pages/VerifyAccount";
import VerifyStaff from './components/pages/VerifyStaff';
import Chats from "./components/pages/Chats";
import Users from "./components/pages/Users";
import Students from "./components/pages/Students";
import Staffs from "./components/pages/Staffs";
import Physicians from "./components/pages/Physicians";
import ViewMedicalRecord from "./components/pages/view/ViewMedicalRecord"; //public view of medical record- anyone can see as per requested by client


//INDEPENDENT MODELS
// import Years from './components/pages/Years';
// import Sections from './components/pages/Sections';
import Courses from './components/pages/Courses';
import Departments from './components/pages/Departments';


//MEDICINES
// import MedicalRecords from "./components/pages/MedicalRecords";
import Prescriptions from "./components/pages/Prescriptions";

//CHATS

import NotFound from "./components/pages/404";


//2. PROVIDERS
import { GlobalProvider } from './provider/GlobalProvider';
import AuthContext from './provider/AuthProvider';
import { ChatProvider } from './provider/ChatProvider';
//USERS
import { StudentProvider } from './provider/StudentProvider';
import { StaffProvider } from './provider/StaffProvider';
import { PhysicianProvider } from './provider/PhysicianProvider';



//INDEPENDENT MODELS
// import { YearProvider } from './provider/YearProvider';
// import { SectionProvider } from './provider/SectionProvider';
import { CourseProvider } from './provider/CourseProvider';
import { DepartmentProvider } from './provider/DepartmentProvider';
import { UserProvider } from './provider/UserProvider';


//MEDICINES
// import {MedicineProvider} from './provider/MedicineProvider';


//CHATS



const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
  },
  typography: {
    fontFamily: "Quicksand",
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

function App() {
  const { auth, setAuth, setLoggedInUser } = useContext(AuthContext);
  let { decodedToken } = useJwt(localStorage.getItem('token'));
  const technicals = ['encoder', 'admin'];
  const physicians = ['nurse', 'dentist', 'doctor'];

  useEffect(() => {
    const fetchData = async () => {
      let token = localStorage.getItem('token');
      if (!token) return false;
      try {
        const res = await axios.post(`api/users/identify-user-type`, { token });
        const { doc } = res?.data;
        if (doc) {
          setLoggedInUser(doc);
        }
      } catch (err) {
        //token is malformed removed -> logout and clear localStorage
        try {
          console.log('Token Malformed Logging Out User...');
          await axios.post(`api/account/logout`);
          localStorage.clear();
          setAuth(null);
          window.location.reload();//reload page
        } catch (err) {
          console.log(err);
        }
      }
    }
    console.log(`exp:`, decodedToken?.exp);
    if (decodedToken?.role) {
      setAuth({ ...decodedToken });
    }
    fetchData();
  }, [decodedToken]);
  if (!auth) {
    console.log('no auth');
    return ( //QUICKFIX: Conditional Rendering -auth is always undefined on load
      <ThemeProvider theme={theme}>
        <GlobalProvider>
          <Router>
            <Routes>
              <Route path="/view-medical-record/:id" element={
              <ChatProvider>
              <ViewMedicalRecord />
                </ChatProvider>
              
              } />
              <Route path="/sign-up/account/verify/:id" element={<VerifyAccount />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </Router>
        </GlobalProvider>
      </ThemeProvider>

    );
  }
  console.log('auth');
  return (
    <ThemeProvider theme={theme}>
      <GlobalProvider>
        <Router>
            <Sidebar>
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role) || physicians.includes(auth?.role)}
                page={'Dashboard'}
              >
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/view-medical-record/:id" element={
              <ChatProvider>
              <ViewMedicalRecord />
                </ChatProvider>
              
              } />
            <Route path="/sign-up/account/verify/:id" element={<VerifyAccount />} />
            <Route path="/prescriptions" element={<Prescriptions />} />

            <Route path="/verify-faculty-members-and-staff" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                 <VerifyStaff/>
              </ProtectedRoute>

            } />

            {/* INDEPENDENT MODELS */}

            {/* <Route path="/years" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <YearProvider>
                  <Years />
                </YearProvider>
              </ProtectedRoute>

            } />
            <Route path="/sections" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <SectionProvider>
                  <Sections />
                </SectionProvider>
              </ProtectedRoute>
            } /> */}
            <Route path="/courses" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <CourseProvider>
                  <Courses />
                </CourseProvider>
              </ProtectedRoute>
            } />
            <Route path="/departments" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <DepartmentProvider>
                  <Departments />
                </DepartmentProvider>
              </ProtectedRoute>
            } />

            {/* USERS */}

            <Route path="/users" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <UserProvider>
                  <Users />
                </UserProvider>
              </ProtectedRoute>

            } />
            <Route path="/users/students/" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role) || physicians.includes(auth?.role)}
              >
                <StudentProvider>
                  <Students />
                </StudentProvider>
              </ProtectedRoute>
            } />
            <Route path="/users/students/:id" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role) || physicians.includes(auth?.role)}
              >
                <StudentProvider>
                  <Students />
                </StudentProvider>
              </ProtectedRoute>
            } />
            <Route path="/users/staffs" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role) || physicians.includes(auth?.role)}
              >
                <StaffProvider>
                  <Staffs />
                </StaffProvider>
              </ProtectedRoute>
            } />
            <Route path="/users/staffs/:id" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role) || physicians.includes(auth?.role)}
              >
                <StaffProvider>
                  <Staffs />
                </StaffProvider>
              </ProtectedRoute>
            } />
            <Route path="/users/physicians" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <PhysicianProvider>
                  <Physicians />
                </PhysicianProvider>
              </ProtectedRoute>

            } />
            <Route path="/users/physicians/:id" element={
              <ProtectedRoute
                isAllowed={technicals.includes(auth?.role)}
              >
                <PhysicianProvider>
                  <Physicians />
                </PhysicianProvider>
              </ProtectedRoute>
            } />


            {/* CHATS */}

            <Route path="/chats" element={
              <ProtectedRoute
                isAllowed={physicians.includes(auth?.role)}
              >
                <ChatProvider>
                  <Chats />
                </ChatProvider>
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <ProtectedRoute
                redirectPath="/dashboard"
                isAllowed={!auth?.role}
              // FIXME:the app redirects to LOGIN if the page is reload ex. Current page: Admin, On Reload: Current=login
              >
                <Login />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />


          </Routes>
            </Sidebar>

        </Router>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;
