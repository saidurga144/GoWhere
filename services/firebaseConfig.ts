// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDER5w9KKEUD8ZC9FT0st7knuaHQoSXKYI",
  authDomain: "studio-6695301123-9c419.firebaseapp.com",
  projectId: "studio-6695301123-9c419",
  storageBucket: "studio-6695301123-9c419.firebasestorage.app",
  messagingSenderId: "288062969878",
  appId: "1:288062969878:web:4168c51803c3662fd03d37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
