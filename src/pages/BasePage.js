import { useEffect, useState } from "react";
import "../style/Table.css";
import EventList from "../components/EventList";
import { MDBContainer, MDBCard, MDBCardTitle, MDBCardBody } from "mdb-react-ui-kit";
import {
  UserService,
  EventService,
  RealTimeService,
} from "../components/helpers";
import { Modal } from "../components/Modal";
import { Timer } from "../components/Timer";
import { RunningEvent } from "../components/RunningEvent";

const BasePage = (props) => {
  // console.log("render BasePage");
  const { admin, user } = props;
  const [userProfile, setUserProfile] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalType, setModalType] = useState("");
  const [eventStarted, setEventStarted] = useState();
  const [newUserEvent, setNewUserEvent] = useState();
  const [modalEventToEdit, setModalEventToEdit] = useState();

  useEffect(() => {
    UserService.getUserData(user.uid)
      .then((userProfile) => {
        setUserProfile(userProfile);
      })
      .catch((error) => {
        console.error("Error retrieving user data:", error);
      });
    RealTimeService.readRunningEvent(user.uid).then((result) => {
      if (result !== undefined) {
        const eventStart = result.eventStart;
        const eventEnd = result.eventEnd;
        const type = result.type;
        const userId = result.userId;

        setNewUserEvent({
          eventStart: eventStart,
          eventEnd: eventEnd,
          type: type,
          userId: userId,
        });
        setEventStarted(true);
      } else {
        setNewUserEvent();
      }
    });
    // eslint-disable-next-line
  }, []);

  let runningEvent = async () => {
    try {
      let result = RealTimeService.readRunningEvent(user.uid);
      return result;
    } catch (err) {
      console.log(err);
    } finally {
    }
  };
  console.log("running Event from rtdb:", runningEvent());

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
      RealTimeService.writeRunningEvent(user.uid, newClockIn);
      // await EventService.addEvent(newClockIn)
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  console.log(newUserEvent);

  const stopEvent = async (e) => {
    console.log("stop Event", e);
    const runningEvent = newUserEvent;
    const end = new Date();

    const stoppedEvent = { ...runningEvent, eventEnd: end.toISOString() };

    console.log(stoppedEvent);

    try {
      await EventService.addEvent(stoppedEvent);
    } catch (err) {
      console.log(err);
    } finally {
      setEventStarted(false);
      setNewUserEvent();
      RealTimeService.deleteRunningEvent(user.uid);
    }
  };

  console.log(newUserEvent);

  return (
    <div>
      <Modal
        show={modalShow}
        toggleShow={toggleShow}
        modalType={modalType}
        modalEventToEdit={modalEventToEdit}
      />
      <MDBContainer breakpoint="lg">
        <MDBCard className="mt-5">
          <MDBCardBody className="table-wrapper">
            <MDBCardTitle>
              Welcome{" "}
              <span className={admin ? "admin" : "user"}>
                {userProfile.firstName}
              </span>
            </MDBCardTitle>
            <p>
              <br />
            </p>
            <span className="cico-btn-group d-flex justify-content-center mb-5">
              <button
                className="clock-in-btn"
                onClick={handleClockIn}
                disabled={eventStarted}
              >
                {eventStarted ? (
                  <Timer eventStart={newUserEvent.eventStart} />
                ) : (
                  <>Clock in</>
                )}
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

        {newUserEvent && (
          <MDBCard className="table-wrapper animation">
            <MDBCardBody>
              <RunningEvent user={user} newUserEvent={newUserEvent} />
            </MDBCardBody>
          </MDBCard>
        )}

        {/* <MDBCard className="mt-5 transparent-card">
          <MDBCardBody> */}
            <EventList
              user={user}
              newUserEvent={newUserEvent}
              setNewUserEvent={setNewUserEvent}
              toggleShow={toggleShow}
              setModalType={setModalType}
              setModalEventToEdit={setModalEventToEdit}
            />
          {/* </MDBCardBody>
        </MDBCard> */}
      </MDBContainer>
    </div>
  );
};

export default BasePage;
