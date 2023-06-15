import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
  MDBBtn,
  MDBBtnGroup,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
  MDBIcon,
  MDBCardFooter,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { EventService, UserService } from "../components/helpers";

const Profile = (props) => {
  const { user, message, setMessage } = props;
  const [userData, setUserData] = useState({
    userId: "",
    firstName: "",
    lastName: "",
    dob: "",
    contractDate: "",
    hoursPerWeek: 0,
    role: "user",
  });

  useEffect(() => {
    const getUserData = async () => {
      if (user?.uid) {
        try {
          const result = await UserService.getUserData(user.uid);
          setUserData(result);
        } catch (err) {
          console.log(err);
          setMessage(err);
        } finally {
          console.log(userData);
        }
      }
    };
    getUserData();
  }, [user]);

  const handleChange = (e) => {
    console.log(e.target.name);
    const { name, value } = e.target;
    console.log(name, value);
    switch (name) {
      case "hoursPerWeek":
        console.log("case hoursPerWeek");
        let result = handleChangeHrsPerWk(value);
        setUserData({ ...userData, [name]: result });
        break;
      default:
        setUserData({ ...userData, [name]: value });
        break;
    }
  };

  const saveUser = async () => {
    console.log("saveUser");
    try {
      const uid = user.uid; // Assuming you have access to the user's UID
      await UserService.editUserData(uid, userData);
      setMessage("User data updated successfully");
    } catch (error) {
      setMessage("Error updating user data:", error);
    }
  };

  console.log(userData);

  const handleChangeHrsPerWk = (value) => {
    value == "minus" ? (value = -4) : (value = +4);
    console.log(value);
    const newValue = userData.hoursPerWeek + value;
    console.log("handleChangeHrsPerWk newValue:", newValue);
    if (newValue > 32) {
      console.log("newValue is higher than 36");
      setMessage(
        "At Dasko you can't have a contract of more than 36 hours per week"
      );
      let newValue = 32;
      return newValue;
    } else if (newValue < 0) {
      setMessage("You can't have a contract of less than 0 hours per week");
      let newValue = 0;
      return newValue;
    }
    return newValue;
  };

  return (
    <div>
      <MDBContainer>
        <MDBCard>
          <MDBCardBody>
            <MDBCardTitle>Your Profile Details</MDBCardTitle>
            <div className="d-grid gap-2 col-8 col-sm-12 mx-auto">
              <h6>Your login details</h6>
              Your login email address is: <h5>{user?.email}</h5>
              <hr className="hr" />
              <h6>Your personal details</h6>
              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                name="firstName"
                value={userData.firstName}
                label="FirstName..."
                onChange={(e) => handleChange(e)}
              />
              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                name="lastName"
                value={userData.lastName}
                label="LastName..."
                onChange={(e) => handleChange(e)}
              />
              <MDBInput
                size="lg"
                className="mb-4"
                type="date"
                name="dob"
                value={userData.dob}
                label="Date of birth"
                onChange={(e) => handleChange(e)}
              />
              <hr className="hr" />
              <h6>Your contract details</h6>
              <div className="mb-5 d-flex justify-content-evenly">
                <div className="d-flex">
                  <MDBInput
                    size="lg"
                    className=""
                    type="date"
                    name="contractData"
                    value={userData.contractDate}
                    label="Contract date"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="d-flex py-2">
                  <div className="d-flex justify-content-center">
                    <MDBBtn
                      color="danger"
                      name="hoursPerWeek"
                      value="minus"
                      onClick={(e) => handleChange(e)}
                    >
                      -
                    </MDBBtn>
                    <div className="mx-6 px-3 py-3">
                      {userData.hoursPerWeek} hrs/wk
                    </div>
                    <MDBBtn
                      color="success"
                      name="hoursPerWeek"
                      value="plus"
                      onClick={(e) => handleChange(e)}
                    >
                      +
                    </MDBBtn>
                  </div>
                </div>
              </div>
            </div>
          </MDBCardBody>
          <MDBCardFooter className="text-end">
            <MDBBtn type="submit" onClick={saveUser}>
              Save Changes
            </MDBBtn>
          </MDBCardFooter>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Profile;
