import React from "react";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
} from "mdb-react-ui-kit";

const BasePage = (props) => {
  const { admin } = props;
  return (
    <div>
      <NavBar admin={admin} />
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Welcome to the Base Page</MDBCardTitle>
            <p>This page is accessible to all users.</p>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>

      <EventList />
    </div>
  );
};

export default BasePage;
