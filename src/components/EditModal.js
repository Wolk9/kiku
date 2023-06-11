import {
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
  MDBBtn,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { DateFormatter, EventService } from "./helpers";
import userEvent from "@testing-library/user-event";
import moment from "moment";
import "../style/Modal.css";

export const EditModal = (props) => {
  const {
    userId,
    title,
    show,
    toggleShowEditModal,
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

  console.log("Edit Modal event: ", modalEventToEdit);

  useEffect(() => {
    if (modalEventToEdit) {
      // Extract date and time values using Moment.js
      const eventStart = moment(modalEventToEdit.eventStart);
      const eventEnd = moment(modalEventToEdit.eventEnd);

      // Format the date and time values
      const formattedDate = eventStart.format("YYYY-MM-DD");
      const formattedStartTime = eventStart.format("HH:mm");
      const formattedEndTime = eventEnd.format("HH:mm");

      // Set the formatted values as initial form values
      setForm((prevEvent) => ({
        ...prevEvent,
        date: formattedDate,
        start: formattedStartTime,
        end: formattedEndTime,
      }));
    }
  }, [modalEventToEdit]);

  const ObjectConverter = (inputObject) => {
    const { date, start, end, type } = inputObject;

    // Combine date and time strings
    const eventStart = `${date}T${start}:00.000`;
    const eventEnd = `${date}T${end}:00.000`;

    // Convert to Moment objects in local timezone
    const startMoment = moment(eventStart);
    const endMoment = moment(eventEnd);

    // Convert to UTC
    const utcStart = startMoment.utc().toISOString();
    const utcEnd = endMoment.utc().toISOString();

    // Construct the output object
    const outputObject = {
      eventStart: utcStart,
      type,
      userId,
      eventEnd: utcEnd,
    };

    return outputObject;
  };

  const handleSave = async () => {
    setIsSaved(false);
    console.log("handleSave: form", form);
    const convertedObject = DateFormatter.ObjectConverter(form, userId);
    console.log("converted Object: ", convertedObject);
    try {
      EventService.editEvent(modalEventToEdit.eventId, convertedObject);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaved(true);
      toggleShowEditModal();
      setForm(initialEvent);
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
                onClick={toggleShowEditModal}
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
                <MDBBtn color="secondary" onClick={toggleShowEditModal}>
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
