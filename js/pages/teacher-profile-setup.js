// import { auth, db } from "../firebase.js";
// import { doc, setDoc } from "firebase/firestore";

// const subjectInput = document.getElementById("subject");
// const bioInput = document.getElementById("bio");
// const experienceInput = document.getElementById("experience");
// const saveBtn = document.getElementById("save-profile");

// saveBtn.addEventListener("click", async () => {
//   const subject = subjectInput.value.trim();
//   const bio = bioInput.value.trim();
//   const experience = Number(experienceInput.value.trim());

//   if (!subject || !bio) {
//     alert("Please fill at least the subject and bio.");
//     return;
//   }

//   const user = auth.currentUser;
//   if (!user) {
//     alert("User not logged in.");
//     return;
//   }

//   const teacherRef = doc(db, "teachers", user.uid);

//   await setDoc(teacherRef, {
//     uid: user.uid,
//     name: user.displayName || "", // optional
//     email: user.email,
//     subject,
//     bio,
//     experience,
//     totalExams: 0,
//     totalAttempts: 0,
//     studentsCount: 0,
//     profileCompleted: true,
//     createdAt: new Date(),
//   });

//   window.location.href = "./teacher-home.html";
// });

import { auth, db } from "../firebase.js";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const subjectInput = document.getElementById("subject");
const bioInput = document.getElementById("bio");
const experienceInput = document.getElementById("experience");
const saveBtn = document.getElementById("save-profile");

saveBtn.addEventListener("click", async () => {
  const subject = subjectInput.value.trim();
  const bio = bioInput.value.trim();
  const experience = Number(experienceInput.value.trim());

  if (!subject || !bio) {
    alert("Please fill at least the subject and bio.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const uid = user.uid;

  // هات البيانات من users
  const userDoc = await getDoc(doc(db, "users", uid));
  const nameValue = userDoc.data().name;

  // =============================
  // 1) update users/uid
  // =============================
  await updateDoc(doc(db, "users", uid), {
    subject,
    bio,
    experience,
    profileCompleted: true,
  });

  // =============================
  // 2) create/update teachers/uid
  // =============================
  await setDoc(
    doc(db, "teachers", uid),
    {
      uid,
      name: nameValue,
      email: user.email,
      subject,
      bio,
      experience,
      photoURL: "",
      examsCount: 0,
      totalExams: 0,
      totalAttempts: 0,
      studentsCount: 0,
      profileCompleted: true,
      createdAt: new Date(),
    },
    { merge: true }
  );

  // redirect
  window.location.href = "./teacher-home.html";
});
