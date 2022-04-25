import React from "react";
import clsx from "clsx";
import {
  Drawer,
  Button,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Box
} from "@mui/material";
import { blue } from '@mui/material/colors';
import { useNavigate } from "react-router-dom";
import { makeStyles } from '@mui/styles';
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import FolderSharedIcon from "@mui/icons-material/FolderShared";
// import CreateIcon from "@mui/icons-material/Create";
// import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WidgetsIcon from '@mui/icons-material/Widgets';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useJwt } from "react-jwt";
import AuthContext from '../provider/AuthProvider';
import axios from 'axios';
import { fullname } from '../utils/Utilities';

const useStyles = makeStyles({
  list: {
    // width: 250,
  },
  fullList: {
    // width: "auto",
  },
  page: {
    background: '#f9f9f9',
    width: '100%',
  },
  root: {
    display: 'flex',
  },
  drawer: {
    width: 150,
  },
  drawerPaper: {
    width: 240,
  },
});

export default function Sidebar({children}) {
  const { auth, setAuth, loggedInUser } = React.useContext(AuthContext);
  const classes = useStyles();
  const navigate = useNavigate();
  let { decodedToken } = useJwt(localStorage.getItem('token'));
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    // {
    //   text: "Medical Records",
    //   icon: <FolderSharedIcon />,
    //   path: "/medical-records",
    // },
    // {
    //   text: "Prescriptions",
    //   icon: <CreateIcon />,
    //   path: "/prescriptions",
    // },
    // {
    //   text: "Medicines",
    //   icon: <LocalHospitalIcon />,
    //   path: "/medicines",
    // },
    // {
    //   text: "Years",
    //   icon: <DateRangeIcon />,
    //   path: "/years",
    // },
    // {
    //   text: "Sections",
    //   icon: <WidgetsIcon />,
    //   path: "/sections",
    // },
    {
      text: "Courses",
      icon: <EngineeringIcon />,
      path: "/courses",
    },
    {
      text: "Departments",
      icon: <AccountBalanceIcon />,
      path: "/departments",
    },
    {
      text: "Verify Faculty Members/Staffs",
      icon: <VerifiedUserIcon />,
      path: "/verify-faculty-members-and-staff  ",
    },
    {
      text: "Users",
      icon: <PeopleIcon />,
      path: "/users",
    },
    {
      text: "Students",
      icon: <PeopleIcon />,
      path: "/users/students",
    },
    {
      text: "Faculty Members/Staffs",
      icon: <PeopleIcon />,
      path: "/users/staffs",
    },
    {
      text: "Physicians",
      icon: <PeopleIcon />,
      path: "/users/physicians",
    },
    {
      text: "Chats",
      icon: <ChatIcon />,
      path: "/chats",
    },
  ];
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const physicians = ['nurse', 'dentist', 'doctor'];
  const physiciansPage = ['Chats', 'Students', 'Faculty Members/Staffs', 'Dashboard'];
  const technicals = ['admin', 'encoder'];
  const technicalsNotAllowedPage = ['Chats'];
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className={classes.branding}>
        <Typography variant="h5" sx={{ marginTop: 2, marginBottom: 2 }} align="center">E Consultation App</Typography>
      </div>
      <Box sx={{ marginTop: 2, marginBottom: 2 }} >
        <Avatar

          alt={fullname(loggedInUser?.name).toUpperCase()}
          src={`/api/images/${loggedInUser?.photo}`}
          sx={{
            width: 100,
            height: 100,
            bgcolor: blue[500],
            fontSize: 40,
            boxShadow: 3,
            margin: 'auto'
          }}
        />
        <Typography variant="body1" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
          {fullname(loggedInUser?.name).toUpperCase()}
        </Typography>
        <Typography variant="body2" gutterBottom component="div" align="center" sx={{ textTransform: 'capitalize' }}>
          {loggedInUser?.department_id?.department || loggedInUser?.user_id?.role}
        </Typography>
      </Box>
      <Divider />
      <List dense>
        {menuItems.map((item) => {
          if (physicians.includes(auth?.role) && !physiciansPage.includes(item.text)) return false
          if (technicals.includes(auth?.role) && technicalsNotAllowedPage.includes(item.text)) return false
          return (
            <ListItem button key={item.text} onClick={() => navigate(item.path)}
              secondaryAction={
                item.text==='Medical Records' || item.text==='Prescriptions'?(
                <IconButton edge="end" aria-label="comments">
                  <RemoveRedEyeIcon />
                </IconButton>
                ):("")
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          )
        })}
        <ListItem button key={'Log Out'} onClick={() => LogOut()} >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary={"Log Out"} />
        </ListItem>
      </List>
    </div>
  );
  const LogOut = async () => {
    //log out on api
    try {
      await axios.post(`api/account/logout`);
      localStorage.clear();
      window.location.reload();//reload page
    } catch (err) {
      console.log(`Log Out Err:`, err)
    }
  }
  React.useEffect(() => {
    if (decodedToken?.role) {
      setAuth({ ...decodedToken });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedToken, setAuth]);
  if (!loggedInUser) {
    return 'Sidebar Loading....'
  }
  const chatPage=window.location.href.indexOf('chats')!==-1;
  return (
    <div className={classes.root}>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon />
          </Button>
          <Drawer
          className={classes.drawer}
           classes={{ paper: classes.drawerPaper }}
            variant={chatPage?"temporary":"permanent"}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
           <div className={classes.page}>
        { children }
      </div>
        </React.Fragment>
      ))}
    </div>
  );
}
