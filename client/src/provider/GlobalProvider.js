import { createContext, useState, memo } from "react";
import axios from 'axios';
const GlobalContext = createContext({});

export const GlobalProvider = memo(({ children }) => {
  // MEDICINES
  const [medicines, setMedicines] = useState({});
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    brand: "",
    nameError: false,
    brandError: false,
  });
  //GENERAL
  const [message, setMessage] = useState({
    text: '',
    success: false
  });
  const [change, setChange] = useState(false);//triggers fetching data when CRUD occurs
  const [open, setOpen] = useState(false);//open/close modal

  const getData = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.data) {
        return res.data;
      }
      return {};
    } catch (err) {
      console.log(err.response);
    }
  }
  const addData = async (url, data) => {
    try {
      const res = await axios.post(url, data);
      if (res.data) {
        return res.data;
      }
      return {};
    } catch (err) {
      console.log(err.response);
      setMessage({ text: `${err.response.data.message}`, success: false });
    }
  }
  const deleteData = async (url) => {
    //ex. DELETE api/medicines/:id
    try {
      const res = await axios.delete(url);
      if (res.data) {
        return res.data;
      }
      return {};
    } catch (err) {
      const { data } = err.response;
      setMessage({ text: `Cannot Delete: ${data.message}`, success: false });
    }
  }
  const updateData = async (url, data) => {
    //ex. PATCH api/medicines/:id
    try {
      const res = await axios.patch(url, data);
      if (res.data) {
        return res.data;
      }
      return {};
    } catch (err) {
      console.log(err.response);
      setMessage({ text: `${err.response.data.message}`, success: false });
    }
  }
  const sendVerification= async(email)=>{
    const res = await addData(`api/account/signup/resend-email-verification`, {email});
    if(!res){
      return false;
    }
    setMessage({text:res.message, success:true});
    return true;
  }
  return (
    <GlobalContext.Provider value={{
      getData,//CRUD
      addData,
      deleteData,
      updateData,
      change,//FETCH DATA
      setChange,
      open,//MODAL
      setOpen,
      message,
      setMessage,
      medicines,//MEDICINES
      setMedicines,
      medicineForm,
      setMedicineForm,
      sendVerification
    }}>
      {children}
    </GlobalContext.Provider>
  );
})

export default GlobalContext;
