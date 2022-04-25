import React, { useContext } from "react";
import {
  Typography,
  CardActionArea,
  CardContent,
  CardMedia,
  Card,
  Grid,
  Container
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
// import WidgetsIcon from "@mui/icons-material/Widgets";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EngineeringIcon from "@mui/icons-material/Engineering";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
// import IconButton from "@mui/material/IconButton";
// import LogoutIcon from "@mui/icons-material/Logout";
import AuthContext from "../../provider/AuthProvider";
import ActivityLogs from "../tables/logs/ActivityLogs";

const Admin = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  console.log(auth);
  const physicians = ['nurse', 'dentist', 'doctor'];
  const physiciansPage = ['Chats', 'Students', 'Faculty Members/Staffs', 'Dashboard'];
  const technicals = ['admin', 'encoder'];
  const technicalsNotAllowedPage = ['Chats'];
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      img:"dashboard.png",
      description:""
    },
    // {
    //   text: "Years",
    //   icon: <DateRangeIcon />,
    //   path: "/years",
    //   description:""
    // },
    // {
    //   text: "Sections",
    //   icon: <WidgetsIcon />,
    //   path: "/sections",
    //   description:""
    // },
    {
      text: "Courses",
      icon: <EngineeringIcon />,
      path: "/courses",
      img:"courses.png",
      description:""
    },
    {
      text: "Departments",
      icon: <AccountBalanceIcon />,
      path: "/departments",
      img:"departments.png",
      description:""
    },
    {
      text: "Verify Faculty Members/Staffs",
      icon: <VerifiedUserIcon />,
      path: "/verify-faculty-members-and-staff  ",
      img:"verify-faculty-members-and-staffs.png",
      description:""
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/users",
      img:"users.png",
      description:""
    },
    {
      text: "Students",
      icon: <PeopleIcon />,
      path: "/users/students",
      img:"students.png",
      description:""
    },
    {
      text: "Faculty Members/Staffs",
      icon: <PeopleIcon />,
      path: "/users/staffs",
      img:"staffs.png",
      description:""
    },
    {
      text: "Physicians",
      icon: <PeopleIcon />,
      path: "/users/physicians",
      img:"physicians.png",
      description:""
    },
    {
      text: "Chats",
      icon: <ChatIcon />,
      path: "/chats",
      img:"doctor.png",
      description:""
    },
  ];
  return (
    <>
      <Container>
      <Grid container spacing={2}>
      {menuItems.map((item, i)=>{
        if (physicians.includes(auth?.role) && !physiciansPage.includes(item.text)) return false
        if (technicals.includes(auth?.role) && technicalsNotAllowedPage.includes(item.text)) return false
        return(
      <Grid item xs={6} md={4} lg={3} key={i}>

<Card elevation={4} onClick={() => navigate(item.path)}>
        <CardActionArea>
          <CardMedia
          sx={{objectFit:"contain !important", marginTop:2}}
            component="img"
            height="70"
            image={`/assets/icon-vectors/${item?.img}`}
            alt={item.text}  
          />
          <CardContent>
            <Typography gutterBottom variant="body1" align="center" component="div">
              {item.text}
            </Typography>
            <Typography variant="body2" color="text.secondary">
             {item.description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      </Grid>
      )})}
      <Grid item xs={12}>
        {technicals.includes(auth?.role)&&(
          <ActivityLogs/>
        )}
      </Grid>
      </Grid>

      </Container>
      
    </>
  );
};

export default Admin;
