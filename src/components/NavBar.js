import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { auth } from "../config/firebase";
import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { UserUtils } from "./helpers";

export const NavBar = (props) => {
  const { admin, logoOnly } = props;
  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {
    const logoRef = ref(storage, "images/CICO_Logo.png");
    getDownloadURL(logoRef)
      .then((result) => setLogoURL(result))
      .catch((error) => console.log(error));
  }, []);

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
            <img src={logoURL} height="60" alt="" loading="lazy" />
          </MDBNavbarBrand>
          <MDBNavbarNav className="mr-auto mb-2 mb-md-0">
            <MDBNavbarItem>
              <MDBNavbarLink
                active
                aria-current="page"
                href="/"
              ></MDBNavbarLink>
            </MDBNavbarItem>
            {logoOnly ? (
              <></>
            ) : (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink active aria-current="page" href="/">
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                {admin === true ? (
                  <MDBNavbarItem>
                    <MDBNavbarLink href="users">Users</MDBNavbarLink>
                  </MDBNavbarItem>
                ) : (
                  <></>
                )}
                <MDBBtn color="primary" onClick={UserUtils.signOutUser}>
                  Log out
                </MDBBtn>
              </>
            )}
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
};
