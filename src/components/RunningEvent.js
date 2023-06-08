import { MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import React from "react";
import EventRow from "./EventRow";

export const RunningEvent = (props) => {
  const { user, newUserEvent } = props;
  return (
    <div>
      <MDBTable striped small className="table">
        <thead>
          <tr>
            <th scope="col">date</th>
            <th scope="col">type</th>
            <th scope="col">start</th>
            <th scope="col"></th>

            <th scope="col" className="expand">
              lopende tijd
            </th>
            <th scope="col"></th>
          </tr>
        </thead>

        <MDBTableBody>
          <tr>
            <EventRow
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
