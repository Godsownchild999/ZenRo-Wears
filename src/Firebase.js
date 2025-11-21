// Firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKhxn4it0OJ0ufUrKnnTrPmKAhwAd9wSs",
  authDomain: "zenro-wears.firebaseapp.com",
  projectId: "zenro-wears",
  storageBucket: "zenro-wears.appspot.com",
  messagingSenderId: "568558456468",
  appId: "1:568558456468:web:af1944fc1c9163fae7ee81",
  measurementId: "G-0Q4WL163J7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set auth persistence:", error);
});

export const db = getFirestore(app);