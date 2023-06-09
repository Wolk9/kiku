import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, rtdb, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import moment from "moment";
import "moment/locale/nl";
import { set, ref, remove, child, get } from "firebase/database";

class DateFormatter {
  static formatDate = (date) => {
    // console.log("formatDate:", date);
    const isJavaScriptDate = (date) => {
      return date instanceof Date;
    };
    const isISO8601 = (value) => {
      // Regex pattern to match ISO 8601 format
      const iso8601Pattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([+-]\d{2}:\d{2}|Z)$/;
      return iso8601Pattern.test(value);
    };

    if (isJavaScriptDate(date) === true) {
      // console.log("JavaScriptDate");
      const options = { weekday: "short", day: "2-digit", month: "2-digit" };
      return date.toLocaleDateString("nl-NL", options);
    } else if (isISO8601(date) === true) {
      // console.log("ISO date", date);
      const isoDate = new Date(date);
      const options = { weekday: "short", day: "2-digit", month: "2-digit" };
      return isoDate.toLocaleDateString("nl-NL", options);
    } else {
      // console.log("not a JavaScriptDate");
      return this.formatFireStoreDate(date);
    }
  };

  static formatTime = (date) => {
    // console.log("formatTime:", date);
    const isJavaScriptDate = (date) => {
      return date instanceof Date;
    };
    const isISO8601 = (value) => {
      // Regex pattern to match ISO 8601 format
      const iso8601Pattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([+-]\d{2}:\d{2}|Z)$/;
      return iso8601Pattern.test(value);
    };

    if (isJavaScriptDate(date) === true) {
      // console.log("JavaScriptDate");
      const options = { hour: "2-digit", minute: "2-digit" };
      return date.toLocaleTimeString("nl-NL", options);
    } else if (isISO8601(date) === true) {
      // console.log("ISO time", date);
      const isoTime = new Date(date);
      const options = { hour: "2-digit", minute: "2-digit" };
      return isoTime.toLocaleTimeString("nl-NL", options);
    } else {
      // console.log("not a JavaScriptDate");
      return this.formatFireStoreTime(date);
    }
  };

  static formatFireStoreDate(unixTime) {
    // console.log("helper:", unixTime.seconds, unixTime.nanoseconds);
    if (unixTime === null || unixTime === undefined || unixTime === "running") {
      return "no date";
    } else {
      const { seconds, nanoseconds } = unixTime;
      const Date = moment
        .unix(seconds)
        .add(nanoseconds / 1000000, "milliseconds");
      return Date.format("ddd DD-MM");
    }
  }

  static formatFireStoreTime(unixTime) {
    if (unixTime === null || unixTime === "running" || unixTime === undefined) {
      return "no time";
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
    const isJavaScriptDate = (date) => {
      return date instanceof Date;
    };

    const isISO8601 = (date) => {
      const iso8601Pattern =
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?([+-]\d{2}:\d{2}|Z)$/;
      return iso8601Pattern.test(date);
    };

    const isUnixTime = (date) => {
      return !isNaN(date) && isFinite(date);
    };

    const convertToJavaScriptDate = (date) => {
      if (isISO8601(date)) {
        return new Date(date);
      }
      if (isUnixTime(date)) {
        return new Date(date * 1000);
      }
      return date;
    };

    let time1 = convertToJavaScriptDate(startUnixTime);
    let time2 = convertToJavaScriptDate(endUnixTime);

    if (!isJavaScriptDate(time1)) {
      time1 = new Date(time1);
    }

    if (!isJavaScriptDate(time2)) {
      time2 = new Date(time2);
    }

    const difference = time2.getTime() - time1.getTime();
    const difInMinutes = Math.floor(difference / 1000 / 60);

    return moment.utc(difInMinutes * 60000).format("HH:mm");
  }
}

class UserService {
  static async checkUserRole(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        // console.log("User has admin role");
      } else {
        // console.log("User does not have admin role");
      }
      return userData;
    } else {
      // console.log("User not found");
    }
  }

  static async getUserData(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    const userData = userDoc.data();
    return userData;
  }

  static async signOutUser() {
    // console.log("signOutUser");
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

    return new Promise((resolve, reject) => {
      onSnapshot(
        q,
        (snapshot) => {
          const col = [];
          snapshot.docs.forEach((doc) => {
            col.push({ ...doc.data(), id: doc.id });
          });
          // console.log("eventservice getuserevents:", col);
          resolve(col); // Resolve the promise with the collected events
        },
        reject
      ); // Reject the promise if an error occurs
    });
  }

  static async getOpenEventDocId(uid) {
    const userEvents = await this.getUserEvents(uid);
    // console.log(userEvents);
    let sortedEvents = [];
    if (userEvents?.length > 1) {
      // console.log("userEvents is longer that 1");
      sortedEvents = userEvents.sort((a, b) =>
        a.timestamp < b.timestamp ? 1 : -1
      );
      const openEvents = sortedEvents.filter(
        (event) => event.userId === uid && event.endTime === "running"
      );

      if (openEvents.length > 0) {
        // console.log("openEvents > 0");
        const lastOpenEvent = openEvents[openEvents.length - 1];
        return lastOpenEvent.id;
      } else {
        // console.log("openEents = 0");
        return null;
      }
    } else {
      // console.log("userEvents = 1");
      return userEvents;
    }
  }

  static async getEvent(id) {
    console.log("getEvent: ", id);
    const eventRef = doc(collection(db, "events"), id);
    try {
      const eventDoc = await getDoc(eventRef);
      const eventData = eventDoc.data();
      console.log("getEvent: ", eventData);
      return eventData;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteEvent(id) {
    const eventRef = doc(collection(db, "events"), id);
    await deleteDoc(eventRef);
  }

  static async editEvent(id, updates) {
    const eventRef = doc(collection(db, "events"), id);
    await updateDoc(eventRef, updates);
  }

  static async setEventEndTime(eventId, newEndTime) {
    const eventRef = doc(collection(db, "events"), eventId);

    await updateDoc(eventRef, {
      endTime: newEndTime,
    });
  }

  static async addEvent(newEvent) {
    // console.log("addEvent:", newEvent);
    const eventRef = collection(db, "events");
    await addDoc(eventRef, newEvent);
  }
}

class RealTimeService {
  static async writeRunningEvent(userId, data) {
    set(ref(rtdb, `/${userId}`), { data: data });
  }

  static async readRunningEvent(userId) {
    const snapshot = await get(ref(rtdb, `/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val().data;
    } else {
      return undefined; // or any other default value you prefer
    }
  }

  static async deleteRunningEvent(userId) {
    remove(ref(rtdb, `/${userId}`));
  }
}

export {
  UserService,
  TimeDifferenceCalculator,
  DateFormatter,
  EventService,
  RealTimeService,
};
