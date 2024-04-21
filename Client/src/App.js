import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Main from "./page/Main/Main";
import Login from "./page/Login/Login";
import SignUp from "./page/Signup/Signup";
import OTPVerify from "./page/Otp/otpVerify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<SignUp />} />
        <Route path="/otp-verify" element={<OTPVerify />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
