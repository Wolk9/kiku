import React, { useEffect, useState } from "react";
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
import { EventUtils } from "./helpers";
import {
  QuerySnapshot,
  collection,
  getDocs,
  where,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

const Timer = () => {
  return <>Timer</>;
};

const EventRow = (props) => {
  const { start, end } = props;
  let date = "1-2-2023";

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
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

  //   userEvents = [
  //     { id: 1, start: 1, date: "12-01-2023" },
  //     { id: 2, start: 1, date: "12-01-2023", end: 2 },
  //   ];

  useEffect(() => {
    const eventRef = collection(db, "events");
    const q = query(
      eventRef,
      where("userId", "==", user.uid),
      orderBy("eventStart", "desc")
    );
    onSnapshot(q, (snapshot) => {
      let events = [];
      snapshot.docs.forEach((event) => {
        events.push({ ...event.data(), id: event.id });
      });
      console.log(events);
      setUserEvents(events);
      setLoading(false);
    });
  }, []);

  console.log(userEvents);

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
                {userEvents.length > 0 ? (
                  userEvents.map((singleEvent) => (
                    <EventRow
                      key={singleEvent.id}
                      start={singleEvent.start}
                      end={singleEvent.end}
                    />
                  ))
                ) : (
                  <h3>No Events yet</h3>
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
