// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDccXeXTfHZOn5LPPZ63fjVvAwJnkWUWo",
  authDomain: "schemewatchtest.firebaseapp.com",
  projectId: "schemewatchtest",
  storageBucket: "schemewatchtest.firebasestorage.app",
  messagingSenderId: "169541157876",
  appId: "1:169541157876:web:2642120a28e2e6ee0c2fa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export Firestore functions
export { addDoc, collection, getDoc, setDoc, runTransaction };

// Export Auth functions
export { RecaptchaVerifier, signInWithPhoneNumber };

// Export default app
export default app;