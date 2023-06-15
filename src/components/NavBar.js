import { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { storage } from "../config/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { UserService } from "./helpers";

export const NavBar = (props) => {
  // console.log("render NavBar")
  const { admin, logoOnly, setUser, setMessage } = props;
  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {
    const logoRef = ref(storage, "images/CICO_Logo.png");
    getDownloadURL(logoRef)
      .then((result) => setLogoURL(result))
      .catch((error) => console.log(error));
  }, []);

  const onLogOut = () => {
    console.log("logout clicked");
    try {
      UserService.signOutUser();
    } catch (err) {
      setMessage(err);
    } finally {
      setUser(null);
    }
  };

  return (
    <div>
      <MDBNavbar
        sticky
        expand="sm"
        light
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <MDBContainer fluid>
          <MDBNavbarBrand href="#" className="mb-0 h1">
            <img src={logoURL} height="60" alt="" loading="lazy" />
          </MDBNavbarBrand>
          <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
            {/* mr-auto d-flex justify-content-between */}
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
                <div className="d-flex justify-content-start">
                  <MDBNavbarItem className="mx-1 my-0">
                    <MDBNavbarLink active aria-current="page" href="/">
                      Home
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="mx-1 my-0">
                    <MDBNavbarLink aria-current="page" href="profile">
                      UserProfile
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                  {admin === true ? (
                    <MDBNavbarItem className="mx-1 my-0">
                      <MDBNavbarLink aria-current="page" href="users">
                        Users
                      </MDBNavbarLink>
                    </MDBNavbarItem>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="d-flex justify-content-end">
                  <MDBBtn
                    color="primary"
                    onClick={onLogOut}
                    className="mx-1 my-0"
                  >
                    Log out
                  </MDBBtn>
                </div>
              </>
            )}
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
    </div>
  );
};
