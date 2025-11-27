import { auth } from "../js/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ================= REGISTER =================
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // All info of user
    return userCredential.user;
  } catch (error) {
    return error.message;
  }
}

// ================= LOGIN =================
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCredential.user;
  } catch (error) {
    return error.message;
  }
}

// ================= LOGOUT =================
async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    return error.message;
  }
}

export { registerUser, loginUser, logoutUser };
