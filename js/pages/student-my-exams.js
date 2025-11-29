// js/pages/student-my-exams.js
import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";

// Elements
const tableBody = document.getElementById("myExamsTable");
const statTotalAttempts = document.getElementById("stat-total-attempts");
const statAvgScore = document.getElementById("stat-avg-score");
const statBestScore = document.getElementById("stat-best-score");

// Helper: format date
function formatDate(ts) {
  if (!ts) return "—";
  try {
    const d = ts.toDate();
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

// Render single row
function addExamRow(exam, result) {
  const row = document.createElement("div");
  row.className = "exam-row";

  const titleCell = document.createElement("span");
  titleCell.className = "exam-title-cell";
  titleCell.textContent = exam.title || "Untitled exam";

  const subjectCell = document.createElement("span");
  subjectCell.className = "exam-subject-cell";
  subjectCell.textContent = exam.subject || "—";

  const statusCell = document.createElement("span");
  statusCell.className = "status-cell";
  const badge = document.createElement("span");
  badge.classList.add("status-badge");

  if (result.reason === "timeout") {
    badge.classList.add("status-timeout");
    badge.textContent = "Time up";
  } else {
    badge.classList.add("status-submitted");
    badge.textContent = "Submitted";
  }
  statusCell.appendChild(badge);

  const scoreCell = document.createElement("span");
  scoreCell.className = "exam-score-cell";
  scoreCell.textContent = `${result.score}/${result.totalMarks}`;

  const percentCell = document.createElement("span");
  percentCell.className = "exam-percent-cell";
  const pct = result.percentage ?? 0;
  percentCell.textContent = `${pct}%`;
  percentCell.classList.add(
    pct >= 50 ? "exam-percent-good" : "exam-percent-bad"
  );

  const dateCell = document.createElement("span");
  dateCell.className = "exam-date-cell";
  dateCell.textContent = formatDate(result.submittedAt);

  row.append(
    titleCell,
    subjectCell,
    statusCell,
    scoreCell,
    percentCell,
    dateCell
  );

  tableBody.appendChild(row);
}

// Load exams for current student
async function loadMyExams(studentId) {
  // Query examResults for this student
  const resultsRef = collection(db, "examResults");
  const q = query(
    resultsRef,
    where("studentId", "==", studentId),
    orderBy("submittedAt", "desc")
  );

  const snap = await getDocs(q);

  // Clear loading state
  tableBody.innerHTML = "";

  if (snap.empty) {
    tableBody.innerHTML =
      '<div class="empty-state">You haven\'t taken any exams yet.</div>';
    statTotalAttempts.textContent = 0;
    statAvgScore.textContent = "0%";
    statBestScore.textContent = "0%";
    return;
  }

  let totalAttempts = 0;
  let sumPercent = 0;
  let bestPercent = 0;

  // علشان مانعملش request لكل exam أكتر من مرة
  const examsCache = new Map();

  for (const docSnap of snap.docs) {
    const result = docSnap.data();
    const examId = result.examId;
    if (!examId) continue;

    // Get exam (with cache)
    let exam = examsCache.get(examId);
    if (!exam) {
      const examSnap = await getDoc(doc(db, "exams", examId));
      if (!examSnap.exists()) continue;
      exam = { id: examId, ...examSnap.data() };
      examsCache.set(examId, exam);
    }

    addExamRow(exam, result);

    totalAttempts++;
    const pct = result.percentage ?? 0;
    sumPercent += pct;
    if (pct > bestPercent) bestPercent = pct;
  }

  const avg = totalAttempts ? Math.round(sumPercent / totalAttempts) : 0;

  statTotalAttempts.textContent = totalAttempts;
  statAvgScore.textContent = `${avg}%`;
  statBestScore.textContent = `${bestPercent}%`;
}

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  // Load exams for this student
  try {
    await loadMyExams(user.uid);
  } catch (err) {
    console.error("Failed to load my exams:", err);
    tableBody.innerHTML =
      '<div class="empty-state">Failed to load exams. Please try again later.</div>';
  }
});
