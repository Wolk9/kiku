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
  const { user, userEvents, setUserEvents } = props;
  const [loading, setLoading] = useState(true);

  console.log(user);

  const q = query(collection(db, "events"), where("userId", "==", user.uid));

  useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const col = [];
      snapshot.docs.forEach((doc) => {
        col.push({ ...doc.data(), id: doc.id });
      });
      console.log("eventservice getuserevents:", col);
      setLoading(false);
      setUserEvents(col);
    });
  }, []);

  console.log(userEvents);

  const handleDeleteEvent = (deletedEventId) => {
    const updatedEvents = userEvents.filter(
      (event) => event.id !== deletedEventId
    );
    setUserEvents(updatedEvents);
    setLoading(false);
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
                {userEvents.length > 0 ? (
                  userEvents.map((singleEvent) => (
                    <EventRow
                      key={singleEvent.id}
                      id={singleEvent.id}
                      start={singleEvent.eventStart}
                      end={singleEvent.eventEnd}
                      type={singleEvent.type}
                      onDelete={handleDeleteEvent}
                      loading={loading}
                      setLoading={setLoading}
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
