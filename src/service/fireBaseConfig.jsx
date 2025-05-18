// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_u1G4bK2jB9EVCaw01wQ1A7cUODH1NSw",
  authDomain: "ai-trip-planner-49ef2.firebaseapp.com",
  projectId: "ai-trip-planner-49ef2",
  storageBucket: "ai-trip-planner-49ef2.firebasestorage.app",
  messagingSenderId: "68137209298",
  appId: "1:68137209298:web:a19059279d96a94dd08c0b",
  measurementId: "G-X99TWVF9QR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);