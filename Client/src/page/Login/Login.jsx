import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { AuthUrl } from "../../API config/config";
import axios from "axios";

const Login = () => {
  // window.trackGA(null);
  const { t } = useTranslation();
  // for google recaptcha
  const recaptchaRef = useRef(null);
  const [icon, setIcon] = useState("fa-eye");
  const [passwordType, setPasswordType] = useState("password");
  // login form keys
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  // button loader
  const [loader, setLoader] = useState(false);
  // twak
  const tawkMessengerRef = useRef();
  const navigate = useNavigate();
  // for toggling the password
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setIcon("fa-eye-slash");
      return;
    }
    setPasswordType("password");
    setIcon("fa-eye");
  };

  // for handling login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoader(true);
    let data = JSON.stringify(loginForm);
    console.log("loginForm: ", loginForm);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/userSignIn",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    // login api call
    axios
      .request(config)
      .then((response) => {
        console.log("->>>>>>>>>>>>>..", response);
        if (response?.data?.status == true) {
          setLoader(false);
          getErrorToast(response?.data?.message, "top-right", "success");
          navigate("/");
          if (response?.data?.response_code) {
            localStorage.setItem("firstName", response?.data?.data?.name);
            localStorage.setItem("email", response?.data?.data?.email);
            localStorage.setItem("token", response?.data?.token);

            tawkMessengerRef.current.setAttributes(
              {
                name: localStorage.getItem("firstName") || "",
                email: localStorage.getItem("email") || "",
              },
              function (error) {
                // do something if error
                console.log("the error is  :-:=:-:=:-:=:-:=:-:=>>>>>>>", error);
              }
            );
            // setMessage(response?.data?.message)
            console.log("navigate ho");
          }
        }
        if (response?.data?.status == false) {
          getErrorToast(response?.data?.message, "top-right", "warn");
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        getErrorToast(error?.response?.data?.message, "top-right", "error");
      });
  };

  const getErrorToast = (message, position, type) => {
    switch (type) {
      case "success":
        toast.success(message, {
          position: position,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        break;
      case "error":
        toast.error(message, {
          position: position,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        break;
      // Add more cases for other types as needed
      default:
        // Handle unknown types or provide a default behavior
        toast(message, {
          position: position,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        break;
    }
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_box}>
        {/* login img box  */}
        <div className={styles.login_img_box}>
          <h1>LOGIN</h1>
        </div>

        {/* login form box */}

        <div className={styles.login_form_box}>
          <form onSubmit={handleLogin}>
            <div>
              <input
                type="email"
                placeholder={t("Email Address")}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                value={loginForm.email}
                required
              />
            </div>
            <div>
              <div className={styles.input_group}>
                <input
                  type={passwordType}
                  placeholder={t("Password")}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  value={loginForm.password}
                  required
                />
                <i className={styles.input_group_password_icon}>
                  <a
                    onClick={togglePassword}
                    className={styles.input_group_password_icon}
                    class={`fa fa-fw   ${icon}`}
                  ></a>
                </i>
              </div>
            </div>

            <div className={styles.login_form_btn}>
              <button disabled={loader} type="submit">
                {t("Login")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
