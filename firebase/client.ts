// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp3ntaupeTkiva20Obs62Ai-4jMPrnc0U",
  authDomain: "interviewprep-efcf7.firebaseapp.com",
  projectId: "interviewprep-efcf7",
  storageBucket: "interviewprep-efcf7.firebasestorage.app",
  messagingSenderId: "200404361452",
  appId: "1:200404361452:web:3449fd3c9fe2b2a90205c9",
  measurementId: "G-3LR22Y1X41",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
