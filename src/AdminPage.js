import React from "react";

import { NavBar } from "./NavBar";

const AdminPage = (props) => {
  const { admin } = props;
  console.log("Adminpage admin:", admin);
  return (
    <div>
      <NavBar admin={admin} />
      <h1>Welcome to the Admin Page</h1>
      <p>This page is only accessible to administrators.</p>
    </div>
  );
};

export default AdminPage;
