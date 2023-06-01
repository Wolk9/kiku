import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { UserService } from "../components/helpers";

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

  const userProfile = UserService.getUserData(user.uid);

  console.log("Adminpage admin:", admin);
  console.log("User: ", userProfile);
  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>
              Welcome {userProfile.firstName} to the {admin ? "Admin" : "Base"} page
            </MDBCardTitle>
            <p>This page is accessible to all users.</p>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      <EventList user={user} />
    </div>
  );
};

export default BasePage;
