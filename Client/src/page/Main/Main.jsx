import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import LoginImage from "../../IMG/3099609.jpg";
import SignupImage from "../../IMG/Mobile-login.jpg";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="image-box">
          <img
            src={LoginImage}
            alt="/Login"
            onClick={() => navigate("/login")}
          />

          <img
            src={SignupImage}
            alt="/registration"
            onClick={() => navigate("/registration")}
          />
        </div>
      </div>
    </>
  );
}

export default Main;
