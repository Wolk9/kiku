import {
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardHeader,
  MDBCardTitle,
  MDBContainer,
  MDBInput,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import React from "react";

const Profile = () => {
  return (
    <>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>User Profile</MDBCardTitle>
          </MDBCardBody>
          <MDBCardBody>
            <MDBInputGroup>
              <MDBInput label="First Name" id="firstName" type="text" />
              <MDBInput label="Last Name" id="lastName" type="text" />
            </MDBInputGroup>
            <br />
           
              <MDBInput
                label="Telephone Number"
                id="telephone"
                type="tel"
              />
              <MDBInput label="E-mail Address" id="email" type="email" />
           
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default Profile;
