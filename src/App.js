import { useEffect, useState } from "react";
import backgroundImage from "./img/IMG_5775.jpg";
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
import { UserService } from "./components/helpers";

const NotFoundPage = (props) => {
  const { setUser, setMessage } = props;
  return (
    <>
      <NavBar setMessage={setMessage} setUser={setUser} />
      <h1>404 Page Not Found</h1>
      {/* Include the content of your 404.html page here */}
    </>
  );
};

const App = () => {
  // console.log("render App")
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Add an observer to check for user authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the observer on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const isUserAdmin = async () => {
        try {
          const result = await UserService.isUserAdmin(user.uid);
          setIsAdmin(result);
        } catch (err) {
          setMessage(err.message);
        }
      };
      isUserAdmin();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  console.log(user, isAdmin);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        height:1024,
      }}
    >
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
                  <NavBar
                    setMessage={setMessage}
                    setUser={setUser}
                    logoOnly={true}
                  />
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
                  <NavBar
                    setMessage={setMessage}
                    setUser={setUser}
                    admin={isAdmin}
                  />
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
                  <NavBar
                    setMessage={setMessage}
                    setUser={setUser}
                    admin={isAdmin}
                  />
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
                <NavBar
                  setMessage={setMessage}
                  setUser={setUser}
                  admin={isAdmin}
                />
                <PopUp message={message} setMessage={setMessage} />
                <UsersPage
                  user={user}
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
                <NavBar
                  setMessage={setMessage}
                  setUser={setUser}
                  admin={isAdmin}
                />
                <PopUp message={message} setMessage={setMessage} />
                <Profile
                  user={user}
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
    </div>
  );
};

export default App;
