import { createContext, useState, memo } from "react";
const CourseContext = createContext({});

export const CourseProvider = memo(({ children }) => {
  // COURSES
  const [courses, setCourses] = useState({});
  const [courseForm, setCourseForm] = useState({
    course: "",
    course_code:"",
    courseError: false,
    course_codeError: false,
  });

  return (
    <CourseContext.Provider value={{
      courses,//COURSES
      setCourses,
      courseForm,//FORM
      setCourseForm
    }}>
      {children}
    </CourseContext.Provider>
  );
});

export default CourseContext;
