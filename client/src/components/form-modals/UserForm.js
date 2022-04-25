import React, { useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  RadioGroup,
  Radio,
  FormLabel,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import GlobalContext from '../../provider/GlobalProvider';
import UserContext from '../../provider/UserProvider';
import { hasErrors, resetErrors, resetFields } from '../../utils/Utilities';


export default function UserForm() {
  const {
    addData,
    deleteData,
    updateData,
    change,
    setChange,
    open,
    setOpen,
    message,
    setMessage,
    sendVerification
  } = useContext(GlobalContext);
  const {
    userForm,
    setUserForm,
  } = useContext(UserContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset
    setMessage({ text: '', success: false });
    resetErrors(userForm, ['password', 'selectedID','active']);
    setUserForm({ ...userForm });
    //error validation
    if (hasErrors(userForm, ['active','password', 'selectedID'])) {
      setUserForm({ ...userForm });
      return false;
    }
    if (!userForm.password) {
      delete userForm.password;
    }
    let res;
    if (userForm.selectedID) {
      res = await updateData(`api/users/${userForm.selectedID}`, userForm);
    } else {
      res = await addData('api/users', userForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${userForm.email} Successfully Saved`, success: true });
    setUserForm({ ...userForm, email:"", role:"", password:"", active:"" });
    setChange(!change);

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (userForm.selectedID) {
      const res = await deleteData(`api/users/${userForm.selectedID}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${userForm.email} Successfully Deleted`, success: true });
        resetFields(userForm);
        setUserForm({ ...userForm });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserForm({ ...userForm, [name]: value });
    console.log(userForm);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    userForm.selectedID='';
    setUserForm({...userForm});
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        sx={{ marginBottom: 2 }}
      >
        ACTIONS
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Users that you create or modify here will reflect on Students, Staffs & Physicians
          </DialogContentText>
          <form noValidate>
            {
              message.text ?
                <Alert
                  severity={message.success ? 'success' : "error"}
                >
                  {message.text}
                </Alert> : ""
            }


            <TextField
              autoFocus
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              required
              error={userForm.emailError}
              value={userForm.email}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              required
              value={userForm.password}
              variant="outlined"
              onChange={handleChange}
            />
            <FormControl fullWidth>
              <FormLabel id="active-label">Active</FormLabel>
              <RadioGroup
                row
                aria-labelledby="active-label"
                name="active"
                value={userForm.active}
              >
                <FormControlLabel value='true' control={<Radio />} label="Yes"
                  onClick={handleChange} />
                <FormControlLabel value='false' control={<Radio />} label="No"
                  onClick={handleChange}
                />

              </RadioGroup>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="role-label">Account Type</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={userForm.role}
                label="Account Type"
                onChange={handleChange}
                error={userForm.roleError}
              >
                <MenuItem value='student'>Student</MenuItem>
                <MenuItem value='faculty'>Faculty</MenuItem>
                <MenuItem value='non-faculty'>Non-Faculty</MenuItem>
                <MenuItem value='nurse'>Nurse</MenuItem>
                <MenuItem value='dentist'>Dentist</MenuItem>
                <MenuItem value='doctor'>Doctor</MenuItem>
                <MenuItem value='encoder'>Encoder</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>

              </Select>
            </FormControl>

            <DialogActions>
              <Button onClick={handleClose} color="warning">
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
                Save
              </Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
              {userForm.selectedID !==''? (
              <Button color="success" onClick={()=>sendVerification(userForm.email)}>
                Send Account Verification
              </Button>
              ):('')}
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
