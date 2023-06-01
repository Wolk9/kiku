import React from "react";
import "../style/Table.css";
import Timer from "./Timer";
import { EventService, DateFormatter, TimeDifferenceCalculator } from "./helpers";
import { BsFillTrashFill, BsFillPenFill } from "react-icons/bs";

const EventRow = (props) => {
  const { start, end, type, id } = props;
  //   const date = "10-10";
  console.log(id);

  const date = DateFormatter.formatDate(start);
  const formatedStart = DateFormatter.formatTime(start);
  const formatedEnd = DateFormatter.formatTime(end);

  const difference = TimeDifferenceCalculator.calculateDifference(start, end);

  const handleEdit = (e) => {
    console.log(e);
  };

  const handleDelete = (e) => {
      console.log(e);
      EventService.deleteEvent(e);
      
  };

  return (
    <>
      <tr key={id}>
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
          <span className="actions">
            <BsFillTrashFill
              className="delete-btn"
              onClick={() => handleDelete(id)}
            />
            <BsFillPenFill
              className="edit-btn"
              onClick={() => handleEdit(id)}
            />
          </span>
        </td>
      </tr>
    </>
  );
};

export default EventRow;
