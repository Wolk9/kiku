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
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const Loading = () => {
  return <h3>Loading...</h3>;
};

const EventList = (props) => {
  console.log("render Eventlist");
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

   useEffect(() => {
     const fetchEvents = async () => {
       try {
         const events = await EventService.getUserEvents(user.uid);
         setUserEvents(events);
         setLoading(false);
       } catch (error) {
         console.error("Error retrieving events:", error);
       }
     };

     fetchEvents();
   }, [user.uid]);

  // console.log(userEvents);

  const handleDeleteEvent = (deletedEventId) => {
    const updatedEvents = userEvents.filter(
      (event) => event.id !== deletedEventId
    );
    setUserEvents(updatedEvents);
    setLoading(false);
  };

  if (loading) {
    return <Loading />; // Render a loading state or placeholder
  }
  // console.log(userEvents);

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
                {userEvents.length > 0 ? (
                  userEvents.map((singleEvent) => (
                    <tr key={singleEvent.id}>
                      <EventRow
                        id={singleEvent.id}
                        start={singleEvent.eventStart}
                        end={singleEvent.eventEnd}
                        type={singleEvent.type}
                        onDelete={handleDeleteEvent}
                        loading={loading}
                        setLoading={setLoading}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <h4>No events found</h4>
                    </td>
                  </tr>
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
