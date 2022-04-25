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
import YearContext from '../../provider/YearProvider';
import { makeStyles } from '@mui/styles';
import { hasErrors } from '../../utils/Utilities';
const useStyles = makeStyles({
  mb: {
    marginBottom: 16,
  },
});

export default function YearForm() {
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
    years,
    setYears,
    yearForm,
    setYearForm,
  } = useContext(YearContext);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset
    setMessage({ text: '', success: false });
    yearForm.yearError = false;
    setYearForm({ ...yearForm });
    //error validation
    if (hasErrors(yearForm)) {
      setYearForm({ ...yearForm });
      return false;
    }
    //submit to our API endpoint
    let res;
    if (years.deleteUpdate) {
      res = await updateData(`api/years/${years.deleteUpdate._id}`, yearForm);
    } else {
      res = await addData('api/years', yearForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${yearForm.year} Successfully Saved`, success: true });
    setChange(!change);
    setYearForm({ ...yearForm, year: '' });

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (years.deleteUpdate) {
      const res = await deleteData(`api/years/${years.deleteUpdate._id}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${years.deleteUpdate.year} Successfully Deleted`, success: true });
        setYearForm({ year: '' });
        setYears({ ...years, delete: {} });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setYearForm({ ...yearForm, [name]: value });
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
        <DialogTitle id="form-dialog-title">Year</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Years that you create or modify here will reflect on Students Records
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
              id="name"
              name="year"
              label="Year"
              type="text"
              fullWidth
              required
              error={yearForm.yearError}
              value={yearForm.year}
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
