import React from "react";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import { MDBContainer } from "mdb-react-ui-kit";

const BasePage = (props) => {
  const { admin } = props;
  return (
    <div>
      <NavBar admin={admin} />
      <MDBContainer>
        <h1>Welcome to the Base Page</h1>
        <p>This page is accessible to all users.</p>
      </MDBContainer>

      <EventList />
    </div>
  );
};

export default BasePage;
