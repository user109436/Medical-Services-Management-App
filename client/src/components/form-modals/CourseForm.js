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
import CourseContext from '../../provider/CourseProvider';
import { makeStyles } from '@mui/styles';
import { hasErrors } from '../../utils/Utilities';
const useStyles = makeStyles({
  mb: {
    marginBottom: 16,
  },
});
//TODO: Look into this matter, A component is changing (upon deleting and typing course_code)
export default function CourseForm() {
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
    courses,
    setCourses,
    courseForm,
    setCourseForm,
  } = useContext(CourseContext);
  const classes = useStyles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //reset
    setMessage({ text: '', success: false });
    courseForm.courseError = false;
    courseForm.course_codeError = false;
    setCourseForm({ ...courseForm });
    if (hasErrors(courseForm)) {
      setCourseForm({ ...courseForm });
      return false;
    }

    //submit to our API endpoint

    let res;
    if (courses.deleteUpdate) {
      res = await updateData(`api/courses/${courses.deleteUpdate._id}`, courseForm);
    } else {
      res = await addData('api/courses', courseForm);
    }
    if (!res) {
      return false //axios will throw the error for duplicate fields and other errors
    }
    setMessage({ text: `${courseForm.course} Successfully Saved`, success: true });
    setChange(!change);
    setCourseForm({ ...courseForm, course: '', course_code: '' });
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    if (courses.deleteUpdate) {
      const res = await deleteData(`api/courses/${courses.deleteUpdate._id}`);
      if (Object.keys(res).length === 0) {
        setMessage({ text: `${courses.deleteUpdate.course} Successfully Deleted`, success: true });
        setCourseForm({ course: '' });
        courses.deleteUpdate="";
        setCourses({ ...courses});
        setOpen(false);
      }

      return setChange(!change);
    }
    return setMessage({ text: 'Please select/click an item to delete', success: false });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseForm({ ...courseForm, [name]: value });
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
        <DialogTitle id="form-dialog-title">Course</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The Courses that you create or modify here will reflect on Students Records
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
              id="course"
              name="course"
              label="Course"
              type="text"
              fullWidth
              required
              error={courseForm.courseError}
              value={courseForm.course}
              variant="outlined"
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              id="course_code"
              name="course_code"
              label="Course Code"
              type="text"
              fullWidth
              required
              error={courseForm.course_codeError}
              value={courseForm.course_code}
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
