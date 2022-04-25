import React, { useContext } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert
} from "@mui/material";
import GlobalContext from '../../provider/GlobalProvider';
import DepartmentContext from '../../provider/DepartmentProvider';
import { makeStyles } from '@mui/styles';
import { hasErrors } from '../../utils/Utilities';
const useStyles = makeStyles({
  mb: {
    marginBottom: 16,
  },
});

export default function DepartmentForm() {
  const {
    addData,
    deleteData,
    updateData,
    change,
    setChange,
    open,
    setOpen,
    message,
    setMessage
  } = useContext(GlobalContext);
  const {
    departments,
    setDepartments,
    departmentForm,
    setDepartmentForm,
  } = useContext(DepartmentContext);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset
    setMessage({ text: '', success: false });
    departmentForm.departmentError = false;
    setDepartmentForm({ ...departmentForm }); //details field is optional
    if (hasErrors(departmentForm, ['details'])) {
      setDepartmentForm({ ...departmentForm });
      return false;
    }
    //submit to our API endpoint
    let res;
    if (departments.deleteUpdate) {
      res = await updateData(`api/departments/${departments.deleteUpdate._id}`, departmentForm);
    } else {
      res = await addData('api/departments', departmentForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${departmentForm.department} Successfully Saved`, success: true });
    setChange(!change);
    setDepartmentForm({ ...departmentForm, department: '', details: '' });

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (departments.deleteUpdate) {
      const res = await deleteData(`api/departments/${departments.deleteUpdate._id}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${departments.deleteUpdate.department} Successfully Deleted`, success: true });
        setDepartmentForm({ department: '' });
        setDepartments({ ...departments, delete: {} });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm({ ...departmentForm, [name]: value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        className={classes.mb}
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
      >
        ACTIONS
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Department</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Departments that you create or modify here will reflect on Students Records
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
              id="department"
              name="department"
              label="Department"
              type="text"
              fullWidth
              required
              error={departmentForm.departmentError}
              value={departmentForm.department}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="details"
              name="details"
              label="Details"
              multiline
              maxRows={20}
              type="text"
              fullWidth
              value={departmentForm.details}
              variant="outlined"
              onChange={handleChange}
            />

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
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
