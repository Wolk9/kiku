import React, { useEffect, useState } from "react";
import "../style/Table.css";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { UserService } from "../components/helpers";
import { Modal } from "../components/Modal";

const BasePage = (props) => {
  const {
    admin,
    showPopUp,
    setShowPopUp,
    popUpBody,
    setPopUpBody,
    popUpTitle,
    setPopUpTitle,
    user,
  } = props;
  const [userProfile, setUserProfile] = useState({});
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const userProfile = UserService.getUserData(user.uid)
      .then((userProfile) => {
        console.log("User: ", userProfile);
        console.log(userProfile.age);
        console.log(userProfile.contractDate);
        console.log(userProfile.firstName);
        console.log(userProfile.hoursPerWeek);
        console.log(userProfile.lastName);
        console.log(userProfile.role);
        setUserProfile(userProfile);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }, []);

  const toggleShow = () => setModalShow(!modalShow);

  console.log("Adminpage admin:", admin);

  return (
    <div>
      <Modal show={modalShow} toggleShow={toggleShow} />
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Welcome {userProfile.firstName}</MDBCardTitle>
            <p>
              You are {admin ? "an Admin" : "an User"}
              <br />Choose your action here
            </p>
            <span className="cico-btn-group">
              <button className="clock-in-btn" onClick={toggleShow}>
                Clock in
              </button>
              <button className="clock-out-btn">Clock out</button>
            </span>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      <EventList user={user} />
    </div>
  );
};

export default BasePage;
