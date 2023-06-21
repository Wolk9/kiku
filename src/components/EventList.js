import { useEffect, useState } from "react";
import "../style/Table.css";
import { MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import EventRow from "./EventRow";
import {
  DateFormatter,
  EventService,
  TimeDifferenceCalculator,
} from "./helpers";
import { EditModal } from "./EditModal";

const Loading = () => {
  return <h3>Loading...</h3>;
};

const EventList = (props) => {
  // console.log("render Eventlist");
  const { user, newUserEvent } = props;
  const [modalEventToEdit, setModalEventToEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sortingLoading, setSortingLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const toggleShowEditModal = () => {
    console.log("toggle show Edit Modal");
    setShowEditModal(!showEditModal);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setIsSaved(false);
      try {
        const events = await EventService.getUserEvents(user.uid);
        setSortingLoading(true); // Start the sorting operation

        const sortEvents = (singleEvent) => {
          singleEvent.sort(function (a, b) {
            // Extract the date and time components from the event start dates
            var dateA = a.eventStart.split("T")[0];
            var timeA = a.eventStart.split("T")[1];
            var dateB = b.eventStart.split("T")[0];
            var timeB = b.eventStart.split("T")[1];

            // Compare the event dates
            if (dateA > dateB) {
              return -1;
            }
            if (dateA < dateB) {
              return 1;
            }

            // If the event dates are the same, compare the event times in descending order
            if (timeA > timeB) {
              return -1;
            }
            if (timeA < timeB) {
              return 1;
            }

            // If the event times are also the same, maintain the current order
            return 0;
          });

          return events;
        };

        const sortedEvents = sortEvents(events);

        console.log(sortedEvents);

        // Calculate subtotal of hours per day
        let subtotal = 0;
        let currentDate = null;
        let totalId = 0;
        const eventsWithSubtotal = sortedEvents.flatMap((event) => {
          console.log(event.eventStart);
          const [date, start] = event.eventStart.split("T");
          console.log(date, start);
          if (currentDate === date) {
            console.log("currentDate not null");
            const eventDuration =
              TimeDifferenceCalculator.calculateDurationInHours(
                event.eventStart,
                event.eventEnd
              );
            
            subtotal += eventDuration;
            console.log(eventDuration, subtotal);
          } else {
          }
          currentDate = date;
          // totalId = totalId + 1;
          // const eventDate = DateFormatter.formatDate(event.eventStart);
          // console.log("eventDate:", totalId, eventDate);

          // if (currentDate !== null) {
          //   console.log("eventDate != null");
          //   // Create a subtotal row for the previous date
          //   if (currentDate === eventDate) {
          //     console.log(currentDate, totalId, "currentDate === eventDate");
          //     const subtotalRow = {
          //       userId: "subtotal", // Customize as needed
          //       eventStart: event.eventStart,
          //       type: "subtotal", // Customize as needed
          //       eventEnd: "",
          //       subtotal: subtotal,
          //       id: totalId + 1, // Customize as needed
          //     };
          //     return [subtotalRow, event];
          //   }
          //   //subtotal = 0; // Reset subtotal for the new date
          // } else {
          //   const eventDuration =
          //     TimeDifferenceCalculator.calculateDurationInHours(
          //       event.eventStart,
          //       event.eventEnd
          //     );
          //   subtotal += eventDuration;
          // }

          // currentDate = eventDate;
          return event;
        });

        console.log(eventsWithSubtotal);
        setUserEvents(eventsWithSubtotal);
        setSortingLoading(false); // Sorting operation finished
      } catch (error) {
        console.error("Error retrieving events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line
  }, [newUserEvent, isSaved]);

  const handleEditEvent = (editEvent, e) => {
    const eventId = e;
    console.log(editEvent, eventId);
    setModalEventToEdit({ eventId: eventId, ...editEvent });
    toggleShowEditModal();
  };

  const handleDeleteEvent = (deletedEventId) => {
    const updatedEvents = userEvents.filter(
      (event) => event.id !== deletedEventId
    );
    setUserEvents(updatedEvents);
    setLoading(false);
  };

  const handleEdit = (e) => {
    console.log(e);
    EventService.getEvent(e).then((result) => {
      handleEditEvent(result, e);
    });
  };
  const handleDelete = async (e) => {
    console.log("Delete", e);
    // console.log(e);
    try {
      EventService.deleteEvent(e);
    } catch (err) {
      console.log(err);
    } finally {
      handleDeleteEvent(e);
      toggleShowEditModal();
      setIsSaved(true);
    }
  };

  if (loading || sortingLoading) {
    return <Loading />; // Render a loading state or placeholder
  }

  console.log(userEvents);

  return (
    <>
      {showEditModal && (
        <EditModal
          userId={user.uid}
          show={showEditModal}
          title="Edit Event"
          modalEventToEdit={modalEventToEdit}
          toggleShowEditModal={toggleShowEditModal}
          isSaved={isSaved}
          setIsSaved={setIsSaved}
          handleDelete={handleDelete}
        />
      )}
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
              <tr
                key={singleEvent.id}
                onClick={() => handleEdit(singleEvent.id)}
              >
                <EventRow
                  id={singleEvent.id}
                  start={singleEvent.eventStart}
                  end={singleEvent.eventEnd}
                  type={singleEvent.type}
                  loading={loading}
                  subtotal={singleEvent.subtotal}
                  setLoading={setLoading}
                  isNew={false}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
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
