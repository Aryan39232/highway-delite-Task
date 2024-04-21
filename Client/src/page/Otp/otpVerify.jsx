import React, { useState } from "react";
import "./Otp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import OtpInput from "react-otp-input";
import "./Otp.css";
import Modal from "react-bootstrap/Modal";
import { Loader } from "../../Loader/Loader";
import { useRef } from "react";

const OTPVerify = () => {
  const navigation = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [show, setShow] = useState(false);
  const [setShowValidationMessage] = useState(false);
  const [loader, setLoader] = useState(false);
  const tawkMessengerRef = useRef();

  const handleClose = () => {
    setShow(false);
  };

  const handleOTP = (e) => {
    e.preventDefault();
    setLoader(true);
    if (otp == undefined || otp == null || otp.trim().length == 0) {
      setMessage("Please Enter OTP.");
      setColor("red");
      return;
    }
    let email = localStorage.getItem("email");
    let firstName = localStorage.getItem("firstName");
    let data = JSON.stringify({
      otp: otp,
      email: email,
      fullName: firstName,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:5000/api/otpVerification",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    console.log("OTP", config);
    axios
      .request(config)
      .then((response) => {
        if (response?.data?.status == true) {
          navigation("/");
          if (response?.data?.response_code) {
            localStorage.setItem("token", response?.data?.token);
            setMessage(response?.data?.message);
            setShowValidationMessage({ value: true });
            setColor("green");
            setLoader(false);
            localStorage.setItem("email", email);
            tawkMessengerRef.current.setAttributes(
              {
                name: localStorage.getItem("firstName") || "",
                email: localStorage.getItem("email") || "",
              },
              function (error) {
                console.log("the error is  :-:=:-:=:-:=:-:=:-:=>>>>>>>", error);
              }
            );
            let timeout = null;

            timeout = setTimeout(() => {
              setShowValidationMessage({ value: false });
              clearTimeout(timeout);
            }, 0);
          }
        }
        if (response?.data?.status == false) {
          setLoader(false);
          setShow(true);
          setMessage(response?.data?.message);
          setColor("red");
        }
      })
      .catch((error) => {
        setLoader(false);
        setMessage(error?.data?.message);
        setColor("red");
      });
  };

  return (
    <section className="Otp-block">
      <div class="login-content">
        <div className="text-center">
          <form onSubmit={handleOTP}>
            <p
              className="text-center"
              style={{ fontSize: "25px", fontWeight: "bold", color: "#000" }}
            >
              Please enter the OTP that has been sent to your registered email
            </p>
            <div className="margin-top--small">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                shouldAutoFocus={true}
                containerStyle={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                inputStyle={{ width: "4rem", paddingLeft: "10%" }}
                renderSeparator={<span>{"     -    "}</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "2em",
                      textAlign: "center",
                      height: "4rem",
                      display: "flex",
                      fontSize: "2rem",
                      borderRadius: "4px",
                      border: "1px solid rgba(0,0,0,.3)",
                      margin: "0 1rem",
                    }}
                  />
                )}
              />

              <div class="form-group" style={{ marginTop: "5rem" }}>
                {loader ? (
                  <div className="loader-container-otp">
                    <Loader className="round-btn" />
                  </div>
                ) : (
                  <div class="text-center">
                    <button type="submit" class="round-btn">
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        {show && (
          <Modal
            dialogClassName="modal-dialog modal-sm"
            centered
            show={show}
            onHide={handleClose}
            style={{
              position: "fixed",
              top: "80%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Modal.Body className="p-0">
              <div className="card logout-card common_box">
                <div className="card-body common_box_body ">
                  <p
                    className="modalTitle text-center mb-2 fw-bold"
                    style={{ color: `${color}` }}
                  >
                    {message}
                  </p>
                  <form className="custom_form">
                    <div className="btn-wrapper text-center">
                      <button className="round-btn" onClick={handleClose}>
                        Ok
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </section>
  );
};
export default OTPVerify;
