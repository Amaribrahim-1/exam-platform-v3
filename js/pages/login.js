import { db } from "../firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { loginUser } from "../auth.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorText = document.getElementById("error-text");

// ================= LOGIN =================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  if (!emailValue || !passwordValue) {
    errorText.textContent = "Please fill all fields";
    return;
  }

  try {
    // ---- Firebase Auth ----
    const user = await loginUser(emailValue, passwordValue);

    if (!user || !user.uid) {
      errorText.textContent = "Invalid email or password";
      return;
    }

    // ---- Get user role from Firestore ----
    const ref = doc(db, "users", user.uid);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      errorText.textContent = "Account data not found";
      return;
    }

    const data = snapshot.data();

    // ===== Redirect based on role =====
    if (data.role === "teacher") {
      window.location.href = "./teacher-home.html";
    } else {
      window.location.href = "./student-home.html";
    }
  } catch (error) {
    errorText.textContent = error.message;
  }
});
