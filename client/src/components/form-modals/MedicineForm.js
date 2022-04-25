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
import MedicineContext from '../../provider/MedicineProvider';
import { hasErrors } from '../../utils/Utilities';

import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  mb: {
    marginBottom: 16,
  },
});

export default function MedicineForm() {

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
    medicines,
    setMedicines,
    medicineForm,
    setMedicineForm,
  } = useContext(MedicineContext);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    medicineForm.nameError = false;
    medicineForm.brandError = false;
    setMedicineForm({ ...medicineForm });
    if (hasErrors(medicineForm)) {
      setMedicineForm({ ...medicineForm });
      return false;
    }
    //submit to our API endpoint
    let res;
    if (medicines.deleteUpdate) {
      res = await updateData(`api/medicines/${medicines.deleteUpdate._id}`, medicineForm);
    } else {
      res = await addData('api/medicines/', medicineForm);
    }
    if (res) {
      setMessage({ text: `${medicineForm.name} Successfully Saved`, success: true });
    } else {
      return setMessage({ text: `${medicineForm.name} failed to Save, Please try again Later`, success: false });
    }
    setChange(!change);
    setMedicineForm({ ...medicineForm, name: '', brand: '' });

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (medicines.deleteUpdate) {
      const res = await deleteData(`api/medicines/${medicines.deleteUpdate._id}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${medicines.deleteUpdate.name} Successfully Deleted`, success: true });
        setMedicineForm({ name: '', brand: '' });
        setMedicines({ ...medicines, delete: {} });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicineForm({ ...medicineForm, [name]: value });
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
        <DialogTitle id="form-dialog-title">Medicine</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Medicines that you create or modify here will reflect on Medical
            Records & Prescriptions
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
              name="name"
              label="Name"
              type="text"
              fullWidth
              required
              error={medicineForm.nameError}
              value={medicineForm.name}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="brand"
              name="brand"
              label="Brand"
              type="text"
              fullWidth
              required
              error={medicineForm.brandError}
              value={medicineForm.brand}
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
