import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert
} from "@mui/material";
import LockOutlined from '@mui/icons-material/LockOutlined'
import { makeStyles } from '@mui/styles';
import { blue } from '@mui/material/colors';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../provider/AuthProvider";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        E Consultation App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    // paddingTop: "40px",
  },
  logo: {
    height: '10rem'
  },
  landingImage: {
    width: '100%'
  },
  paper: {
    // margin: theme.spacing(0, 0),
    // display: "flex",
    // flexDirection: "column",
    // alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    // marginTop: theme.spacing(1),
  },
  flexContainer: {
    display: "flex",
    justifyContent: "center"
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const [message, setMessage] = useState({ text: '', success: false });

  const classes = useStyles();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
    emailError: false,
    passwordError: false,
  });
  const error = {
    email: false,
    password: false,
    count: 0,
  };
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset errors & message
    error.email = false;
    error.password = false;
    error.count = 0;
    setMessage("");
    setUser({ ...user, emailError: false, passwordError: false });
    //validate
    if (!user.email) {
      error.email = true;
      error.count++;
    }
    if (!user.password) {
      error.password = true;
      error.count++;
    }
    setUser({
      ...user,
      emailError: error.email,
      passwordError: error.password,
    });
    //submit
    if (!error.count) {
      try {
        const resp = await axios.post("api/account/login",
          {
            email: user.email,
            password: user.password,
          }
        );
        const notAllowedUsers = ['student', 'faculty', 'non-faculty'];
        if (resp?.data) {
          //if user is student, faculty or non-faculty -message please use the app version
          const { user } = resp?.data?.data;
          if (notAllowedUsers.includes(user.role)) {
            //clear jwt from headers
            await axios.post(`api/account/logout`);
            setMessage({ text: 'Students, Faculty & Non-Faculty are not allowed Here. Please use the IOS/Android App to Login' });
            return false;
          }
          localStorage.setItem("token", resp.data.token);
          localStorage.setItem("user", JSON.stringify(resp.data.data.user));
          setAuth({ ...resp.data.data.user });
          window.location.reload();//reload page
          navigate("/dashboard");
        }
      } catch (err) {
        setMessage({ text: err.response.data.message, success: false });
      }
    }
  };
  const handleForgotPassword = async () => {
    setMessage({ text: "" });
    setUser({ ...user, emailError: false, passwordError: false });
    try {
      //throw error for empty email field
      if (!user.email) {
        user.emailError = true;
        setMessage({ text: 'Email is Required to Recover Email', success: false });
        setUser({ ...user });
        return false;
      }
      //send api request to recover account
      const res = await axios.post(`api/account/forgot-password`, { email: user.email });
      if (res?.data) {
        const { data } = res;
        if (data.message.includes('Exist')) {
          setMessage({ text: data.message, success: false });
        }
        if (data.message.includes('Sent')) {
          setMessage({ text: data.message, success: true });
        }
      }
    } catch (err) {
      setMessage({ text: 'Unknown Problem Occured, Please Try again Later', success: false });
    }

  }
  const handleResendEmailVerification = async () => {
    setMessage({ text: "" });
    setUser({ ...user, emailError: false, passwordError: false });
    try {
      //throw error for empty email field
      if (!user.email) {
        user.emailError = true;
        setMessage({ text: 'Email is Required to Resend Verification/Activation', success: false });
        setUser({ ...user });
        return false;
      }
      //send api request to recover account
      const res = await axios.post(`api/account/signup/resend-email-verification`, { email: user.email });
      if (res?.data) {
        const { data } = res;
        if (data.message.includes('Verification')) {
          setMessage({ text: data.message, success: true });
        }
      }
    } catch (err) {
      if (err?.response?.data?.message.includes('Exist')) {
        setMessage({ text: err.response.data.message, success: false });
        return true;
      }
      setMessage({ text: 'Unknown Problem Occured, Please Try again Later', success: false });
    }
  }
  return (
    <>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid container justifyContent="space-evenly" className={classes.image}>
          <Grid item xs={12} sm={7} container sx={{ alignSelf: 'center' }}>
            <Grid className={classes.paper} sx={{ padding: 4, flex: 1 }}  >

              <Typography variant="h6" align='center'>
                Welcome to Medical Services Management System App
              </Typography>
              <Box
                // elevation={4} 
                // component={Paper}
                sx={{ display: 'flex', flex: 1, flexWrap: 'wrap' }}>
                <img alt="consultation" src="/assets/img/mock-up.png" className={classes.landingImage} />
              </Box>
              {/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box>
                  <Avatar
                    alt='Engr. Allan Anorico'
                    src={`/assets/img/EngrAnorico.png`}
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: blue[500],
                      fontSize: 40,
                      boxShadow: 3,
                      margin: 'auto'
                    }}
                  />
                  <Typography variant="body1" align='center'>
                    Capstone Project of Engr. Alln P. Anorico
                  </Typography>
                </Box>
              </Box> */}

            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={5}
            // component={Paper}
            container
            // direction="row"
            elevation={6}
          >
            <Grid className={classes.paper} component={Paper} elevation={6} sx={{ padding: 4, alignSelf: 'center' }}>
              <Box className={classes.flexContainer}>
                <Avatar className={classes.avatar} sx={{ bgcolor: blue[500] }}>
                  <LockOutlined />
                </Avatar>
              </Box>
              <Typography align="center" component="h1" variant="h5">
                Log In
              </Typography>

              <form className={classes.form} noValidate>
                {
                  message.text ?
                    <Alert
                      severity={message.success ? 'success' : "error"}
                    >
                      {message.text}
                    </Alert> : ""
                }
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  error={user.emailError}
                  value={user.email}
                  onChange={handleChange}
                  placeholder="beautiful_name@example.com"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={user.passwordError}
                  value={user.password}
                  onChange={handleChange}
                  placeholder="beautiful_name_password"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSubmit}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Link href="#" variant="body2" onClick={() => handleForgotPassword()}>
                      Forgot password?
                    </Link>
                    <Link href="#" variant="body2" onClick={() => handleResendEmailVerification()}>
                      Resend Email Verification?
                    </Link>
                    <Link target="_blank" href="https://drive.google.com/drive/folders/1ie0HsVjOIcQoWEhIW3Unc7eTSXp6y5hZ?usp=sharing" variant="body2">
                      Get the App
                    </Link>
                  </Grid>
                </Grid>
                <Box mt={5}>
                  <Copyright />
                </Box>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
