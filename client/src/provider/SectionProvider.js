import { createContext, useState, memo } from "react";
const SectionContext = createContext({});

export const SectionProvider = memo(({ children }) => {
  // SECTIONS
  const [sections, setSections] = useState({});
  const [sectionForm, setSectionForm] = useState({
    section: "",
    sectionError: false,
  });

  return (
    <SectionContext.Provider value={{
      sections,//SECTIONS
      setSections,
      sectionForm,//FORM
      setSectionForm
    }}>
      {children}
    </SectionContext.Provider>
  );
});

export default SectionContext;
