import React from "react";
import Timer from "./Timer";
import { MDBBtn } from "mdb-react-ui-kit";
import { DateFormatter, TimeDifferenceCalculator } from "./helpers";

const EventRow = (props) => {
  const { start, end, type } = props;
  //   const date = "10-10";
  console.log(start);

  const date = DateFormatter.formatDate(start);
  const formatedStart = DateFormatter.formatTime(start);
  const formatedEnd = DateFormatter.formatTime(end);

  const difference = TimeDifferenceCalculator.calculateDifference(start, end);
  return (
    <>
      <tr>
        <td>{date}</td>
        <td>{type}</td>
        <td>{formatedStart ? formatedStart : <></>}</td>

        {formatedEnd ? (
          <>
            <td>{formatedEnd}</td>
            <td>{difference}</td>
          </>
        ) : (
          <>
            <td></td>
            <td>
              <Timer />
            </td>
          </>
        )}

        <td>
          <MDBBtn>Edit</MDBBtn>
          <MDBBtn color="danger">Delete</MDBBtn>
        </td>
      </tr>
    </>
  );
};

export default EventRow;
