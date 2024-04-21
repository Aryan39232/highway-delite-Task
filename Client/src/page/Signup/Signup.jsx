import React, { useState } from "react";
import styles from "./Signup.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignUp = () => {
  // signup form
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [icon, setIcon] = useState("fa-eye");
  const [passwordType, setPasswordType] = useState("password");
  // button loader
  const [loader, setLoader] = useState(false);
  // twak
  const navigate = useNavigate();

  const location = useLocation();

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

  // handling signup
  const handleSignUp = (e) => {
    e.preventDefault();
    console.log("signupForm: ", signupForm);
    const { email, password, fullName } = signupForm;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~]).{8,20}$/gm;
    const emailRegex =
      /^[A-Za-z0-9]*[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+(?:\.[A-Za-z]{2,}){1,2}$/g;
    if (
      password.trim() == "" ||
      email?.trim() == "" ||
      fullName?.trim() == ""
    ) {
      getToast("Please Fill all Credentials", "top-right", "warn");
      return;
    }
    if (!emailRegex.test(email?.trim())) {
      if (!/^[A-Za-z0-9]/.test(email)) {
        getToast(
          "Email must start with a letter or digit",
          "top-right",
          "warn"
        );
      } else if (!/@/.test(email)) {
        getToast(
          "Email must contain at least one @ character",
          "top-right",
          "warn"
        );
      } else if (!/[A-Za-z]/.test(email.split("@")[0])) {
        getToast(
          "Email must contain at least one alphabet before @",
          "top-right",
          "warn"
        );
      } else if (!/[A-Za-z0-9]+\.[A-Za-z]{2,}$/.test(email)) {
        getToast("Email must end with a valid domain", "top-right", "warn");
      } else if (/\.\./.test(email)) {
        getToast("Email cannot contain consecutive dots", "top-right", "warn");
      } else {
        getToast("Enter a valid Email", "top-right", "warn");
      }
      return;
    }
    if (!passwordRegex.test(password.trim())) {
      getToast(
        "Need 8-20 character password: Containing upper, lower, digits, special chars (e.g.Creator#21).",
        "top-right",
        "warn"
      );
      return;
    }

    let data = {
      fullName: fullName,
      email: email?.trim(),
      password: password,
    };
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/userSignUp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        if (response?.data?.status == true) {
          getToast(response?.data?.message, "top-right", "success");
          setLoader(false);
          if (response?.data?.response_code) {
            // setShow1(true)
            // setMsg(response?.data?.message)
            localStorage.setItem("email", email);
            localStorage.setItem("firstName", fullName);
            console.log(response, "pppp");
            navigate("/otp-verify");
          }
          if (response?.data?.status == false) {
            getToast(response?.data?.message, "top-right", "error");
          }
        }
        if (response?.data?.status == false) {
          setLoader(false);
          if (response?.data?.response_code == 422) {
            getToast(response?.data?.message, "top-right", "error");
          }
          if (response?.data?.response_code == 500) {
            getToast(response?.data?.message, "top-right", "error");
          }
        }
      })
      .catch((error) => {
        setLoader(false);
        getToast(error?.data?.message, "top-right", "error");
      });
  };

  // geting toast

  const getToast = (message, position, type) => {
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

      case "warn":
        toast.warn(message, {
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
    <div className={styles.signup_container}>
      <div className={styles.signup_box}>
        {/* login img box  */}
        <div className={styles.signup_img_box}>
          <h1>Signup</h1>
        </div>

        {/* login form box */}

        <div className={styles.signup_form_box}>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              placeholder={"Full Name"}
              onChange={(e) =>
                setSignupForm({ ...signupForm, fullName: e.target.value })
              }
              value={signupForm.fullName}
              required
            />
            <input
              type="email"
              placeholder={"Email Address"}
              onChange={(e) =>
                setSignupForm({ ...signupForm, email: e.target.value })
              }
              value={signupForm.email}
              required
            />
            <div className={styles.input_group}>
              <input
                type={passwordType}
                placeholder={"Password"}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
                value={signupForm.password}
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
            <div className={styles.signup_btn}>
              <button disabled={loader} type="submit">
                {"Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
