import {
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBBtn,
  MDBCol,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { DateFormatter, EventService, RealTimeService } from "./helpers";
import moment from "moment";
import "../style/Modal.css";

export const EditRunningEventModal = (props) => {
  const {
    userId,
    title,
    show,
    toggleEditRunningEventShow,
    modalEventToEdit,
    isSaved,
    setIsSaved,
    handleDelete,
  } = props;

  const initialEvent = {
    date: "",
    start: "",
    end: "",
    type: "Rijden",
  };

  const [form, setForm] = useState(initialEvent);

  // console.log("Edit Modal event: ", modalEventToEdit);

  useEffect(() => {
    if (modalEventToEdit) {
      // Extract date and time values using Moment.js
      const eventStart = moment(modalEventToEdit.eventStart);

      // Format the date and time values
      const formattedDate = eventStart.format("YYYY-MM-DD");
      const formattedStartTime = eventStart.format("HH:mm");
      // Set the formatted values as initial form values
      setForm((prevEvent) => ({
        ...prevEvent,
        date: formattedDate,
        start: formattedStartTime,
        end: "",
      }));
    }
  }, [modalEventToEdit]);

  const handleSave = async () => {
    console.log("handleSave: form", form);
    setIsSaved(!isSaved);
    // const convertedObject = DateFormatter.ObjectConverter(form, userId);
    // console.log("converted Object: ", convertedObject);
    try {
      console.log("writing running event")
      RealTimeService.editRunningEvent(userId, form);
      //EventService.editEvent(modalEventToEdit.eventId, convertedObject);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaved(!isSaved);
      toggleEditRunningEventShow();
      setForm(form);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let prev = form;
    switch (name) {
      case "type":
        let selectedType = value;

        setForm({ ...prev, type: selectedType });
        break;
      case "date":
        // let selectedDate = value;
        // // Convert the date format from "dd/MM/yyyy" to "yyyy-MM-dd"
        // const [day, month, year] = selectedDate.split("/");
        // const formattedDate = `${year}-${month}-${day}`;
        setForm({ ...prev, date: value });
        break;
      default:
        setForm({ ...prev, [name]: value });
        break;
    }
  };

  return (
    <div>
      <MDBModal show={show}>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{title}</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={toggleEditRunningEventShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="form">
                <div className="row">
                  <div className="col">
                    <label htmlFor="date">Date:</label>
                  </div>
                  <div className="col">
                    <input
                      name="date"
                      type="date"
                      id="date"
                      value={form.date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="start">Start Time:</label>
                  </div>
                  <div className="col">
                    <input
                      name="start"
                      type="time"
                      id="start"
                      value={form.start}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="end">End Time:</label>
                  </div>
                  <div className="col">
                    <input
                      name="end"
                      type="time"
                      id="end"
                      value={form.end}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label htmlFor="type">Type:</label>
                  </div>
                  <div className="col">
                    <select
                      className="select"
                      name="type"
                      id="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="rijden">rijden</option>
                      <option value="uitgifte">uitgifte</option>
                      <option value="inname">inname</option>
                      <option value="laden">laden</option>
                      <option value="kantoor">kantoor</option>
                      <option value="extern">extern</option>
                    </select>
                  </div>
                </div>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBCol>
                <MDBBtn
                  color="danger"
                  onClick={() => handleDelete(modalEventToEdit.eventId)}
                >
                  Delete
                </MDBBtn>
              </MDBCol>
              <MDBCol className="d-flex flex-row-reverse">
                <MDBBtn onClick={handleSave}>Save</MDBBtn>
                <MDBBtn color="secondary" onClick={toggleEditRunningEventShow}>
                  Cancel
                </MDBBtn>
              </MDBCol>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};
