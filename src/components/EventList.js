import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
const EventList = (props) => {
  return (
    <>
      <MDBContainer breakpoint="lg">
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Registrations</MDBCardTitle>

            <MDBTable striped small>
              <MDBTableHead>
                <tr>
                  <th scope="col">date</th>
                  <th scope="col">start</th>
                  <th scope="col">end</th>
                  <th scope="col"></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody></MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default EventList;
