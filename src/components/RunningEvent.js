import { MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import EventRow from "./EventRow";

export const RunningEvent = (props) => {
  const { newUserEvent, user, editEvent } = props;
  return (
    <div>
      <MDBTable striped small className="table">
        <thead>
          <tr>
            <th scope="col">date</th>
            <th scope="col" className="expand">
              type
            </th>
            <th scope="col">start</th>
          </tr>
        </thead>

        <MDBTableBody>
          <tr onClick={() => editEvent()}>
            <EventRow
              id={user.id}
              isNew={true}
              start={newUserEvent.eventStart}
              end="running"
              type={newUserEvent.type}
            />
          </tr>
        </MDBTableBody>
      </MDBTable>
    </div>
  );
};
