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
  const [form, setForm] = useState({});

  // const date = DateFormatter.formatDate(modalEventToEdit?.eventStart);
  // const formatedStart = DateFormatter.formatTime(modalEventToEdit?.eventStart);
  // const formatedEnd = DateFormatter.formatTime(modalEventToEdit?.eventEnd);

  const eventToEdit = {
    // date: date,
    // start: formatedStart,
    // end: formatedEnd,
    // type: modalEventToEdit?.type,
  };

  let content;

  switch (modalType) {
    case "edit":
      content = <EditForm form={form} setForm={setForm} event={eventToEdit} />;
      break;
    case "error":
      content = <ErrorDisplay />;
      break;
    default:
      return null;
  }

  const handleSave = () => {
    console.log("save");
    toggleShow();
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
  const { form, setForm, event } = props;

  console.log(event);

  useEffect(() => {
    setForm(event);
  }, []);

  useEffect(() => {
    console.log(form);
  }, [form]);

  const handleChange = (e) => {
    let prev = form;
    switch (e.target.name) {
      case "type":
        let selectedType = e.target.value;

        setForm({ ...prev, type: selectedType });
        break;
      default:
        setForm({ ...prev, [e.target.name]: e.target.value });
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
            value={event.date}
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
            value={event.eventStart}
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
            value={event.eventEnd}
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
            value={event.type}
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
