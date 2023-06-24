import "../style/Table.css";
import { DateFormatter, TimeDifferenceCalculator } from "./helpers";
import { BsFillPenFill } from "react-icons/bs";

const EventRow = (props) => {
  // console.log("render EventRow");
  const { start, end, type, id, isNew, handleEdit, subtotal } = props;

  // console.log("start:", start, "end:", end);

  let date = type !== "subtotal" ? DateFormatter.formatDate(start) : "";
  let formatedStart =
    type !== "subtotal" ? DateFormatter.formatTime(start) : "";
  let formatedEnd =
    type !== "subtotal"
      ? DateFormatter.formatTime(end)
      : TimeDifferenceCalculator.formatHoursMinutes(subtotal);
  let displayType = type !== "subtotal" ? type : "";

  const getDifference = (start, end) => {
    return TimeDifferenceCalculator.calculateDifference(start, end);
  };

  let diff = type !== "subtotal" ? getDifference(start, end) : "";

  return (
    <>
      <td>{date}</td>
      <td>{displayType}</td>
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
