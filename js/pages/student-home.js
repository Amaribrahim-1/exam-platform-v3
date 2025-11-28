// import { db } from "../firebase.js";
// import { collection, query, where, getDocs } from "firebase/firestore";

// const teachersContainer = document.querySelector(".teachers");

// async function loadTeachers() {
//   const q = query(
//     collection(db, "users"),
//     where("role", "==", "teacher"),
//     where("profileCompleted", "==", true)
//   );

//   const snapshot = await getDocs(q);

//   if (snapshot.empty) {
//     teachersContainer.textContent = "No teachers available right now.";
//     return;
//   }

//   teachersContainer.innerHTML = "";

//   snapshot.forEach((docSnap) => {
//     const t = docSnap.data();
//     const teacherId = docSnap.id; // ⭐ أهم سطر

//     // ==========  CARD  ==========
//     const card = document.createElement("div");
//     card.className = "teacher-card";
//     card.dataset.id = teacherId; // ⭐ نخزن ID جوه الكارت

//     // HEADER
//     const header = document.createElement("div");
//     header.className = "teacher-header";

//     const img = document.createElement("img");
//     img.src = t.photoURL || "../../assets/img/no-profile-photo.webp";
//     img.alt = t.name;

//     const headText = document.createElement("div");

//     const nameEl = document.createElement("h3");
//     nameEl.textContent = t.name;

//     const subjectEl = document.createElement("span");
//     subjectEl.className = "subject";
//     subjectEl.textContent = t.subject;

//     headText.appendChild(nameEl);
//     headText.appendChild(subjectEl);

//     header.appendChild(img);
//     header.appendChild(headText);

//     // INFO
//     const info = document.createElement("div");
//     info.className = "teacher-info";

//     const stats = document.createElement("p");
//     stats.className = "rating";
//     stats.textContent = `Experience: ${t.experience || 0} yrs • Exams: ${
//       t.examsCount || 0
//     }`;

//     const desc = document.createElement("p");
//     desc.className = "desc";
//     desc.textContent = t.bio;

//     info.appendChild(stats);
//     info.appendChild(desc);

//     // BUTTON
//     const btn = document.createElement("button");
//     btn.className = "btn-view";
//     btn.textContent = "View Exams";

//     btn.addEventListener("click", () => {
//       window.location.href = `./student-teacher-exams.html?teacherId=${teacherId}`;
//     });

//     // BUILD CARD
//     card.appendChild(header);
//     card.appendChild(info);
//     card.appendChild(btn);

//     teachersContainer.appendChild(card);
//   });
// }

// loadTeachers();

import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

const teachersContainer = document.querySelector(".teachers");

async function loadTeachers() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "teacher"),
    where("profileCompleted", "==", true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    teachersContainer.textContent = "No teachers available right now.";
    return;
  }

  teachersContainer.innerHTML = "";

  // مهم نستعمل for … of عشان await
  for (const docSnap of snapshot.docs) {
    const teacherId = docSnap.id;

    // نحمل بيانات المدرس الحقيقية من collection teachers
    const teacherRef = doc(db, "teachers", teacherId);
    const teacherSnap = await getDoc(teacherRef);

    if (!teacherSnap.exists()) continue;

    const t = teacherSnap.data();

    // ====== BUILD CARD ======
    const card = document.createElement("div");
    card.className = "teacher-card";

    // HEADER
    const header = document.createElement("div");
    header.className = "teacher-header";

    const img = document.createElement("img");
    img.src = t.photoURL || "../../assets/img/no-profile-photo.webp";
    img.alt = t.name || "Teacher";

    const headText = document.createElement("div");

    const nameEl = document.createElement("h3");
    nameEl.textContent = t.name || "Unnamed Teacher";

    const subjectEl = document.createElement("span");
    subjectEl.className = "subject";
    subjectEl.textContent = t.subject || "Unknown Subject";

    headText.appendChild(nameEl);
    headText.appendChild(subjectEl);

    header.appendChild(img);
    header.appendChild(headText);

    // INFO
    const info = document.createElement("div");
    info.className = "teacher-info";

    async function getTeacherExamsCount(teacherId) {
      const q = query(
        collection(db, "exams"),
        where("teacherId", "==", teacherId)
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    }

    const stats = document.createElement("p");
    stats.className = "rating";
    getTeacherExamsCount(teacherId).then((count) => {
      stats.textContent = `Experience: ${
        t.experience || 0
      } yrs • Exams: ${count}`;
    });

    const desc = document.createElement("p");
    desc.className = "desc";
    desc.textContent = t.bio || "No bio available.";

    info.appendChild(stats);
    info.appendChild(desc);

    // BUTTON
    const btn = document.createElement("button");
    btn.className = "btn-view";
    btn.textContent = "View Exams";

    btn.addEventListener("click", () => {
      window.location.href = `./student-teacher-exams.html?teacherId=${teacherId}`;
    });

    // BUILD CARD
    card.appendChild(header);
    card.appendChild(info);
    card.appendChild(btn);

    teachersContainer.appendChild(card);
  }
}

loadTeachers();
