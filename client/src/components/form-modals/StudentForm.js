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
import StudentContext from '../../provider/StudentProvider';
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


export default function StudentForm() {
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
    studentForm,
    setStudentForm,
    users
  } = useContext(StudentContext);
  const { loggedInUser } = useContext(AuthContext)
  const physicians = ['nurse', 'dentist', 'doctor'];
  const [yearSectionCourse, setYearSectionCourse] = useState(
    {
      // years: [],
      // sections: [],
      courses: []
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
    resetErrors(studentForm);
    resetErrors(studentForm.name)
    resetErrors(address);
    resetErrors(contact);
    //apply changes
    setStudentForm({ ...studentForm });
    setAddress({ ...address });
    setContact({ ...contact });
    //error validation & ignoring nested keys (name, address, contact)
    let errors = 0;
    if (studentForm.address.length === 0) {
      setMessage({ text: `Please Add an Address`, success: false });
      makeFieldsError(address);
      setAddress({ ...address });
      return false;
    }
    if (studentForm.contact.length === 0) {
      setMessage({ text: `Please Add Contact Number`, success: false });
      makeFieldsError(contact)
      setContact({ ...contact });
      return false;
    }
    errors += hasErrors(studentForm.name, ['middlename', 'suffix']);
    errors += hasErrors(studentForm, ['name', 'address', 'contact', 'selectedID','year_id','section_id']);
    if (!studentForm.user_id) {
      errors++;
      setMessage({ text: `Please Select Existing Email Address`, success: false });
    }
    if (errors) {
      setStudentForm({ ...studentForm });
      return false;
    }

    let res;
    if (studentForm.selectedID) {
      res = await updateData(`api/students/${studentForm.selectedID}`, studentForm);
    } else {
      res = await addData('api/students', studentForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${fullname(studentForm.name)} Successfully Saved`, success: true });
    setChange(!change);
    handleClear();

  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (studentForm.selectedID) {
      const res = await deleteData(`api/students/${studentForm.selectedID}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${fullname(studentForm.name)} Successfully Deleted`, success: true });
        setChange(!change);
        resetFields(studentForm, ['name', 'address', 'contact']);
        resetFields(studentForm.name);
        studentForm.address = [];
        studentForm.contact = [];
        setStudentForm({ ...studentForm });
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentForm({ ...studentForm, [name]: value });
  };
  const handleEmailChange = (e, child) => {
    if (!child) return false;
    studentForm.user_id = child._id;
    studentForm.email = child.email;
    setStudentForm({ ...studentForm });
  }
  //nested objects
  const handleNameChange = ({ target: { name, value } }) => {
    setStudentForm({ ...studentForm, name: { ...studentForm.name, [name]: value } });
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
      updateObjectById(studentForm.address, address);
      setStudentForm({ ...studentForm });
      resetFields(address, ['update']);
      address.update = false;
      setAddress({ ...address });
      return true;
    }
    //validate if item already exist in array of objects
    if (isObjectExist(studentForm.address, address, ['id'])) {
      setMessage({ text: 'Address Already Exist', success: false });
      makeFieldsError(address);
      setAddress({ ...address });
      return false;
    }
    const newAddress = { ...address };
    studentForm.address.push(newAddress);
    resetFields(address);
    setAddress({ ...address });
  }
  const removeAddress = (id) => {
    let updatedAddress = studentForm.address.filter(address => address.id !== id);
    setStudentForm({ ...studentForm, address: [...updatedAddress] });
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
      updateObjectById(studentForm.contact, contact);
      setStudentForm({ ...studentForm });
      resetFields(contact, ['update']);
      contact.update = false;
      setContact({ ...contact });
      return true;
    }
    //validate if item already exist in array of objects
    if (isObjectExist(studentForm.contact, contact, ['id'])) {
      setMessage({ text: 'Contact Already Exist', success: false });
      makeFieldsError(contact);
      setContact({ ...contact });
      return false;
    }
    const newContact = { ...contact }
    studentForm.contact.push(newContact);
    resetFields(contact, ['update']);
    contact.update = false;
    setContact({ ...contact });
  }
  const removeContact = (id) => {
    let updatedContact = studentForm.contact.filter(contact => contact.id !== id);
    setStudentForm({ ...studentForm, contact: [...updatedContact] });
  }
  const editContact = (item) => {
    copyFields(contact, item);
    contact.update = true;
    setContact({ ...contact });
  }
  const handleSelectChange = ({ target: { name, value } }) => {
    setStudentForm({ ...studentForm, [name]: value });
  }
  const handleYearSectionCourseChange = (e, child) => {
    const { name, value } = e.target;
    const { className, id } = child.props;
    setStudentForm({ ...studentForm, [name]: value, [className]: id });

  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClear = () => {
    resetFields(studentForm, ['name', 'address', 'contact']);
    resetFields(studentForm.name);
    studentForm.address = [];
    studentForm.contact = [];
    setStudentForm({ ...studentForm });
    resetFields(address);
    setAddress({ ...address });
    resetFields(contact, ['update']);
    contact.update = false;
    setContact({ ...contact });
  }
  useEffect(() => {
    const fetchYearSectionCourse = async () => {
      // let sections = await getData('api/sections');
      // let years = await getData('api/years');
      let courses = await getData('api/courses');
      // sections = sections.doc;
      // years = years.doc;
      courses = courses.doc;
      setYearSectionCourse({ ...yearSectionCourse,courses });
    };
    fetchYearSectionCourse();// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!loggedInUser) {
    return 'Authenticating....';
  }
  return (
    <div>
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
        <DialogTitle id="form-dialog-title">Student</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Students that you create or modify here will reflect on Medical Records
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
                      error={studentForm.emailError}
                      required
                      onChange={handleChange}
                      label={`Current Account:${studentForm.email ? studentForm.email : ""}`} />
                  )}
                />
              </Grid>
              {/* Student No. */}

              <Grid item xs={12}>
                <TextField autoFocus
                  margin="dense"
                  id="student_no"
                  name="student_no"
                  label="Student No."
                  type="number"
                  required
                  fullWidth
                  error={studentForm.student_noError}
                  value={studentForm.student_no}
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
                  error={studentForm.name.firstnameError}
                  value={studentForm.name.firstname}
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
                  value={studentForm.name.middlename}
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
                  error={studentForm.name.lastnameError}
                  value={studentForm.name.lastname}
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
                  value={studentForm.name.suffix}
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
                  error={studentForm.sexError}
                  value={studentForm.sex}
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
              {/* year */}
              {/* <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="year"
                  name="year"
                  label="Year Level"
                  select
                  required
                  fullWidth
                  error={studentForm.yearError}
                  value={studentForm.year}
                  variant="outlined"
                  onChange={handleYearSectionCourseChange}
                >
                  {
                    yearSectionCourse.years.map((item) => (
                      //id and className is a must
                      <MenuItem key={item._id} id={item._id} className="year_id" value={item.year}>
                        {item.year}
                      </MenuItem>
                    ))
                  }
                </TextField>

              </Grid> */}
              {/* course */}
              <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="course"
                  name="course"
                  label="Course"
                  select
                  required
                  fullWidth
                  error={studentForm.courseError}
                  value={studentForm.course}
                  variant="outlined"
                  onChange={handleYearSectionCourseChange}
                >
                  {
                    yearSectionCourse.courses.map((item) => (
                      //id and className is a must
                      <MenuItem key={item._id} id={item._id} className="course_id" value={item.course}>
                        {item.course}
                      </MenuItem>
                    ))
                  }
                </TextField>

              </Grid>
              {/* section */}
              {/* <Grid item xs={3}>
                <TextField
                  margin="dense"
                  id="section"
                  name="section"
                  label="Section"
                  select
                  required
                  fullWidth
                  error={studentForm.sectionError}
                  value={studentForm.section}
                  variant="outlined"
                  onChange={handleYearSectionCourseChange}
                >
                  {
                    yearSectionCourse.sections.map((item) => (
                      //id and className is a must
                      <MenuItem key={item._id} id={item._id} className="section_id" value={item.section}>
                        {item.section}
                      </MenuItem>
                    ))
                  }
                </TextField>

              </Grid> */}
              {/* birthday */}
              <Grid item xs={3}>
                <TextField id="date"
                  label="Birthday"
                  type="date"
                  required
                  error={studentForm.birthdayError}
                  value={studentForm.birthday}
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
                  error={studentForm.ageError}
                  value={studentForm.age}
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
                  error={studentForm.civil_statusError}
                  value={studentForm.civil_status}
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
                  error={studentForm.religionError}
                  value={studentForm.religion}
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
                  {studentForm.address.map((item, i) => (
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
                  {studentForm.contact.map((item, i) => (
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
    </div>
  );
}
