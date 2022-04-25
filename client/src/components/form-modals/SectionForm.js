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
import SectionContext from '../../provider/SectionProvider';
import { makeStyles } from '@mui/styles';
import { hasErrors } from '../../utils/Utilities';
const useStyles = makeStyles({
  mb: {
    marginBottom: 16,
  },
});

export default function SectionForm() {
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
    sections,
    setSections,
    sectionForm,
    setSectionForm,
  } = useContext(SectionContext);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset
    setMessage({ text: '', success: false });
    sectionForm.sectionError = false
    setSectionForm({ ...sectionForm });
    //error validation
    if (hasErrors(sectionForm)) {
      setSectionForm({ ...sectionForm });
      return false;
    }

    let res;
    if (sections.deleteUpdate) {
      res = await updateData(`api/sections/${sections.deleteUpdate._id}`, sectionForm);
    } else {
      res = await addData('api/sections', sectionForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${sectionForm.section} Successfully Saved`, success: true });
    setChange(!change);
    setSectionForm({ ...sectionForm, section: '' });

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (sections.deleteUpdate) {
      const res = await deleteData(`api/sections/${sections.deleteUpdate._id}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${sections.deleteUpdate.section} Successfully Deleted`, success: true });
        setSectionForm({ section: '' });
        setSections({ ...sections, delete: {} });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSectionForm({ ...sectionForm, [name]: value });
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
        <DialogTitle id="form-dialog-title">Section</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Sections that you create or modify here will reflect on Students Records
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
              id="section"
              name="section"
              label="Section"
              type="text"
              fullWidth
              required
              error={sectionForm.sectionError}
              value={sectionForm.section}
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
