import React, { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";

const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    showPopUp,
    setShowPopUp,
    popUpBody,
    popUpTitle,
    setPopUpBody,
    setPopUpTitle,
  } = props;

    const showErrorPopup = (title, message) => {
      setPopUpTitle(title);
      setPopUpBody(message);

      return () => {
        setPopUpTitle(null);
        setPopUpBody(null);
      }
    };

    const closeErrorPopup = () => {
      setPopUpBody(null);
      setPopUpTitle(null);
    };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login successful, redirect to base page or admin page depending on the user's role
    } catch (error) {
      console.log(error);
      setPopUpTitle("Something went wrong");
      setPopUpBody(error);
      setShowPopUp(true);
    }
  };

  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Login</MDBCardTitle>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <MDBBtn onClick={handleLogin}>Login</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default LoginPage;
