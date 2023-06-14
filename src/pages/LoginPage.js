// React imports
import React, { useState } from "react";
import "../style/Table.css";

// Firebase imports
import { auth, db } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

// MDBootstrap imports
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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

export const AuthorizePage = (props) => {
  const { message, setMessage } = props;
  const [signUp, setSignUp] = useState(false);

  return (
    <>
      {!signUp ? (
        <>
          <LoginDialog
            message={message}
            setMessage={setMessage}
            setSignUp={setSignUp}
          />
        </>
      ) : (
        <>
          <SignInDialog
            message={message}
            setMessage={setMessage}
            setSignUp={setSignUp}
          />
        </>
      )}
    </>
  );
};

const LoginDialog = (props) => {
  const { setSignUp, message, setMessage } = props;
  // console.log("render LoginDialaog")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signInUser = async () => {
    console.log("signInUser");
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (err) {
      setMessage(err.message);
      console.error(err);
    }
  };

  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Login</MDBCardTitle>
            <div className="d-grid gap-2 col-8 mx-auto">
              <MDBInput
                size="lg"
                name="email"
                className="mb-4"
                type="email"
                label="Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <MDBInput
                size="lg"
                name="password"
                className="mb-4"
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <MDBBtn type="submit" onClick={signInUser} block>
                Sign in
              </MDBBtn>
              <MDBBtn
                color="link"
                rippleColor="dark"
                onClick={() => setSignUp(true)}
              >
                Never used this app before?
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

const SignInDialog = (props) => {
  const { message, setMessage, setSignUp } = props;
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerValue, setRegisterValue] = useState("");
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerDob, setRegisterDob] = useState("");
  const [registerHoursPerWeek, setRegisterHoursPerWeek] = useState(24);
  const [registerContractDate, setRegisterContractDate] = useState("");
  const [registerRole, setRegisterRole] = useState("user");

  const usersRef = collection(db, "users");

  let log = {
    firstName: registerFirstName || null,
    lastName: registerLastName || null,
    dob: registerDob || null,
    contractDate: registerContractDate || null,
    hoursPerWeek: registerHoursPerWeek || null,
    role: registerRole || null,
  };
  console.log(log);

  const createUser = async (uid) => {
    console.log(uid);
    let newUser = {
      firstName: registerFirstName || null,
      lastName: registerLastName || null,
      dob: registerDob || null,
      contractDate: registerContractDate || null,
      hoursPerWeek: registerHoursPerWeek || null,
      role: registerRole || null,
    };
    console.log(newUser);
    try {
      await setDoc(doc(usersRef, uid), newUser);
      console.log("createUser:", newUser);
    } catch (err) {
      console.error(err);
    }
  };

  const registerUser = () => {
    console.log("registerUser");

    createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        createUser(user.uid);
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        if (error.code == "auth/invalid-email") {
          let errorToDisplay = "Invalid Email for registering";
          setMessage(errorToDisplay);
        } else if (error.code == "auth/missing-password") {
          let errorToDisplay = "That password is invallid for registering";
          setMessage(errorToDisplay);
        } else {
          setMessage(errorMessage);
        }
      });
  };

  const handleChangeAge = (value) => {
    const newValue = registerHoursPerWeek + value;
    if (newValue > 36) {
      setMessage("You can't have a contract of more than 36 hours per week");
      let newValue = 36;
      return newValue;
    }
    setRegisterHoursPerWeek(newValue);
  };

  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>SignUp</MDBCardTitle>
            <div className="d-grid gap-2 col-8 mx-auto">
              <h6>Your login details</h6>

              <MDBInput
                size="lg"
                className="mb-4"
                type="email"
                value={registerEmail}
                label="Register Email..."
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <MDBInput
                size="lg"
                className="mb-4"
                type="password"
                value={registerPassword}
                label="Register Password..."
                onChange={(e) => setRegisterPassword(e.target.value)}
              />

              <hr className="hr" />
              <h6>Your personal details</h6>

              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                value={registerFirstName}
                label="FirstName..."
                onChange={(e) => setRegisterFirstName(e.target.value)}
              />

              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                value={registerLastName}
                label="LastName..."
                onChange={(e) => setRegisterLastName(e.target.value)}
              />

              <MDBInput
                size="lg"
                className="mb-4"
                type="date"
                value={registerDob}
                label="Date of birth"
                onChange={(e) => setRegisterDob(e.target.value)}
              />

              <hr className="hr" />
              <h6>Your contract details</h6>
              <MDBRow className="mb-5">
                <MDBCol>
                  <MDBInput
                    size="lg"
                    className="mb-4"
                    type="date"
                    value={registerContractDate}
                    label="Contract date"
                    onChange={(e) => setRegisterContractDate(e.target.value)}
                  />
                </MDBCol>

                <MDBCol>
                  <MDBRow className="d-flex">
                    <MDBCol className="d-flex align-items-center justify-content-end">
                      <MDBBtn
                        color="danger"
                        onClick={() => handleChangeAge(-4)}
                      >
                        -
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol className="d-flex align-items-center justify-content-center">
                      <MDBInput
                        size="lg"
                        className=""
                        type="number"
                        value={registerHoursPerWeek}
                        label="Hours per week"
                        onChange={(e) =>
                          setRegisterHoursPerWeek(e.target.value)
                        }
                      />
                    </MDBCol>
                    <MDBCol className="d-flex align-items-center justify-content-start">
                      <MDBBtn
                        color="success"
                        onClick={() => handleChangeAge(+4)}
                      >
                        +
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>
              <MDBBtn type="submit" onClick={registerUser} block>
                Register
              </MDBBtn>
              <MDBBtn
                color="link"
                rippleColor="dark"
                onClick={() => setSignUp(false)}
              >
                Used this app before?
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};
