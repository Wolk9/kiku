import React from "react";
import { NavBar } from "../components/NavBar";
import { updateDocumentsWithISO8601 } from "../config/convert";
import { MDBBtn, MDBCard, MDBContainer } from "mdb-react-ui-kit";

const UsersPage = (props) => {
  const { admin } = props;

  const handleClick = () => {
  updateDocumentsWithISO8601();
}
  return (
    <MDBContainer>
      <NavBar admin={admin} />
      <MDBCard><MDBBtn onClick={handleClick}>Convert</MDBBtn>
      </MDBCard>
    </MDBContainer>
  );
};

export default UsersPage;
