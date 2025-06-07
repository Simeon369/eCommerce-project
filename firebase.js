// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLNPg8LaluETzeiAhuoEuiskVZRzVuzTU",
  authDomain: "ecommerce-ac496.firebaseapp.com",
  projectId: "ecommerce-ac496",
  storageBucket: "ecommerce-ac496.firebasestorage.app",
  messagingSenderId: "292793006920",
  appId: "1:292793006920:web:1dab52ef7de246c369117d",
  measurementId: "G-XDD26SSBXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);