import React from "react";
import Timer from "./Timer";
import { MDBBtn } from "mdb-react-ui-kit";
import { DateFormatter } from "./helpers";

const EventRow = (props) => {
  const { start, end, type } = props;
//   const date = "10-10";
  console.log(start);

  const date = DateFormatter.formatDate(start.it.seconds);
  // const formatedStart = DateFormatter.formatTime(start);
  // const formatedEnd = DateFormatter.formatTime(end);

  return (
    <>
      <tr>
        <td>{date}</td>
        <td>{start}</td>
        <td>{type}</td>
        <td>{end ? end : <Timer />}</td>
        <td>
          <MDBBtn>Edit</MDBBtn>
          <MDBBtn color="danger">Delete</MDBBtn>
        </td>
      </tr>
    </>
  );
};

export default EventRow;
