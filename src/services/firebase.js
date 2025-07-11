import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  RecaptchaVerifier,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// ✅ reCAPTCHA (for phone auth)
const anonymousLogin = () => signInAnonymously(auth);
const setupRecaptcha = (elementId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => console.log("reCAPTCHA verified"),
  });
};

// ✅ Export
export {
  auth,
  db,
  googleProvider,
  anonymousLogin,
  setupRecaptcha,
};
