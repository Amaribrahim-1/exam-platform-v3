// import { db } from "../firebase.js";
// import { registerUser } from "../auth.js";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// const registerForm = document.getElementById("register-form");
// const nameInput = document.getElementById("name");
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");
// const roleInput = document.getElementById("role");
// const teacherCodeInput = document.getElementById("teacher-code");

// const TEACHER_CODE = "TEACHER-2025";

// // ===== SHOW/HIDE TEACHER CODE =====
// roleInput.addEventListener("change", () => {
//   const box = document.getElementById("teacher-code-box");
//   box.style.display = roleInput.value === "teacher" ? "flex" : "none";
// });

// // ===== REGISTER SUBMIT =====
// registerForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const nameValue = nameInput.value;
//   const emailValue = emailInput.value;
//   const passwordValue = passwordInput.value;
//   const roleValue = roleInput.value;
//   const teacherCodeValue = teacherCodeInput.value;

//   // ==== CHECK TEACHER CODE ====
//   if (roleValue === "teacher" && teacherCodeValue !== TEACHER_CODE) {
//     alert("Wrong teacher code!");
//     return;
//   }

//   try {
//     const user = await registerUser(emailValue, passwordValue);

//     if (!user || !user.uid) {
//       console.log("Register failed:", user);
//       return;
//     }

//     // ===== BASE USER DATA =====
//     const userData = {
//       id: user.uid,
//       name: nameValue,
//       email: emailValue,
//       role: roleValue,
//       createdAt: serverTimestamp(),
//     };

//     // ===== EXTRA FIELDS ONLY FOR TEACHER =====
//     if (roleValue === "teacher") {
//       userData.profileCompleted = false;
//       userData.subject = "";
//       userData.bio = "";
//       userData.experience = "";
//       userData.photoURL = "";
//     }

//     // ==== SAVE USER IN FIRESTORE ====
//     await setDoc(doc(db, "users", user.uid), userData);

//     // ==== REDIRECT AFTER REGISTER ====
//     if (roleValue === "teacher") {
//       window.location.href = "./teacher-profile-setup.html";
//     } else {
//       window.location.href = "./student-home.html";
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });

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

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value;
  const roleValue = roleInput.value;
  const teacherCodeValue = teacherCodeInput.value.trim();

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

    // ===== TEACHER INITIAL EXTRA FIELDS =====
    if (roleValue === "teacher") {
      userData.profileCompleted = false;
      userData.subject = "";
      userData.bio = "";
      userData.experience = "";
      userData.photoURL = "";
    }

    // ==== SAVE USER IN "users" ====
    await setDoc(doc(db, "users", user.uid), userData);

    // ========= ADD COPY TO "teachers" =========
    if (roleValue === "teacher") {
      await setDoc(
        doc(db, "teachers", user.uid),
        {
          uid: user.uid,
          name: nameValue,
          email: emailValue,
          subject: "",
          bio: "",
          experience: 0,
          profileCompleted: false,

          // DEFAULT STATS
          totalExams: 0,
          examsCount: 0,
          studentsCount: 0,
          totalAttempts: 0,

          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

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
