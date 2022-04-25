import { createContext, useState, memo } from "react";
const MedicineContext = createContext({});

export const MedicineProvider = memo(({ children }) => {
  // MEDICINES
  const [medicines, setMedicines] = useState({});
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    brand: "",
    nameError: false,
    brandError: false,
  });
  return (
    <MedicineContext.Provider value={{
      medicines,//MEDICINES
      setMedicines,
      medicineForm,
      setMedicineForm,
    }}>
      {children}
    </MedicineContext.Provider>
  );
})

export default MedicineContext;
