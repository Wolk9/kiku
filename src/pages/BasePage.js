import React, { useEffect, useState } from "react";
import "../style/Table.css";
import { NavBar } from "../components/NavBar";
import EventList from "../components/EventList";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
} from "mdb-react-ui-kit";
import {
  UserService,
  EventService,
  RealTimeService,
} from "../components/helpers";
import { Modal } from "../components/Modal";
import { Timer } from "../components/Timer";
import { serverTimestamp } from "firebase/firestore";
import { RunningEvent } from "../components/RunningEvent";

const BasePage = (props) => {
  console.log("render BasePage");
  const { admin, user } = props;
  const [userProfile, setUserProfile] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [eventStarted, setEventStarted] = useState();
  const [newUserEvent, setNewUserEvent] = useState();

  useEffect(() => {
    const userProfile = UserService.getUserData(user.uid)
      .then((userProfile) => {
        setUserProfile(userProfile);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }, []);

  const toggleShow = () => setModalShow(!modalShow);

  const handleClockIn = () => {
    const start = new Date();
    let newClockIn = {
      userId: user.uid,
      type: "Rijden",
      eventStart: start.toISOString(),
      eventEnd: "running",
    };

    console.log("newClockIn", newClockIn);
    setNewUserEvent(newClockIn);
    setEventStarted(true);
    try {
      RealTimeService.writeData(user.uid, newClockIn);
      // await EventService.addEvent(newClockIn)
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  console.log(newUserEvent);

  const writeDataToDatabase = async () => {
    const data = newUserEvent;
    console.log(data);
  };

  const stopEvent = async (e) => {
    console.log("stop Event", e);
    const runningEvent = newUserEvent;
    const end = new Date();

    const stoppedEvent = { ...runningEvent, eventEnd: end };

    console.log(stoppedEvent);

    try {
      await EventService.addEvent(stoppedEvent);
    } catch (err) {
      console.log(err);
    } finally {
      setEventStarted(false);
      setNewUserEvent();
    }
  };

  console.log(newUserEvent);

  return (
    <div>
      <Modal show={modalShow} toggleShow={toggleShow} />
      <MDBContainer breakpoint="lg">
        <MDBCard>
          <MDBCardBody className="table-wrapper">
            <MDBCardTitle>Welcome {userProfile.firstName}</MDBCardTitle>
            <p>
              You are {admin ? "an Admin" : "an User"}
              <br />
              Choose your action here
            </p>
            <span className="cico-btn-group d-flex justify-content-centerr">
              <button
                className="clock-in-btn"
                onClick={handleClockIn}
                disabled={eventStarted}
              >
                {eventStarted ? <Timer /> : "Clock in"}
              </button>
              <button
                className="clock-out-btn"
                onClick={stopEvent}
                disabled={!eventStarted}
              >
                Clock out
              </button>
            </span>
          </MDBCardBody>
        </MDBCard>
        <MDBCard className="table-wrapper">
          <MDBCardBody>
            {newUserEvent && (
              <RunningEvent user={user} newUserEvent={newUserEvent} />
            )}
          </MDBCardBody>
        </MDBCard>
        <MDBCard>
          <MDBCardBody className="table-wrapper">
            <EventList
              user={user}
              newUserEvent={newUserEvent}
              setNewUserEvent={setNewUserEvent}
            />
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default BasePage;
