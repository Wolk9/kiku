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
  // console.log("render PopUp")
  const { title, message, setMessage } = props;

  return (
    <MDBModal
      tabIndex="-1"
      show={message !== null}
      onHide={() => setMessage(null)}
    >
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>{title ? title : "System Message"}</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={() => setMessage(null)}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <p>{message}</p>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={() => setMessage(null)}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export { PopUp };
