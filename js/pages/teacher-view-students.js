import { auth, db } from "../firebase.js";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// ===== URL PARAMS =====
const params = new URLSearchParams(window.location.search);
// const examId = params.get("examId");
const examId = params.get("eid");

if (!examId) {
  alert("Invalid exam ID");
  window.location.href = "./teacher-home.html";
}

// ====== ELEMENTS ======
const examTitleEl = document.getElementById("examTitle");
const examSubjectEl = document.getElementById("examSubject");
const examMarksEl = document.getElementById("examMarks");
const examQuestionsEl = document.getElementById("examQuestions");
const examAttemptsEl = document.getElementById("examAttempts");

const studentsTable = document.getElementById("studentsTable");

// ====== AUTH FIX ======
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    console.log("Auth not ready… waiting");
    return;
  }

  // Firestore ready → نبدأ الصفحة
  initPage();
});

async function initPage() {
  await loadExamInfo();
  await loadStudents();
}

// ===== Load Exam Info =====
async function loadExamInfo() {
  const ref = doc(db, "exams", examId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const e = snap.data();

  examTitleEl.textContent = e.title;
  examSubjectEl.textContent = e.subject || "—";
  examMarksEl.textContent = e.totalMarks || e.questionsCount || "—";
  examQuestionsEl.textContent = e.questionsCount || 0;
  examAttemptsEl.textContent = e.attempts || 0;
}

// ===== Load Students Attempts =====
async function loadStudents() {
  const q = query(collection(db, "examResults"), where("examId", "==", examId));
  const snap = await getDocs(q);

  if (snap.empty) {
    studentsTable.innerHTML += `<div class="empty-msg">No students have submitted this exam yet.</div>`;
    return;
  }

  for (const docSnap of snap.docs) {
    const attempt = docSnap.data();
    addStudentRow(attempt);
  }
}

async function addStudentRow(attempt) {
  const row = document.createElement("div");
  row.className = "table-row";

  const userSnap = await getDoc(doc(db, "users", attempt.studentId));
  const user = userSnap.exists()
    ? userSnap.data()
    : { name: "Unknown", email: "—" };

  const date = attempt.submittedAt?.toDate
    ? attempt.submittedAt.toDate().toLocaleString()
    : "—";

  row.innerHTML = `
    <span>${user.name}</span>
    <span>${user.email}</span>
    <span>${attempt.score}</span>
    <span>${attempt.percentage}%</span>
    <span>${date}</span>
  `;

  studentsTable.append(row);
}
