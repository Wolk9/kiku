import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import moment from "moment";
import "moment/locale/nl";

class DateFormatter {
  static formatDate(unixTime) {
    if (unixTime === undefined) {
      return "no date";
    } else {
      const { seconds, nanoseconds } = unixTime;
      const Date = moment
        .unix(seconds)
        .add(nanoseconds / 1000000, "milliseconds");
      return Date.format("ddd DD-MM");
    }
  }

  static formatTime(unixTime) {
    if (unixTime === undefined) {
      return;
    } else {
      const { seconds, nanoseconds } = unixTime;
      const Date = moment
        .unix(seconds)
        .add(nanoseconds / 1000000, "milliseconds");
      return Date.format("HH:mm");
    }
  }
}

class TimeDifferenceCalculator {
  static calculateDifference(startUnixTime, endUnixTime) {
    if (startUnixTime === undefined || endUnixTime === undefined) {
      console.log(
        "helper do nothing",
        "start",
        startUnixTime,
        "end",
        endUnixTime
      );
      return;
    } else {
      console.log(
        "Helper calculate ",
        "start",
        startUnixTime,
        "end",
        endUnixTime
      );

      const time1 = new Date(startUnixTime * 1000);
      const time2 = new Date(endUnixTime * 1000);

      const difference = time2.getTime() - time1.getTime();

      console.log("difference", difference);

      const difInMinutes = Math.floor(difference / 1000 / 60);

      return moment.utc(difInMinutes * 60000).format("HH:mm");
    }
  }
}

class UserService {
  static async checkUserRole(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        console.log("User has admin role");
      } else {
        console.log("User does not have admin role");
      }
      return userData;
    } else {
      console.log("User not found");
    }
  }

  static async getUserData(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    const userData = userDoc.data();
    return userData;
  }

  static async signOutUser() {
    console.log("signOutUser");
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  }
}

class EventService {
  
  static async getUserEvents(uid) {
    const q = query(collection(db, "events"), where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }

  static async getEvent(id) {
    console.log(id);
    const eventRef = collection(db, "events");
    const eventDoc = await getDoc(doc(eventRef, id));
    const eventData = eventDoc.data();
    return eventData;
  }

  static async deleteEvent(id) {
    const eventRef = collection(db, "events");
    await deleteDoc(doc(eventRef, id));
  }

  static async editEvent(id, updates) {
    const eventRef = collection(db, "events");
    await updateDoc(eventRef, { ...doc.data(), updates });
  }

  static async addEvent() {
   

  }
}


export { UserService, TimeDifferenceCalculator, DateFormatter, EventService };
