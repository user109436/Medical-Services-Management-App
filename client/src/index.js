import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./provider/AuthProvider";
import "./index.css";
import axios from "axios";

axios.defaults.baseURL = 'https://e-consultation-app.herokuapp.com';
// axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.headers.common["Authorization"] =`Bearer ${localStorage.getItem("token")}`;
axios.create({
  withCredentials:true
});
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
