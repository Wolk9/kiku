import React from "react";
import LogoutButton from "./LogoutButton";
import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { auth } from "./config/firebase";

export const NavBar = (props) => {
  const { admin } = props;
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Handle any additional logout logic or redirects here
    } catch (error) {
      // Handle error
      console.log("Error occurred while logging out:", error);
    }
  };
  return (
    <div>
      <MDBNavbar
        sticky
        expand="md"
        light
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <MDBContainer fluid>
          <MDBNavbarBrand href="#" className="mb-0 h1">
            <img
              src="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.webp"
              height="40"
              alt=""
              loading="lazy"
            />
          </MDBNavbarBrand>
          <MDBNavbarNav className="mr-auto mb-2 mb-md-0">
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current="page" href="#">
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            {admin == true ? (
              <MDBNavbarItem>
                <MDBNavbarLink href="users">Users</MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <></>
            )}
            <MDBBtn color="primary" onClick={handleLogout}>
              Log out
            </MDBBtn>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
};
