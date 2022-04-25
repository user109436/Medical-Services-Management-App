import React, { useContext, useEffect, useState } from "react";
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
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Autocomplete
} from "@mui/material";
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import GlobalContext from '../../provider/GlobalProvider';
import StaffContext from '../../provider/StaffProvider';
import AuthContext from "../../provider/AuthProvider";
import {
  hasErrors,
  resetErrors,
  resetFields,
  makeFieldsError,
  fullname,
  isObjectExist,
  updateObjectById,
  copyFields,
} from "../../utils/Utilities";


export default function StaffForm() {
  const {
    addData,
    deleteData,
    updateData,
    getData,
    change,
    setChange,
    open,
    setOpen,
    message,
    setMessage
  } = useContext(GlobalContext);
  const {
    staffForm,
    setStaffForm,
    users
  } = useContext(StaffContext);
  const { loggedInUser } = useContext(AuthContext)
  const physicians = ['nurse', 'dentist', 'doctor'];
  const [department, setDepartment] = useState(
    {
      departments: []
    }
  );
  const civilStatus = ['Single', 'Married', 'Widowed', 'Divorced'];
  const [address, setAddress] = useState({
    id: "",
    house_number: "",
    street: "",
    barangay: "",
    municipality: "",
    city_province: "",
    house_numberError: false,
    streetError: false,
    barangayError: false,
    municipalityError: false,
    city_provinceError: false,
    update: false
  });
  const [contact, setContact] = useState({
    id: "",
    contact: "",
    contactError: false,
    update: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    //reset
    setMessage({ text: '', success: false });
    resetErrors(staffForm);
    resetErrors(staffForm.name)
    resetErrors(address);
    resetErrors(contact);
    //apply changes
    setStaffForm({ ...staffForm });
    setAddress({ ...address });
    setContact({ ...contact });
    //error validation & ignoring nested keys (name, address, contact)
    let errors = 0;
    if (staffForm.address.length === 0) {
      setMessage({ text: `Please Add an Address`, success: false });
      makeFieldsError(address);
      setAddress({ ...address });
      return false;
    }
    if (staffForm.contact.length === 0) {
      setMessage({ text: `Please Add Contact Number`, success: false });
      makeFieldsError(contact)
      setContact({ ...contact });
      return false;
    }
    errors += hasErrors(staffForm.name, ['middlename', 'suffix']);
    errors += hasErrors(staffForm, ['name', 'address', 'contact', 'selectedID']);
    if (!staffForm.user_id) {
      errors++;
      setMessage({ text: `Please Select Existing Email Address`, success: false });
    }
    if (errors) {
      setStaffForm({ ...staffForm });
      return false;
    }

    let res;
    if (staffForm.selectedID) {
      res = await updateData(`api/staffs/${staffForm.selectedID}`, staffForm);
    } else {
      res = await addData('api/staffs', staffForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${fullname(staffForm.name)} Successfully Saved`, success: true });
    setChange(!change);
    handleClear();

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (staffForm.selectedID) {
      const res = await deleteData(`api/staffs/${staffForm.selectedID}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${fullname(staffForm.name)} Successfully Deleted`, success: true });
        setChange(!change);
        resetFields(staffForm, ['name', 'address', 'contact']);
        resetFields(staffForm.name);
        staffForm.address = [];
        staffForm.contact = [];
        setStaffForm({ ...staffForm });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffForm({ ...staffForm, [name]: value });
  };
  const handleEmailChange = (e, child) => {
    if (!child) return false;
    staffForm.user_id = child._id;
    staffForm.email = child.email;
    setStaffForm({ ...staffForm });
  }
  //nested objects
  const handleNameChange = ({ target: { name, value } }) => {
    setStaffForm({ ...staffForm, name: { ...staffForm.name, [name]: value } });
  }
  //array nested objects
  const handleAddressChange = ({ target: { name, value } }) => {
    let id = new Date().getTime().toString();
    if (address.update) {
      id = address.id
    }
    setAddress({ ...address, [name]: value, id });
  }
  const handleContactChange = ({ target: { name, value } }) => {
    let id = new Date().getTime().toString();
    if (contact.update) {
      id = contact.id
    }
    setContact({ ...contact, [name]: value, id });
  }
  const addAddress = () => {

    //reset errors
    setMessage({ text: '' });
    resetErrors(address);
    setAddress({ ...address });

    //check for errors
    if (hasErrors(address, ['id', 'update'])) {
      setAddress({ ...address });
      return false;
    }
    if (address.update) {
      //update specific object
      updateObjectById(staffForm.address, address);
      setStaffForm({ ...staffForm });
      resetFields(address, ['update']);
      address.update = false;
      setAddress({ ...address });
      return true;
    }
    //validate if item already exist in array of objects
    if (isObjectExist(staffForm.address, address, ['id'])) {
      setMessage({ text: 'Address Already Exist', success: false });
      makeFieldsError(address);
      setAddress({ ...address });
      return false;
    }
    const newAddress = { ...address };
    staffForm.address.push(newAddress);
    resetFields(address);
    setAddress({ ...address });
  }
  const removeAddress = (id) => {
    let updatedAddress = staffForm.address.filter(address => address.id !== id);
    setStaffForm({ ...staffForm, address: [...updatedAddress] });
  }
  const editAddress = (item) => {
    copyFields(address, item);
    address.update = true;
    setAddress({ ...address });
  }
  const addContact = () => {

    setMessage({ text: '' });
    resetErrors(contact);
    setContact({ ...contact });
    //check for errors
    if (hasErrors(contact)) {
      setContact({ ...contact })
      return false;
    }
    if (contact.update) {

      //update specific object
      updateObjectById(staffForm.contact, contact);
      setStaffForm({ ...staffForm });
      resetFields(contact, ['update']);
      contact.update = false;
      setContact({ ...contact });
      return true;
    }
    //validate if item already exist in array of objects
    if (isObjectExist(staffForm.contact, contact, ['id'])) {
      setMessage({ text: 'Contact Already Exist', success: false });
      makeFieldsError(contact);
      setContact({ ...contact });
      return false;
    }
    const newContact = { ...contact }
    staffForm.contact.push(newContact);
    resetFields(contact, ['update']);
    contact.update = false;
    setContact({ ...contact });
  }
  const removeContact = (id) => {
    let updatedContact = staffForm.contact.filter(contact => contact.id !== id);
    setStaffForm({ ...staffForm, contact: [...updatedContact] });
  }
  const editContact = (item) => {
    copyFields(contact, item);
    contact.update = true;
    setContact({ ...contact });
  }
  const handleSelectChange = ({ target: { name, value } }) => {
    setStaffForm({ ...staffForm, [name]: value });
  }
  const handleDepartmentChange = (e, child) => {
    const { name, value } = e.target;
    const { className, id } = child.props;
    setStaffForm({ ...staffForm, [name]: value, [className]: id });

  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClear = () => {
    resetFields(staffForm, ['name', 'address', 'contact']);
    resetFields(staffForm.name);
    staffForm.address = [];
    staffForm.contact = [];
    setStaffForm({ ...staffForm });
    resetFields(address);
    setAddress({ ...address });
    resetFields(contact, ['update']);
    contact.update = false;
    setContact({ ...contact });
  }
  useEffect(() => {
    const fetchDepartment = async () => {
      let departments = await getData('api/departments');
      departments = departments.doc;
      setDepartment({ ...department, departments });
    };
    fetchDepartment();// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        <DialogTitle id="form-dialog-title">Staff</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Staffs that you create or modify here will reflect on Medical Records
          </DialogContentText>
          <form noValidate>
            <Grid container spacing={1} >
              {/* Email */}
              <Grid item xs={12}>
                <Autocomplete
                  sx={{ marginTop: 2 }}
                  clearOnEscape
                  options={users.doc || []}
                  defaultValue={users.doc?.find((v) => v.label)}
                  fullWidth
                  onChange={handleEmailChange}
                  isOptionEqualToValue={(option, value) => option.label === value.label}
                  renderInput={(params) => (
                    <TextField {...params}
                      name="email"
                      error={staffForm.emailError}
                      required
                      onChange={handleChange}
                      label={`Current Account:${staffForm.email ? staffForm.email : ""}`} />
                  )}
                />
              </Grid>
              {/* Employee No. */}

              <Grid item xs={12}>
                <TextField autoFocus
                  margin="dense"
                  id="employee_no"
                  name="employee_no"
                  label="Employee No."
                  type="text"
                  required
                  fullWidth
                  error={staffForm.employee_noError}
                  value={staffForm.employee_no}
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
                  error={staffForm.name.firstnameError}
                  value={staffForm.name.firstname}
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
                  value={staffForm.name.middlename}
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
                  error={staffForm.name.lastnameError}
                  value={staffForm.name.lastname}
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
                  value={staffForm.name.suffix}
                  variant="outlined"
                  onChange={handleNameChange}
                />
              </Grid>
              {/* Sex */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="sex"
                  name="sex"
                  label="Sex"
                  select
                  required
                  fullWidth
                  error={staffForm.sexError}
                  value={staffForm.sex}
                  variant="outlined"
                  onChange={handleSelectChange}
                >
                  <MenuItem key="male" value="male">
                    Male
                  </MenuItem>
                  <MenuItem key="female" value="female">
                    Female
                  </MenuItem>
                </TextField>
              </Grid>
              {/* deparment */}
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  id="department"
                  name="department"
                  label="Department"
                  select
                  required
                  fullWidth
                  error={staffForm.departmentError}
                  value={staffForm.department}
                  variant="outlined"
                  onChange={handleDepartmentChange}
                >
                  {
                    department.departments.map((item) => (
                      //id and className is a must
                      <MenuItem key={item._id} id={item._id} className="department_id" value={item.department}>
                        {item.department}
                      </MenuItem>
                    ))
                  }
                </TextField>

              </Grid>
              {/* birthday */}
              <Grid item xs={3}>
                <TextField id="date"
                  label="Birthday"
                  type="date"
                  required
                  error={staffForm.birthdayError}
                  value={staffForm.birthday}
                  name="birthday"
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {/* age */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="age"
                  name="age"
                  label="Age"
                  type="number"
                  required
                  fullWidth
                  error={staffForm.ageError}
                  value={staffForm.age}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              {/* civil status */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="civil_status"
                  name="civil_status"
                  label="Civil Status"
                  select
                  required
                  fullWidth
                  error={staffForm.civil_statusError}
                  value={staffForm.civil_status}
                  variant="outlined"
                  onChange={handleSelectChange}
                >
                  {civilStatus.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}

                </TextField>

              </Grid>
              {/* religion */}
              <Grid item xs={3}>
                <TextField margin="dense"
                  id="religion"
                  name="religion"
                  label="Religion"
                  type="text"
                  required
                  fullWidth
                  error={staffForm.religionError}
                  value={staffForm.religion}
                  variant="outlined"
                  onChange={handleChange}
                />
              </Grid>
              {/* ADDRESS */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom component="div">
                  Address
                </Typography>
              </Grid>
              {/* house number */}
              <Grid item xs={3}>
                <TextField margin="dense"
                  id="house_number"
                  name="house_number"
                  label="House Number"
                  type="text"
                  required
                  fullWidth
                  error={address.house_numberError}
                  value={address.house_number}
                  variant="outlined"
                  onChange={handleAddressChange}
                />
              </Grid>
              {/* street */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="street"
                  name="street"
                  label="Street"
                  type="text"
                  required
                  fullWidth
                  error={address.streetError}
                  value={address.street}
                  variant="outlined"
                  onChange={handleAddressChange}
                />
              </Grid>
              {/* barangay */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="barangay"
                  name="barangay"
                  label="Barangay"
                  type="text"
                  required
                  fullWidth
                  error={address.barangayError}
                  value={address.barangay}
                  variant="outlined"
                  onChange={handleAddressChange}
                />
              </Grid>
              {/* municipality */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="municipality"
                  name="municipality"
                  label="Municipality"
                  type="text"
                  required
                  fullWidth
                  error={address.municipalityError}
                  value={address.municipality}
                  variant="outlined"
                  onChange={handleAddressChange}
                />
              </Grid>
              {/* city_province */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="city_province"
                  name="city_province"
                  label="City/Province"
                  type="text"
                  required
                  fullWidth
                  error={address.city_provinceError}
                  value={address.city_province}
                  variant="outlined"
                  onChange={handleAddressChange}
                />
              </Grid>
              {/* ADD ADDRESS */}
              <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                <Button color="primary" onClick={addAddress}  >
                  <AddCircleIcon fontSize="large" /> Add Address
                </Button>
              </Grid>
              {/* Address List */}
              <Grid item xs={12}>
                <List>
                  {staffForm.address.map((item, i) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => removeAddress(item.id)} >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <HomeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        onClick={() => editAddress(item)}
                        primary={`${i + 1}) ${item.house_number} ${item.street} ${item.barangay} ${item.municipality} ${item.city_province}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom component="div">
                  Contact
                </Typography>
              </Grid>
              {/* contact */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="contact"
                  name="contact"
                  label="Contact No."
                  type="number"
                  required
                  fullWidth
                  error={contact.contactError}
                  value={contact.contact}
                  variant="outlined"
                  onChange={handleContactChange}
                />
              </Grid>
              <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'start', alignContent: 'center' }}>
                <Button color="primary" onClick={addContact}  >
                  <AddCircleIcon fontSize="large" /> Add Contact
                </Button>
              </Grid>
              {/* Contact List */}
              <Grid item xs={12}>
                <List>
                  {staffForm.contact.map((item, i) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => removeContact(item.id)} >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        onClick={() => editContact(item)}
                        primary={`${i + 1}) ${item.contact}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>

            {!physicians.includes(loggedInUser.user_id.role) ? (
              <DialogActions>
                <Button onClick={handleClose} color="warning">
                  Cancel
                </Button>
                <Button onClick={handleClear} color="warning">
                  Clear
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
