// import { auth, db } from "../firebase.js";
// import { onAuthStateChanged } from "firebase/auth";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";

// const examsTable = document.getElementById("examsTable");
// const btnNewExam = document.getElementById("btnNewExam");

// const statTotalExams = document.getElementById("stat-total-exams");
// const statActiveStudents = document.getElementById("stat-active-students");
// const statUpcoming = document.getElementById("stat-upcoming");
// const statAttempts = document.getElementById("stat-attempts");

// // Redirect
// btnNewExam.onclick = () => (window.location.href = "./add-exam.html");

// // Modal
// const modal = document.getElementById("detailsModal");
// const modalContent = document.getElementById("modalContent");
// const closeModal = document.getElementById("closeModal");

// closeModal.onclick = () => (modal.style.display = "none");
// modal.onclick = (e) => {
//   if (e.target === modal) modal.style.display = "none";
// };

// function showDetailsModal(exam) {
//   modalContent.innerHTML = `
//         <p><b>Title:</b> ${exam.title}</p>
//         <p><b>Questions:</b> ${exam.questionsCount}</p>
//         <p><b>Duration:</b> ${exam.duration} min</p>
//         <p><b>Difficulty:</b> ${exam.difficulty}</p>
//         <p><b>Status:</b> Published</p>
//         <p><b>Attempts:</b> ${exam.attempts || 0}</p>
//     `;
//   modal.style.display = "flex";
// }

// onAuthStateChanged(auth, async (user) => {
//   if (!user) return (window.location.href = "./login.html");

//   examsTable.insertAdjacentHTML(
//     "beforeend",
//     `<div class="empty-wrapper">Loading exams...</div>`
//   );

//   await loadTeacherData(user.uid);
//   await loadTeacherExams(user.uid);
// });

// async function loadTeacherData(uid) {
//   const snap = await getDoc(doc(db, "teachers", uid));
//   if (!snap.exists()) return;

//   const data = snap.data();
//   statActiveStudents.textContent = data.studentsCount || 0;
//   statUpcoming.textContent = data.upcomingExams || 0;
//   statAttempts.textContent = data.totalAttempts || 0;
// }

// async function loadTeacherExams(uid) {
//   const q = query(collection(db, "exams"), where("teacherId", "==", uid));
//   const snapshot = await getDocs(q);

//   document.querySelector(".empty-wrapper")?.remove();

//   if (snapshot.empty) {
//     examsTable.innerHTML += `<div class="empty-wrapper">No exams found.</div>`;
//     statTotalExams.textContent = 0;
//     return;
//   }

//   let total = 0;

//   snapshot.forEach((docSnap) => {
//     total++;
//     addExamRow(docSnap.id, docSnap.data());
//   });

//   statTotalExams.textContent = total;
// }

// function addExamRow(id, exam) {
//   const row = document.createElement("div");
//   row.className = "table-row";

//   const title = createCell(exam.title);
//   const questions = createCell(exam.questionsCount ?? 0);
//   const duration = createCell(`${exam.duration} min`);
//   const difficulty = createBadgeCell(exam.difficulty);
//   const status = createBadgeCell("Published", "published");
//   const attempts = createCell(exam.attempts || 0);

//   const actions = document.createElement("span");
//   actions.className = "table-actions";

//   const edit = createBtn("Edit", "edit");
//   const del = createBtn("Delete", "delete");
//   actions.append(edit, del);

//   if (window.innerWidth < 900) {
//     const more = document.createElement("span");
//     more.className = "row-details-btn";
//     more.textContent = "⋮";
//     more.onclick = () => showDetailsModal(exam);
//     actions.append(more);
//   }

//   row.append(title, questions, duration, difficulty, status, attempts, actions);
//   examsTable.append(row);
// }

// function createCell(text) {
//   const span = document.createElement("span");
//   span.textContent = text;
//   return span;
// }

// function createBtn(text, cls) {
//   const btn = document.createElement("button");
//   btn.className = `action-btn ${cls}`;
//   btn.textContent = text;
//   return btn;
// }

// function createBadgeCell(val, fixedClass = null) {
//   const span = document.createElement("span");
//   const badge = document.createElement("span");

//   const cls = fixedClass || val?.toLowerCase() || "medium";
//   badge.className = `badge ${cls}`;
//   badge.textContent = val;

//   span.append(badge);
//   return span;
// }

import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// ================================
//            ELEMENTS
// ================================
const examsTable = document.getElementById("examsTable");
const btnNewExam = document.getElementById("btnNewExam");

