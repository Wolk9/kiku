import React from "react";
import { auth } from "./config/firebase"

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Handle any additional logout logic or redirects here
    } catch (error) {
      // Handle error
      console.log("Error occurred while logging out:", error);
    }
  };

  return <button >Logout</button>;
};

export default LogoutButton;
