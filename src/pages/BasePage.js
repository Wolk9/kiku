import React, { useEffect, useState } from "react";
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
  const [userProfile, setUserProfile] = useState({});
  
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
      console.error("Error retrieing user data:", error);
    });
}, []);

console.log("Adminpage admin:", admin);

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
