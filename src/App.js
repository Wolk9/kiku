import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BasePage from "./pages/BasePage";
import UsersPage from "./pages/UsersPage";
import { auth } from "./config/firebase";
import { NavBar } from "./components/NavBar";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const PopUp = (props) => {
  const { title, body, showPopUp, setShowPopUp } = props;

  const toggleShowPopUp = () => setShowPopUp(!showPopUp);

  return (
    <MDBModal tabIndex="-1" show={showPopUp} setShow={setShowPopUp}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title ? title : "no title"}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShowPopUp}
            ></MDBBtn>{" "}
          </MDBModalHeader>
          <MDBModalBody>
            <p>{body ? body : "no body"}</p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShowPopUp}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

const App = () => {
  console.log("render App")
  const [user, setUser] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpBody, setPopUpBody] = useState("");
  const [popUpTitle, setPopUpTitle] = useState("");

  useEffect(() => {
    // Add an observer to check for user authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  //// console.log(user.uid, user.email);

  const isAdmin = user && user.email === "martin.de.bes@me.com";
  // console.log(user);
  // console.log(isAdmin);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={isAdmin ? "/admin" : "/base"} />
            ) : (
              <>
                <NavBar logoOnly={true} />
                <PopUp
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
                <LoginPage
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
              </>
            )
          }
        />
        <Route
          path="/base"
          element={
            user ? (
              <>
                <NavBar admin={isAdmin} />
                <PopUp
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
                <BasePage
                  user={user}
                  admin={isAdmin}
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <>
                <NavBar admin={isAdmin} />
                <PopUp
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
                <BasePage
                  user={user}
                  admin={isAdmin}
                  showPopUp={showPopUp}
                  setShowPopUp={setShowPopUp}
                  popUpBody={popUpBody}
                  setPopUpBody={setPopUpBody}
                  popUpTitle={popUpTitle}
                  setPopUpTitle={setPopUpTitle}
                />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/users" element={<UsersPage admin={isAdmin} />} />
      </Routes>
    </Router>
  );
};

export default App;
