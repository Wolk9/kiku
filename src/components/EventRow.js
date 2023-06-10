import React from "react";
import "../style/Table.css";
import { Timer } from "./Timer";
import { EventService, DateFormatter, TimeDifferenceCalculator } from "./helpers";
import { BsFillTrashFill, BsFillPenFill } from "react-icons/bs";

const EventRow = (props) => {
  // console.log("render EventRow");
  const {
    start,
    end,
    type,
    id,
    loading,
    setLoading,
    isNew,
    handleEdit,
    handleDelete,
  } = props;

  console.log("start:", start, "end:", end);

  const date = DateFormatter.formatDate(start);
  const formatedStart = DateFormatter.formatTime(start);
  const formatedEnd = DateFormatter.formatTime(end);

  const getDifference = (start, end) => {
    return TimeDifferenceCalculator.calculateDifference(start, end);
  };

  const diff = getDifference(start, end);

 



  return (
    <>
      <td>{date}</td>
      <td>{type}</td>
      <td>{formatedStart}</td>
      {isNew === false ? (
        <>
          <td>{formatedEnd}</td>
          <td>{diff}</td>
        </>
      ) : (
        <></>
      )}
      {!isNew && (
        <td>
          <span className="actions">
            <BsFillPenFill
              className="edit-btn"
              onClick={() => handleEdit(id)}
            />
          </span>
        </td>
      )}
    </>
  );
};

export default EventRow;
