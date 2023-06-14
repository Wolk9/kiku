import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthorizePage } from "./pages/LoginPage";
import BasePage from "./pages/BasePage";
import UsersPage from "./pages/UsersPage";
import { auth } from "./config/firebase";
import { NavBar } from "./components/NavBar";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Profile from "./pages/Profile";
import { PopUp } from "./components/PopUp";

const NotFoundPage = () => {
  return (
    <>
      <NavBar />
      <h1>404 Page Not Found</h1>
      {/* Include the content of your 404.html page here */}
    </>
  );
};

const App = () => {
  // console.log("render App")
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Add an observer to check for user authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  //// console.log(user.uid, user.email);

  const isAdmin = user && user.email === "martin.de.bes@me.com";
  // console.log(user);
  // console.log(isAdmin);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          default
          element={
            user ? (
              <Navigate to={isAdmin ? "/admin" : "/base"} />
            ) : (
              <>
                <NavBar logoOnly={true} />
                <PopUp message={message} setMessage={setMessage} />
                <AuthorizePage message={message} setMessage={setMessage} />
              </>
            )
          }
        />
        <Route
          path="/base"
          element={
            user ? (
              <>
                <NavBar admin={isAdmin} />
                <PopUp message={message} setMessage={setMessage} />
                <BasePage
                  user={user}
                  admin={isAdmin}
                  message={message}
                  setMessage={setMessage}
                />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <>
                <NavBar admin={isAdmin} />
                <PopUp message={message} setMessage={setMessage} />
                <BasePage
                  user={user}
                  admin={isAdmin}
                  message={message}
                  setMessage={setMessage}
                />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/users"
          element={
            <>
              <NavBar admin={isAdmin} />
              <UsersPage
                admin={isAdmin}
                message={message}
                setMessage={setMessage}
              />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <NavBar admin={isAdmin} />
              <Profile
                admin={isAdmin}
                message={message}
                setMessage={setMessage}
              />
            </>
          }
        />
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
