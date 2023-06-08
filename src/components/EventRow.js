import React from "react";
import "../style/Table.css";
import { Timer } from "./Timer";
import { EventService, DateFormatter, TimeDifferenceCalculator } from "./helpers";
import { BsFillTrashFill, BsFillPenFill } from "react-icons/bs";

const EventRow = (props) => {
  console.log("render EventRow");
  const { start, end, type, id, onDelete, onEdit, loading, setLoading } = props;
  //   const date = "10-10";
  // console.log(id);

  const date = DateFormatter.formatDate(start);
  const formatedStart = DateFormatter.formatTime(start);
  const formatedEnd = (end) => {
    if (end === "running" || end === null || end === undefined) {
      return <></>;
    } else {
      return <>{DateFormatter.formatTime(end)}</>;
    }
  };

  const difference = (start, end) => {
    if (end === "running") {
      return "running";
    } else {
      return TimeDifferenceCalculator.calculateDifference(start, end);
    }
  };
  const handleEdit = (e) => {
    // console.log(e);
    //EventService.editEvent(id);
  };

  const handleDelete = (e) => {
    // console.log(e);

    EventService.deleteEvent(e).then(() => {
      onDelete(id);
    });
  };

  return (
    <>
      <tr onClick={() => handleEdit(id)}>
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
