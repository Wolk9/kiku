import React from "react";
import { NavBar } from "./NavBar";

const BasePage = (props) => {
  const { admin } = props;
  return (
    <div>
      <NavBar admin={admin} />
      <h1>Welcome to the Base Page</h1>
      <p>This page is accessible to all users.</p>
    </div>
  );
};

export default BasePage;
