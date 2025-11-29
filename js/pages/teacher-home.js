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

// function addExamRow(id, exam) {
//   const isMobile = window.innerWidth < 900;

//   if (isMobile) {
//     // ================= MOBILE CARD VIEW =================
//     const card = document.createElement("div");
//     card.className = "exam-card-mobile";

//     card.innerHTML = `
//       <div class="exam-card-top">
//         <h3>${exam.title}</h3>
//         <span class="badge ${exam.difficulty?.toLowerCase() || "medium"}">
//           ${exam.difficulty}
//         </span>
//       </div>

//       <div class="exam-card-details">
//         <p><strong>Questions:</strong> ${exam.questionsCount ?? 0}</p>
//         <p><strong>Duration:</strong> ${exam.duration} min</p>
//         <p><strong>Status:</strong> Published</p>
//         <p><strong>Attempts:</strong> ${exam.attempts || 0}</p>
//       </div>

//       <button class="exam-more-btn">View Details</button>
//     `;

//     // details modal
//     card.querySelector(".exam-more-btn").onclick = () => showDetailsModal(exam);

//     examsTable.append(card);
//     return;
//   }

//   // ================= DESKTOP TABLE VIEW =================
//   const row = document.createElement("div");
//   row.className = "table-row";

//   row.append(
//     createCell(exam.title),
//     createCell(exam.questionsCount ?? 0),
//     createCell(`${exam.duration} min`),
//     createBadgeCell(exam.difficulty),
//     createBadgeCell("Published", "published"),
//     createCell(exam.attempts || 0)
//   );

//   // actions column (empty for now)
//   const actions = document.createElement("span");
//   actions.className = "table-actions";

//   const viewBtn = createBtn("View Attempts", "view");
//   viewBtn.onclick = () => {
//     window.location.href = `./view-students.html?eid=${id}`;
//   };
//   row.append(actions);

//   actions.append(viewBtn);

//   examsTable.append(row);
// }

function addExamRow(id, exam) {
  const isMobile = window.innerWidth < 900;

  if (isMobile) {
    // ================= MOBILE CARD VIEW =================
    const card = document.createElement("div");
    card.className = "exam-card-mobile";

    card.innerHTML = `
      <div class="exam-card-top">
        <h3>${exam.title}</h3>
        <span class="badge ${exam.difficulty?.toLowerCase() || "medium"}">
          ${exam.difficulty}
        </span>
      </div>

      <div class="exam-card-details">
        <p><strong>Questions:</strong> ${exam.questionsCount ?? 0}</p>
        <p><strong>Duration:</strong> ${exam.duration} min</p>
        <p><strong>Status:</strong> Published</p>
        <p><strong>Attempts:</strong> ${exam.attempts || 0}</p>
      </div>

      <button class="exam-more-btn">View Details</button>
      <button class="exam-more-btn attempt-btn">View Attempts</button>
    `;

    // existing modal
    card.querySelector(".exam-more-btn").onclick = () => showDetailsModal(exam);

    // NEW button for attempts
    card.querySelector(".attempt-btn").addEventListener("click", () => {
      window.location.href = `./teacher-view-students.html?eid=${id}`;
    });

    examsTable.append(card);
    return;
  }

  // ================= DESKTOP TABLE VIEW =================
  const row = document.createElement("div");
  row.className = "table-row";

  row.append(
    createCell(exam.title),
    createCell(exam.questionsCount ?? 0),
    createCell(`${exam.duration} min`),
    createBadgeCell(exam.difficulty),
    createBadgeCell("Published", "published"),
    createCell(exam.attempts || 0)
  );

  // actions column
  const actions = document.createElement("span");
  actions.className = "table-actions";

  const viewBtn = createBtn("View Attempts", "view");
  viewBtn.onclick = (e) => {
    // e.preventDefault();
    window.location.href = `./teacher-view-students.html?eid=${id}`;
  };

  actions.append(viewBtn);
  row.append(actions);

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
