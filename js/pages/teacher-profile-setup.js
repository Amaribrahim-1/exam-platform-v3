import { auth, db } from "../firebase.js";
import { doc, updateDoc } from "firebase/firestore";

const subjectInput = document.getElementById("subject");
const bioInput = document.getElementById("bio");
const experienceInput = document.getElementById("experience");
const saveBtn = document.getElementById("save-profile");

saveBtn.addEventListener("click", async () => {
  const subject = subjectInput.value.trim();
  const bio = bioInput.value.trim();
  const experience = experienceInput.value.trim();

  // Simple validation
  if (!subject || !bio) {
    alert("Please fill at least the subject and bio.");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    subject,
    bio,
    experience,
    profileCompleted: true,
  });

  window.location.href = "./teacher-home.html";
});
