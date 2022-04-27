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
  Grid,
  Autocomplete,
  Avatar
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import GlobalContext from '../../provider/GlobalProvider';
import PhysicianContext from '../../provider/PhysicianProvider';
import AuthContext from "../../provider/AuthProvider";
import {
  hasErrors,
  resetErrors,
  resetFields,
  fullname,
  encodeImageFileAsURL
} from "../../utils/Utilities";
const Input = styled('input')({
  display: 'none',
});
export default function PhysicianForm() {
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
    physicianForm,
    setPhysicianForm,
    users
  } = useContext(PhysicianContext);
  const { loggedInUser } = useContext(AuthContext)
  const physicians = ['nurse', 'dentist', 'doctor'];
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //reset
    setMessage({ text: '', success: false });
    resetErrors(physicianForm);
    resetErrors(physicianForm.name)
    //apply changes
    setPhysicianForm({ ...physicianForm });
    //error validation & ignoring nested keys (name)
    let errors = 0;
    errors += hasErrors(physicianForm.name, ['middlename', 'suffix']);
    errors += hasErrors(physicianForm, ['name', 'selectedID', 'photo', 'hide_license_field','base64Image']);
    if (!physicianForm.user_id) {
      errors++;
      setMessage({ text: `Please Select Existing Email Address`, success: false });
    }
    if (errors) {
      setPhysicianForm({ ...physicianForm });
      return false;
    }
    let res, photo;
    if (physicianForm.photo) {
      const formData = new FormData();
      formData.append('photo', physicianForm.photo,);
      physicianForm.photo = '';
      photo = formData;
      delete physicianForm.photo //delete photo field we do not want empty image filename
    }else{
      delete physicianForm.photo //delete photo field if no image is selected
    }
    if (physicianForm.selectedID) {
      res = await updateData(`api/physicians/${physicianForm.selectedID}`, physicianForm);
    } else {
      res = await addData('api/physicians', physicianForm);
      await addData(`api/chats/chat-rooms/add-physician/${physicianForm.user_id}`);//add new physician to all chatrooms
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    if (photo) {
      let id = physicianForm.selectedID || res.doc._id
      let uploadPhoto = await updateData(`api/physicians/${id}/update-photo`, photo);
      if (!uploadPhoto) {
        setMessage({ text: 'Unable to Upload Image, Please Try Again Later', success: false })
      }
    }
    setMessage({ text: `${fullname(physicianForm.name)} Successfully Saved`, success: true });
    setChange(!change);
    resetFields(physicianForm, ['name']);
    resetFields(physicianForm.name);
    setPhysicianForm({ ...physicianForm });

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (physicianForm.selectedID) {
      const res = await deleteData(`api/physicians/${physicianForm.selectedID}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${fullname(physicianForm.name)} Successfully Deleted`, success: true });
        setChange(!change);
        resetFields(physicianForm, ['name']);
        resetFields(physicianForm.name);
        setPhysicianForm({ ...physicianForm });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhysicianForm({ ...physicianForm, [name]: value });
  };
  const handleEmailChange = (e, child) => {
    if (!child) return false;
    physicianForm.user_id = child._id;
    physicianForm.email = child.email;
    setPhysicianForm({ ...physicianForm });
  }
  //nested objects
  const handleNameChange = ({ target: { name, value } }) => {
    setPhysicianForm({ ...physicianForm, name: { ...physicianForm.name, [name]: value } });
  }
  const handleImageChange = async(e) => {
    if (e.target.files[0]) {
      let base64Image = await encodeImageFileAsURL(e.target.files[0]);
      setPhysicianForm({ ...physicianForm, photo: e.target.files[0], base64Image })
      return true;
    }
    return false;
  }
  const clearFields = () => {
    console.log('clear')
    resetFields(physicianForm, ['name']);
    resetFields(physicianForm.name);
    setPhysicianForm({ ...physicianForm });
    setChange(!change);
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (!loggedInUser) {
    return 'Authenticating....';
  }
  return (
    <>
      {!physicians.includes(loggedInUser.user_id.role) ? (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleClickOpen}
          sx={{ marginBottom: 2 }}
        >
          ACTIONS
        </Button>
      ) : ("")
      }

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"lg"}
      >
        {
          message.text ?
            <Alert
              severity={message.success ? 'success' : "error"}
            >
              {message.text}
            </Alert> : ""
        }
        <DialogTitle id="form-dialog-title">Physician</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Physicians that you create or modify here will reflect on Medical Records
          </DialogContentText>
          {/* enctype="multipart/form-data" */}
          <form noValidate >
            <Grid container spacing={1} >
              {/* Pohoto */}
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {physicianForm.photo !== '' && (
                  <Avatar
                    alt={`img`}
                    src={physicianForm.base64Image}
                    sx={{ width: 150, height: 150, bgcolor: blue[500], fontSize: 40, boxShadow: 3, marginBottom: 4, marginTop: 2 }}
                  />
                )}
                <label htmlFor="contained-button-file">
                  <Input
                    name="photo"
                    onChange={handleImageChange}
                    accept="image/*"
                    id="contained-button-file"
                    type="file" />
                  <Button variant="contained" component="span">
                    <PhotoCamera /> Upload Profile Picture
                  </Button>
                </label>
              </Grid>
              {/* Email */}
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ marginTop: 2 }}

                  clearOnEscape
                  options={users.doc || []}
                  defaultValue={users.doc?.find((v) => v.label)}
                  fullWidth
                  onChange={handleEmailChange}
                  renderInput={(params) => (
                    <TextField {...params}
                      name="email"
                      error={physicianForm.emailError}
                      required
                      onChange={handleChange}
                      label={`Current Account:${physicianForm.email ? physicianForm.email : ""}`} />
                  )}
                />
              </Grid>

              {!physicianForm.hide_license_field && (
                <Grid item xs={12} >
                  <TextField autoFocus
                    margin="dense"
                    id="prc_license"
                    name="prc_license"
                    label="PRC License"
                    type="text"
                    required
                    fullWidth
                    error={physicianForm.prc_licenseError}
                    value={physicianForm.prc_license}
                    variant="outlined"
                    onChange={handleChange}
                  />
                </Grid>

              )
              }

              {/* PTR No. */}

              <Grid item xs={12}>
                <TextField autoFocus
                  margin="dense"
                  id="ptr_no"
                  name="ptr_no"
                  label="PTR No."
                  type="text"
                  required
                  fullWidth
                  error={physicianForm.ptr_noError}
                  value={physicianForm.ptr_no}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              {/* NAME */}
              {/* Fname */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="firstname"
                  name="firstname"
                  label="First Name"
                  type="text"
                  required
                  fullWidth
                  error={physicianForm.name.firstnameError}
                  value={physicianForm.name.firstname}
                  variant="outlined"
                  onChange={handleNameChange}
                />
              </Grid>
              {/* Mname */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="middlename"
                  name="middlename"
                  label="Middle Initial"
                  type="text"
                  fullWidth
                  value={physicianForm.name.middlename}
                  variant="outlined"
                  onChange={handleNameChange}
                />
              </Grid>
              {/* Lname */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="lastname"
                  name="lastname"
                  label="Last Name"
                  type="text"
                  required
                  fullWidth
                  error={physicianForm.name.lastnameError}
                  value={physicianForm.name.lastname}
                  variant="outlined"
                  onChange={handleNameChange}
                />
              </Grid>
              {/* Suffix */}
              <Grid item xs={3}>
                <TextField margin="dense"
                  id="suffix"
                  name="suffix"
                  label="Suffix"
                  type="text"
                  fullWidth
                  value={physicianForm.name.suffix}
                  variant="outlined"
                  onChange={handleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField autoFocus
                  margin="dense"
                  id="details"
                  name="details"
                  label="Educational Background"
                  type="text"
                  required
                  multiline
                  maxRows={20}
                  fullWidth
                  error={physicianForm.detailsError}
                  value={physicianForm.details}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
            </Grid>


            {!physicians.includes(loggedInUser.user_id.role) ? (
              <DialogActions>
                <Button onClick={clearFields} color="warning">
                  Clear
                </Button>
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
            ) : ("")
            }
            
          </form>
        </DialogContent>
      </Dialog>
    </ >
  );
}