const statTotalExams = document.getElementById("stat-total-exams");
const statActiveStudents = document.getElementById("stat-active-students");
const statUpcoming = document.getElementById("stat-upcoming");
const statAttempts = document.getElementById("stat-attempts");

// Redirect
btnNewExam.onclick = () => (window.location.href = "./add-exam.html");

// ================================
//          MODAL
// ================================
const modal = document.getElementById("detailsModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

closeModal.onclick = () => (modal.style.display = "none");
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

function showDetailsModal(exam) {
  modalContent.innerHTML = `
        <p><b>Title:</b> ${exam.title}</p>
        <p><b>Questions:</b> ${exam.questionsCount}</p>
        <p><b>Duration:</b> ${exam.duration} min</p>
        <p><b>Difficulty:</b> ${exam.difficulty}</p>
        <p><b>Status:</b> Published</p>
        <p><b>Attempts:</b> ${exam.attempts || 0}</p>
    `;
  modal.style.display = "flex";
}

// ================================
//      AUTH CHECK + INITIAL LOAD
// ================================
onAuthStateChanged(auth, async (user) => {
  if (!user) return (window.location.href = "./login.html");

  // أول ما نفتح الصفحة نحافظ إن الهيدر موجود ونحط loading تحته
  examsTable.innerHTML = `
    <div class="table-header">
      <span>Exam Title</span>
      <span>Questions</span>
      <span>Duration</span>
      <span>Difficulty</span>
      <span>Status</span>
      <span>Attempts</span>
      <span>Actions</span>
    </div>

    <div class="empty-wrapper">Loading exams...</div>
  `;

  await loadTeacherData(user.uid);
  await loadTeacherExams(user.uid);
});

// ================================
//      LOAD TEACHER STATS
// ================================
async function loadTeacherData(uid) {
  const snap = await getDoc(doc(db, "teachers", uid));
  if (!snap.exists()) return;

  const data = snap.data();
  statActiveStudents.textContent = data.studentsCount || 0;
  statUpcoming.textContent = data.upcomingExams || 0;
  statAttempts.textContent = data.totalAttempts || 0;
}

// ================================
//          LOAD TEACHER EXAMS
// ================================
async function loadTeacherExams(uid) {
  const q = query(collection(db, "exams"), where("teacherId", "==", uid));
  const snapshot = await getDocs(q);

  // شيل اللودينج بس
  document.querySelector(".empty-wrapper")?.remove();

  if (snapshot.empty) {
    examsTable.innerHTML += `<div class="empty-wrapper">No exams found.</div>`;
    statTotalExams.textContent = 0;
    return;
  }

  let count = 0;

  snapshot.forEach((docSnap) => {
    count++;
    addExamRow(docSnap.id, docSnap.data());
  });

  statTotalExams.textContent = count;
}

// ================================
//          RENDER TABLE ROW
// ================================
function addExamRow(id, exam) {
  const row = document.createElement("div");
  row.className = "table-row";

  const title = createCell(exam.title);
  const questions = createCell(exam.questionsCount ?? 0);
  const duration = createCell(`${exam.duration} min`);
  const difficulty = createBadgeCell(exam.difficulty);
  const status = createBadgeCell("Published", "published");
  const attempts = createCell(exam.attempts || 0);

  const actions = document.createElement("span");
  actions.className = "table-actions";

  const edit = createBtn("Edit", "edit");
  const del = createBtn("Delete", "delete");
  actions.append(edit, del);

  // mobile ⋮ menu
  if (window.innerWidth < 900) {
    const more = document.createElement("span");
    more.className = "row-details-btn";
    more.textContent = "⋮";
    more.onclick = () => showDetailsModal(exam);
    actions.append(more);
  }

  // append all
  row.append(title, questions, duration, difficulty, status, attempts, actions);
  examsTable.append(row);
}

// ================= HELPER FUNCTIONS =================
function createCell(text) {
  const s = document.createElement("span");
  s.textContent = text;
  return s;
}

function createBtn(text, cls) {
  const btn = document.createElement("button");
  btn.className = `action-btn ${cls}`;
  btn.textContent = text;
  return btn;
}

function createBadgeCell(val, fixedClass = null) {
  const wrap = document.createElement("span");
  const badge = document.createElement("span");

  const cls = fixedClass || val?.toLowerCase() || "medium";
  badge.className = `badge ${cls}`;
  badge.textContent = val;

  wrap.append(badge);
  return wrap;
}
