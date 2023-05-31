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
import EventRow from "./EventRow";
import { EventService } from "./helpers";

const EventList = (props) => {
  const { user } = props;
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

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
  }, [user.uid]);

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
                  <th scope="col">type</th>
                  <th scope="col">start</th>
                  <th scope="col">end</th>
                  <th scope="col">time</th>
                  <th scope="col"></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {userEvents.length > 0 ? (
                  userEvents.map((singleEvent) => (
                    <EventRow
                      key={singleEvent.id}
                      start={singleEvent.eventStart}
                      end={singleEvent.eventEnd}
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
