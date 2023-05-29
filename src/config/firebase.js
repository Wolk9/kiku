// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCH6hD6EOpzgGjzHIoWGMVYApht4XDQCFg",
  authDomain: "cico-4d5b8.firebaseapp.com",
  projectId: "cico-4d5b8",
  storageBucket: "cico-4d5b8.appspot.com",
  messagingSenderId: "27761515023",
  appId: "1:27761515023:web:dac6e1b652bf96d2d6e17a",
  measurementId: "G-8DH19ZEBCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app);
