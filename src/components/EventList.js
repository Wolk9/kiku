import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBContainer,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import { UserUtils } from "./helpers";

const Timer = () => {
  return <>Timer</>;
};

const EventRow = (props) => {
  const { date, start, end } = props;
  return (
    <>
      <tr>
        <td>{date}</td>
        <td>{start}</td>
        <td>{end ? end : <Timer />}</td>
        <td>
          <MDBBtn>Edit</MDBBtn>
          <MDBBtn color="danger">Delete</MDBBtn>
        </td>
      </tr>
    </>
  );
};

const EventList = (props) => {
  const { user } = props;
  let userEvents = [
    { id: 1, start: 1, date: "12-01-2023" },
    { id: 2, start: 1, date: "12-01-2023", end: 2 },
  ];

  console.log(UserUtils.getUserData(user.uid));

  return (
    <>
      <MDBContainer breakpoint="lg">
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Events</MDBCardTitle>

            <MDBTable striped small>
              <MDBTableHead>
                <tr>
                  <th scope="col">date</th>
                  <th scope="col">start</th>
                  <th scope="col">end</th>
                  <th scope="col"></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {userEvents.map((singleEvent) => (
                  <EventRow
                    key={singleEvent.id}
                    date={singleEvent.date}
                    start={singleEvent.start}
                    end={singleEvent.end}
                  />
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default EventList;
