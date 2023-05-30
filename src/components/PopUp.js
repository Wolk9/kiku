import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const PopUp = (props) => {
  const { title, body, showPopUp, setShowPopUp } = props;

  const toggleShowPopUp = () => setShowPopUp(!showPopUp);

  return (
    <MDBModal tabIndex="-1" show={showPopUp} setShow={setShowPopUp}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title ? title : ""}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShowPopUp}
            ></MDBBtn>{" "}
          </MDBModalHeader>
          <MDBModalBody>
            <p>{body ? body : "no body"}</p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShowPopUp}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export { PopUp };
