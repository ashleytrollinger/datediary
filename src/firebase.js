// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMXDNsR87liUOkelnO8yHSqHNbeoKhWts",
    authDomain: "date-diary-39320.firebaseapp.com",
    projectId: "date-diary-39320",
    storageBucket: "date-diary-39320.firebasestorage.app",
    messagingSenderId: "815636430399",
    appId: "1:815636430399:web:9e64b877c3498f1cd1028a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);