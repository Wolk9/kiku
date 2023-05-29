import React from "react";
import { NavBar } from "../components/NavBar";

const UsersPage = (props) => {
  const { admin } = props;
  return (
    <>
      <NavBar admin={admin} />
      userpage
    </>
  );
};

export default UsersPage;
