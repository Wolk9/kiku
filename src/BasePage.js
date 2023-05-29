import React from "react";
import LogoutButton from "./LogoutButton";
import { NavBar } from "./NavBar";

const BasePage = (props) => {
  const { admin } = props;
  return (
    <div>
      <NavBar admin={false} />
      <h1>Welcome to the Base Page</h1>
      <p>This page is accessible to all users.</p>
      <LogoutButton />
    </div>
  );
};

export default BasePage;
