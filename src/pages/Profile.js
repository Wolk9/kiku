import {
  MDBContainer,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBCol,
  MDBRow,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { UserService } from "../components/helpers";

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

  const handleChange = (e, step) => {
    const { name, value } = e.target;
    console.log(name, value, step);
    switch (name) {
      case "hoursPerWeek":
        console.log("case hoursPerWeek");
        if (step) {
          let result = handleChangeHrsPerWk(step);

          setUserData({ ...userData, [name]: result });
        } else {
          setUserData({ ...userData, [name]: value });
        }
        break;
      default:
        setUserData({ ...userData, [name]: value });
        break;
    }
  };

  const saveUser = async () => {
    console.log("saveUser");
  };
  console.log(userData);

  const handleChangeHrsPerWk = (value) => {
    const newValue = userData.hoursPerWeek + value;
    console.log("handleChangeHrsPerWk newValue:", newValue);
    if (newValue > 36) {
      console.log("newValue is higher than 36");
      setMessage(
        "At Dasko you can't have a contract of more than 36 hours per week"
      );
      let newValue = 36;
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
            <div className="d-grid gap-2 col-8 mx-auto">
              <h6>Your login details</h6>

              <MDBInput
                size="lg"
                className="mb-4"
                type="email"
                value={userData.email}
                label="Register Email..."
                disabled
              />

              <hr className="hr" />
              <h6>Your personal details</h6>

              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                value={userData.firstName}
                label="FirstName..."
                onChange={(e) => handleChange(e)}
              />

              <MDBInput
                size="lg"
                className="mb-4"
                type="text"
                value={userData.lastName}
                label="LastName..."
                onChange={(e) => handleChange(e)}
              />

              <MDBInput
                size="lg"
                className="mb-4"
                type="date"
                value={userData.dob}
                label="Date of birth"
                onChange={(e) => handleChange(e)}
              />

              <hr className="hr" />
              <h6>Your contract details</h6>
              <MDBRow className="mb-5">
                <MDBCol>
                  <MDBInput
                    size="lg"
                    className="mb-4"
                    type="date"
                    value={userData.contractDate}
                    label="Contract date"
                    onChange={(e) => handleChange(e)}
                  />
                </MDBCol>

                <MDBCol>
                  <MDBRow className="d-flex">
                    <MDBCol className="d-flex align-items-center justify-content-end">
                      <MDBBtn
                        color="danger"
                        name="hoursPerWeek"
                        onClick={(e) => handleChange(e, -4)}
                      >
                        -
                      </MDBBtn>
                    </MDBCol>
                    <MDBCol className="d-flex align-items-center justify-content-center">
                      <MDBInput
                        size="lg"
                        className=""
                        type="number"
                        name="hoursPerWeek"
                        value={userData.hoursPerWeek}
                        label="Hours/week"
                        disabled
                      />
                    </MDBCol>
                    <MDBCol className="d-flex align-items-center justify-content-start">
                      <MDBBtn
                        color="success"
                        name="hoursPerWeek"
                        onClick={(e) => handleChange(e, +4)}
                      >
                        +
                      </MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCol>
              </MDBRow>

              <MDBBtn type="submit" onClick={saveUser} block>
                Save Changes
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
};

export default Profile;
