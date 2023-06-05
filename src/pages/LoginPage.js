import React, { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
} from "mdb-react-ui-kit";

const LoginPage = (props) => {
  console.log("render LoginPage")
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
    };
  };

  const closeErrorPopup = () => {
    setPopUpBody(null);
    setPopUpTitle(null);
  };

  const handleEmailChange = (e) => {
    // console.log(e);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    // console.log(e);
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    // console.log(email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // console.log("Login succesful");
      //Login successful, redirect to base page or admin page depending on the user's role
    } catch (error) {
      // console.log(error);
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

            <MDBInput
              name="email"
              className="mb-4"
              type="email"
              label="Email address"
              value={email}
              onChange={handleEmailChange}
            />

            <MDBInput
              name="password"
              className="mb-4"
              type="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
            />

            <MDBRow className="mb-4">
              <MDBCol className="d-flex justify-content-center">
                <MDBCheckbox
                  id="login_remember_me"
                  label="Remember me"
                  defaultChecked
                />
              </MDBCol>
              <MDBCol>
                <a href="#!">Forgot password?</a>
              </MDBCol>
            </MDBRow>

            <MDBBtn type="submit" onClick={handleLogin} block>
              Sign in
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default LoginPage;
