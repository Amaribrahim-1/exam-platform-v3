import { db } from "../firebase.js";
import { registerUser } from "../auth.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const registerForm = document.getElementById("register-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const roleInput = document.getElementById("role");
const teacherCodeInput = document.getElementById("teacher-code");

const TEACHER_CODE = "TEACHER-2025";

// ===== SHOW/HIDE TEACHER CODE =====
roleInput.addEventListener("change", () => {
  const box = document.getElementById("teacher-code-box");
  box.style.display = roleInput.value === "teacher" ? "flex" : "none";
});

// ===== REGISTER SUBMIT =====
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameValue = nameInput.value;
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;
  const roleValue = roleInput.value;
  const teacherCodeValue = teacherCodeInput.value;

  // ==== CHECK TEACHER CODE ====
  if (roleValue === "teacher" && teacherCodeValue !== TEACHER_CODE) {
    alert("Wrong teacher code!");
    return;
  }

  try {
    const user = await registerUser(emailValue, passwordValue);

    if (!user || !user.uid) {
      console.log("Register failed:", user);
      return;
    }

    // ===== BASE USER DATA =====
    const userData = {
      id: user.uid,
      name: nameValue,
      email: emailValue,
      role: roleValue,
      createdAt: serverTimestamp(),
    };

    // ===== EXTRA FIELDS ONLY FOR TEACHER =====
    if (roleValue === "teacher") {
      userData.profileCompleted = false;
      userData.subject = "";
      userData.bio = "";
      userData.experience = "";
      userData.photoURL = "";
    }

    // ==== SAVE USER IN FIRESTORE ====
    await setDoc(doc(db, "users", user.uid), userData);

    // ==== REDIRECT AFTER REGISTER ====
    if (roleValue === "teacher") {
      window.location.href = "./teacher-profile-setup.html";
    } else {
      window.location.href = "./student-home.html";
    }
  } catch (error) {
    console.log(error.message);
  }
});
