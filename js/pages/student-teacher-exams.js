import { db } from "../firebase.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const teacherHeader = document.getElementById("teacherHeader");
const examsList = document.getElementById("examsList");

// ===== Read correct param =====
const params = new URLSearchParams(window.location.search);
const teacherId = params.get("teacherId");

if (!teacherId) {
  examsList.innerHTML = `<p class="empty-msg">Invalid teacher ID</p>`;
}

// ===========================================
//       LOAD TEACHER DATA  (from teachers/)
// ===========================================
async function loadTeacher() {
  const ref = doc(db, "teachers", teacherId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    teacherHeader.innerHTML = `<p class="empty-msg">Teacher not found</p>`;
    return;
  }

  const t = snap.data();

  teacherHeader.innerHTML = `
        <img src="${t.photoURL || "../../assets/img/teacher-avatar.png"}" />

        <div class="teacher-header-info">
            <h2>${t.name || "Teacher"}</h2>
            <p>${t.subject || "No subject"} • ${
    t.experience || 0
  } yrs experience ⭐</p>
            <p>${t.bio || ""}</p>
        </div>
    `;
}

// ===========================================
//       LOAD EXAMS FOR THIS TEACHER
// ===========================================
async function loadExams() {
  const examsRef = collection(db, "exams");
  const q = query(examsRef, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    examsList.innerHTML = `<p class="empty-msg">No exams available</p>`;
    return;
  }

  examsList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const exam = docSnap.data();

    const card = document.createElement("div");
    card.className = "exam-card";

    card.innerHTML = `
    <img class="exam-img" src="../../assets/img/exam-img.jpg" />

    <div class="exam-body">

        <div class="exam-header-row">
            <h3 class="exam-title">${exam.title}</h3>
            <span class="badge diff-${exam.difficulty.toLowerCase()}">
                ${exam.difficulty}
            </span>
        </div>

        <p class="exam-subject">${exam.subject}</p>

        <p class="exam-desc">
            ${exam.description || "No description provided."}
        </p>

        <div class="exam-meta">
            <span>⏱ ${exam.duration} min</span>
            <span>❓ ${exam.questionsCount} questions</span>
        </div>

        <button class="btn-start"
            onclick="window.location.href='./exam-start.html?eid=${
              docSnap.id
            }'">
            Start Exam
        </button>
    </div>
`;

    examsList.appendChild(card);
  });
}

loadTeacher();
loadExams();
