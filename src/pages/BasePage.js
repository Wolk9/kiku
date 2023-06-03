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
  const [userEvents, setUserEvents] = useState([]);

  console.log("user.uid: ", user.uid);

  useEffect(() => {
    const userProfile = UserService.getUserData(user.uid)
      .then((userProfile) => {
        console.log("User: ", userProfile);
        console.log(userProfile.age);
        console.log(userProfile.contractDate);
        console.log(userProfile.firstName);
        console.log(userProfile.hoursPerWeek);
        console.log(userProfile.lastName);
        console.log(userProfile.role);
        setUserProfile(userProfile);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
  }, []);

  const toggleShow = () => setModalShow(!modalShow);

  const addEvent = () => {
    console.log("addEvent");
    const newEvent = {
      userId: user.uid,
      type: "Rijden",
      eventStart: serverTimestamp(),
      eventEnd: "running",
    };
    EventService.addEvent(user.uid, newEvent).then(() => {
      setEventStarted(true);
      //setUserEvents([...userEvents, newEvent]);
    });
  };

const stopEvent = async (e) => {
  console.log("stopEvent", e);
  const openEventId = await EventService.getOpenEventDocId(user.uid);
  console.log(openEventId);

  if (openEventId) {
    const newEndTime = serverTimestamp();
    await EventService.setEventEndTime(openEventId, newEndTime);
    // Do additional actions after updating the endTime field
    setEventStarted(false);
  } else {
    console.log("no open Event found");
    // Handle the case where no open event was found
  }
};


  console.log("Adminpage admin:", admin);

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
                onClick={addEvent}
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
      </MDBContainer>

      <EventList
        user={user}
        userEvents={userEvents}
        setUserEvents={setUserEvents}
      />
    </div>
  );
};

export default BasePage;
