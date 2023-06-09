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
  // console.log("render Eventlist");
  const { user, newUserEvent, toggleShow, setModalType, setModalEventToEdit } =
    props;
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

const [sortingLoading, setSortingLoading] = useState(true);

useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await EventService.getUserEvents(user.uid);
      setSortingLoading(true); // Start the sorting operation
      const sortedEvents = events.sort(
        (a, b) =>
          new Date(b.eventStart).getTime() - new Date(a.eventStart).getTime()
      );
      console.log(sortedEvents);
      setUserEvents(sortedEvents);
      setSortingLoading(false); // Sorting operation finished
    } catch (error) {
      console.error("Error retrieving events:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, [newUserEvent]);

const handleEditEvent = (editEvent) => {
  console.log(editEvent);
  setModalEventToEdit(editEvent);
  setModalType("edit");
  toggleShow();
};

const handleDeleteEvent = (deletedEventId) => {
  const updatedEvents = userEvents.filter(
    (event) => event.id !== deletedEventId
  );
  setUserEvents(updatedEvents);
  setLoading(false);
};

if (loading || sortingLoading) {
  return <Loading />; // Render a loading state or placeholder
}

  return (
    <>
      <MDBTable striped small className="table">
        <thead>
          <tr>
            {userEvents.length > 0 ? (
              <>
                <th scope="col">date</th>
                <th scope="col">type</th>
                <th scope="col">start</th>
                <th scope="col">end</th>
                <th scope="col" className="expand">
                  time
                </th>
                <th scope="col"></th>
              </>
            ) : (
              <>
                <th scope="col">No events found</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col" className="expand"></th>
                <th scope="col" className="expand"></th>
              </>
            )}
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
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  loading={loading}
                  setLoading={setLoading}
                  isNew={false}
                />
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">
                <h6>Clock in for your first registration</h6>
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    </>
  );
};

export default EventList;
