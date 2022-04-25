import { createContext, useState, memo } from "react";
const YearContext = createContext({});

export const YearProvider = memo(({ children }) => {
  // YEARS
  const [years, setYears] = useState({});
  const [yearForm, setYearForm] = useState({
    year: "",
    yearError: false,
  });

  return (
    <YearContext.Provider value={{
      years,//YEARS
      setYears,
      yearForm,//FORM
      setYearForm
    }}>
      {children}
    </YearContext.Provider>
  );
});

export default YearContext;
