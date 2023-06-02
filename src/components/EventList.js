import React, { useEffect, useState } from "react";
import "../style/Table.css";
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
import EventRow from "./EventRow";
import { EventService } from "./helpers";

const EventList = (props) => {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEvents = await EventService.getUserEvents(user.uid);
        setUserEvents(userEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user events:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteEvent = (deletedEventId) => {
    const updatedEvents = userEvents.filter(
      (event) => event.id !== deletedEventId
    );
    setUserEvents(updatedEvents);
  };

  console.log(userEvents);

  return (
    <>
      <MDBContainer breakpoint="lg">
        <MDBCard>
          <MDBCardBody className="table-wrapper">
            <MDBTable striped small className="table">
              <thead>
                <tr>
                  <th scope="col">date</th>
                  <th className="expand" scope="col">
                    type
                  </th>
                  <th scope="col">start</th>
                  <th scope="col">end</th>
                  <th scope="col">time</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <MDBTableBody>
                {loading && <h3>Loading...</h3>}
                {userEvents.length > 0 ? (
                  userEvents.map((singleEvent) => (
                    <EventRow
                      id={singleEvent.id}
                      start={singleEvent.eventStart}
                      end={singleEvent.eventEnd}
                      type={singleEvent.type}
                      onDelete={handleDeleteEvent}
                    />
                  ))
                ) : (
                  <></>
                )}
              </MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
};

export default EventList;
