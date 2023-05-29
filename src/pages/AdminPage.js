import React from "react";
import { NavBar } from "../components/NavBar";
import { MDBContainer } from "mdb-react-ui-kit";

const AdminPage = (props) => {
  const { admin } = props;
  console.log("Adminpage admin:", admin);
  return (
    <div>
      <NavBar admin={admin} />
      <MDBContainer fluid breakpoint="lg">
        <h1>Welcome to the Admin Page</h1>
        <p>This page is only accessible to administrators.</p>
      </MDBContainer>
    </div>
  );
};

export default AdminPage;
