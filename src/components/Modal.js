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
import { DateFormatter } from "./helpers";

export const Modal = (props) => {
  const { title, show, toggleShow, modalType, modalEventToEdit } = props;

  const initialEvent = {
    date: "",
    start: "",
    end: "",
    type: "Rijden",
  };

  const [form, setForm] = useState(initialEvent);

  console.log("modal event: ", modalEventToEdit);

  useEffect(() => {
    // Extract date and time values from ISO 8601 strings
    const eventDate = new Date(modalEventToEdit?.eventStart).toLocaleDateString(
      "en-GB"
    );
    let selectedDate = eventDate;
    // Convert the date format from "dd/MM/yyyy" to "yyyy-MM-dd"
    const [day, month, year] = selectedDate.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    let start = formattedDate; // Convert to local date string
    const startTime = new Date(modalEventToEdit?.eventStart).toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    ); // Convert to local time string
    const end = new Date(modalEventToEdit?.eventEnd).toLocaleDateString(
      "en-GB"
    );
    const endTime = new Date(modalEventToEdit?.eventEnd).toLocaleTimeString(
      "en-GB",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    // Set the extracted values as initial form values
    setForm((prevEvent) => ({
      ...prevEvent,
      date: start,
      start: startTime,
      end: endTime,
    }));
  }, []); // Empty dependency array to run the effect only once

  let content;

  switch (modalType) {
    case "edit":
      content = <EditForm form={form} setForm={setForm} />;
      break;
    case "error":
      content = <ErrorDisplay />;
      break;
    default:
      return null;
  }

  const handleSave = () => {
    console.log("save");
    console.log("handeSave: form", form);
    console.log("handleSave: form", form);
    // toggleShow();
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
                onClick={toggleShow}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>{content}</MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggleShow}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSave}>Save</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

const EditForm = (props) => {
  const { form, setForm } = props;

  console.log(form);

  useEffect(() => {
    setForm(form);
  }, []);

  useEffect(() => {
    console.log(form);
  }, [form]);

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
  );
};

const ErrorDisplay = () => {
  return <div>Error occurred.</div>;
};
