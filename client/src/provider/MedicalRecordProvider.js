import { createContext, useState, memo } from "react";
const MedicalRecordContext = createContext({});

export const MedicalRecordProvider = memo(({ children }) => {
  // MEDICAL RECORDS
  const [medicalRecords, setMedicalRecords] = useState({});
  const [medicalRecordForm, setMedicalRecordForm] = useState({
    user_id: "",
    physician_id:"",
    symptoms:[],
    diagnosis:[],
    laboratories:[],
    prescriptions:[],
    user_idError: false,
    physician_idError:false,
    symptomsError:false,
    diagnosisError:false,
    laboratoriesError:false,
    prescriptionsError:false,
  });
  const [medicalRecord, setMedicalRecord] = useState({
    user_id: "",
    physician_id:"",
    symptoms:[],
    diagnosis:[],
    laboratories:[],
    prescriptions:[]
  });

  return (
    <MedicalRecordContext.Provider value={{
      medicalRecords,//MEDICAL RECORDS
      setMedicalRecords,
      medicalRecordForm,//FORM
      setMedicalRecordForm,
      medicalRecord,
      setMedicalRecord
    }}>
      {children}
    </MedicalRecordContext.Provider>
  );
});

export default MedicalRecordContext;
