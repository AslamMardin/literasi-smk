import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyASjF0ISTOm-m0pb1QXInk44z3KeT8NH_U",
  authDomain: "literasi-mandar.firebaseapp.com",
  databaseURL: "https://literasi-mandar-default-rtdb.firebaseio.com",
  projectId: "literasi-mandar",
  storageBucket: "literasi-mandar.firebasestorage.app",
  messagingSenderId: "692213846416",
  appId: "1:692213846416:web:67650f1b3b0bb08a2d2315"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
