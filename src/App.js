import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BasePage from "./pages/BasePage";
import AdminPage from "./pages/AdminPage";
import UsersPage from "./pages/UsersPage";
import { auth } from "./config/firebase";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Add an observer to check for user authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  const isAdmin = user && user.email === "martin.de.bes@me.cm";

  console.log(isAdmin);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={isAdmin ? "/admin" : "/base"} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/base"
          element={user ? <BasePage admin={isAdmin} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            isAdmin ? <AdminPage admin={isAdmin} /> : <Navigate to="/" />
          }
        />
        <Route path="/users" element={<UsersPage admin={isAdmin} />} />
      </Routes>
    </Router>
  );
};

export default App;
