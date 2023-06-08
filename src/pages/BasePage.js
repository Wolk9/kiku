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
import { UserService, EventService } from "../components/helpers";
import { Modal } from "../components/Modal";
import { Timer } from "../components/Timer";
import { serverTimestamp } from "firebase/firestore";

const BasePage = (props) => {
  console.log("render BasePage");
  const {
    admin,
    showPopUp,
    setShowPopUp,
    popUpBody,
    setPopUpBody,
    popUpTitle,
    setPopUpTitle,
    user,
  } = props;
  const [userProfile, setUserProfile] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [eventStarted, setEventStarted] = useState(false);
  const [newUserEvent, setNewUserEvent] = useState([]);

  // []);.log("user.uid: ", user.uid);

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

  const handleClockIn = async () => {
    const newClockIn = {
      userId: user.uid,
      type: "Rijden",
      eventStart: serverTimestamp(),
      eventEnd: "running",
    };
    setNewUserEvent(newClockIn); // Update the event list state
    setEventStarted(true); // Set eventStarted to true
  };

  const stopEvent = async (e) => {
    const runningEvent = newUserEvent;

    const stoppedEvent = { ...runningEvent, eventEnd: serverTimestamp() };

    try {
      const newEndTime = serverTimestamp();

      await EventService.addEvent(stoppedEvent); // Add the new event
      // Assign the generated event ID
      setEventStarted(false);
    } catch (err) {
      // console.log("no open Event found");
      console.log(err);
      // Handle the case where no open event was found
    } finally {
      setEventStarted(false);
      setNewUserEvent([]);
    }
  };

  // console.log("Adminpage admin:", admin);

  return (
    <div>
      <Modal show={modalShow} toggleShow={toggleShow} />
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Welcome {userProfile.firstName}</MDBCardTitle>
            <p>
              You are {admin ? "an Admin" : "an User"}
              <br />
              Choose your action here
            </p>
            <span className="cico-btn-group">
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
        <MDBCard>
          <MDBCardBody>
            
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>


      <EventList
        user={user}
        newUserEvent={newUserEvent}
        setNewUserEvent={setNewUserEvent}
      />
    </div>
  );
};

export default BasePage;
