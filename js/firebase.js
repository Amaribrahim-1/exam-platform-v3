import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC47GO2hTJk350NlHZ2IWGl2lO94rfmkto",
  authDomain: "exam-platform-75d51.firebaseapp.com",
  projectId: "exam-platform-75d51",
  storageBucket: "exam-platform-75d51.firebasestorage.app",
  messagingSenderId: "404363187990",
  appId: "1:404363187990:web:df5204a98ef503af8ea237",
  measurementId: "G-XE993KW3NP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
