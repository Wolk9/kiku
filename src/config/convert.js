import { auth, googleProvider, db, rtdb, storage, batch } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

// Function to convert a date to ISO 8601 format

const convertToISO8601 = (date) => {
  if (date instanceof Date) {
    return date.toISOString();
  } else if (typeof date === "number") {
    return new Date(date * 1000).toISOString();
  } else if (date && date.seconds && date.nanoseconds) {
    const seconds = date.seconds;
    const milliseconds = date.nanoseconds / 1000000;
    const timestamp = seconds * 1000 + milliseconds;
    return new Date(timestamp).toISOString();
  } else if (typeof date === "string") {
    return new Date(date).toISOString();
  }
  return null;
};

// Function to update documents with converted ISO 8601 format
export const updateDocumentsWithISO8601 = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      const eventStart = data.eventStart;
      const eventEnd = data.eventEnd;

      // Convert eventStart and eventEnd to ISO 8601 format
      const convertedStart = convertToISO8601(eventStart);
      const convertedEnd = convertToISO8601(eventEnd);
      console.log("Converted", data.eventStart, "to", convertedStart);
      console.log("Converted", data.eventEnd, "to", convertedEnd);

      // Update the document with the converted values
      await updateDoc(doc.ref, {
        eventStart: convertedStart,
        eventEnd: convertedEnd,
      });
    });

    console.log("Documents updated successfully.");
  } catch (error) {
    console.error("Error updating documents:", error);
  }
};
// Call the function to update documents with ISO 8601 format
