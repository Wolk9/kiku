import {
  collection,
  doc,
  getDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, rtdb, auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import moment from "moment";
import "moment/locale/nl";
import { set, ref, remove, get } from "firebase/database";

moment.updateLocale("nl", {
  weekdaysShort: ["zo", "ma", "di", "wo", "do", "vr", "za"],
});
class DateFormatter {
  static formatDate = (date) => {
    const offset = moment(date).utcOffset();
    if (moment.isDate(date)) {
      return moment(date).format("ddd DD-MM");
    } else if (moment(date, moment.ISO_8601, true).isValid()) {
      const isoDate = moment.utc(date);
      return isoDate.local().format("ddd DD-MM");
    } else {
      return this.formatFireStoreDate(date);
    }
  };

  static formatTime = (date) => {
    if (moment.isDate(date)) {
      return moment(date).format("HH:mm");
    } else if (moment(date, moment.ISO_8601, true).isValid()) {
      const isoTime = moment.utc(date);
      return isoTime.local().format("HH:mm");
    } else {
      return this.formatFireStoreTime(date);
    }
  };

  static formatFireStoreDate(unixTime) {
    if (unixTime === null || unixTime === undefined || unixTime === "running") {
      return "no date";
    } else {
      const { seconds, nanoseconds } = unixTime;
      const date = moment
        .unix(seconds)
        .add(nanoseconds / 1000000, "milliseconds");
      return date.format("ddd DD-MM");
    }
  }

  static formatFireStoreTime(unixTime) {
    if (unixTime === null || unixTime === "running" || unixTime === undefined) {
      return "no time";
    } else {
      const { seconds, nanoseconds } = unixTime;
      const time = moment
        .unix(seconds)
        .add(nanoseconds / 1000000, "milliseconds");
      return time.format("HH:mm");
    }
  }

  static ObjectConverter = (inputObject, userId) => {
    const { date, start, end, type } = inputObject;

    // Combine date and time strings
    const eventStart = `${date}T${start}:00.000`;
    const eventEnd = `${date}T${end}:00.000`;

    // Convert to Moment objects in local timezone
    const startMoment = moment(eventStart);
    const endMoment = moment(eventEnd);

    // Convert to UTC
    const utcStart = startMoment.utc().toISOString();
    const utcEnd = endMoment.utc().toISOString();

    // Construct the output object
    const outputObject = {
      eventStart: utcStart,
      type,
      userId,
      eventEnd: utcEnd,
    };

    return outputObject;
  };
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

  static calculateDurationInHours = (start, end) => {
    console.log("Start:", start);
    console.log("End:", end);

    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
    return durationInMinutes;
  };

  static formatHoursMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const formattedTime = `${hours
      .toString()
      .padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`;
    return formattedTime;
  };
}

class UserService {
  static async isUserAdmin(uid) {
    const usersRef = collection(db, "users");

    const userDoc = await getDoc(doc(usersRef, uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "admin") {
        return true;
      } else {
        return false;
      }
    } else {
      // console.log("User not found");
    }
  }

  static async editUserData(id, update) {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, id);

    try {
      await updateDoc(userDocRef, update);
      return true; // Return true if the update was successful
    } catch (error) {
      console.error(error);
      return false; // Return false if an error occurred during the update
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
    console.log(id, updates);
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
