// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-7f6ae.firebaseapp.com",
    projectId: "mern-blog-7f6ae",
    storageBucket: "mern-blog-7f6ae.firebasestorage.app",
    messagingSenderId: "900257682513",
    appId: "1:900257682513:web:e3e1ca32a6e3e1b4105470",
    measurementId: "G-J0E447ZQST"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);