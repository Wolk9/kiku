import React, { useState } from "react";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
} from "mdb-react-ui-kit";

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

  console.log("Adminpage admin:", admin);
  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>
              Welcome to the {admin ? "Admin" : "Base"} Page
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
