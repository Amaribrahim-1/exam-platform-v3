// add-exam.js — FULL VERSION WITH FIREBASE

import { auth, db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// =========================
//     SELECTORS & STEPS
// =========================

const steps = document.querySelectorAll(".step");
const panels = document.querySelectorAll(".step-panel");

// buttons
const step1NextBtn = document.getElementById("step1-next");
const step2BackBtn = document.getElementById("step2-back");
const step2NextBtn = document.getElementById("step2-next");
const step3BackBtn = document.getElementById("step3-back");
const publishExamBtn = document.getElementById("publish-exam-btn");

// Step 1 inputs
const titleInput = document.getElementById("exam-title");
const subjectInput = document.getElementById("exam-subject");
const gradeInput = document.getElementById("exam-grade");
const durationInput = document.getElementById("exam-duration");
const marksInput = document.getElementById("exam-marks");
const descInput = document.getElementById("exam-description");
const difficultyInput = document.getElementById("exam-difficulty");

// Step 2
const addQuestionBtn = document.getElementById("add-question-btn");
const questionsContainer = document.getElementById("questions-container");

// Step 3 summary
const summaryTitle = document.getElementById("summary-title");
const summarySubject = document.getElementById("summary-subject");
const summaryGrade = document.getElementById("summary-grade");
const summaryDuration = document.getElementById("summary-duration");
const summaryMarks = document.getElementById("summary-marks");
const summaryDescription = document.getElementById("summary-description");
const summaryQuestionsCount = document.getElementById(
  "summary-questions-count"
);
const summaryQuestionsList = document.getElementById("summary-questions");

// =================================================
//               GLOBAL EXAM STATE
// =================================================

const examState = {
  info: {},
  questions: [],
  teacherExamsCount: 0,
};

// ==============================================
//             STEP NAVIGATION
// ==============================================

function goToStep(stepNumber) {
  panels.forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.step) === stepNumber);
  });

  steps.forEach((st) => {
    const s = Number(st.dataset.step);
    st.classList.remove("active", "completed");

    if (s < stepNumber) st.classList.add("completed");
    if (s === stepNumber) st.classList.add("active");
  });
}

// ==============================================
//             STEP 1 VALIDATION
// ==============================================

function setError(id, msg) {
  const el = document.querySelector(`[data-error-for="${id}"]`);
  if (el) el.textContent = msg;
}

function validateStep1() {
  let ok = true;

  if (!titleInput.value.trim()) {
    setError("exam-title", "Required");
    ok = false;
  } else setError("exam-title", "");

  if (!subjectInput.value.trim()) {
    setError("exam-subject", "Required");
    ok = false;
  } else setError("exam-subject", "");

  if (!durationInput.value || Number(durationInput.value) <= 0) {
    setError("exam-duration", "Invalid");
    ok = false;
  } else setError("exam-duration", "");

  if (!difficultyInput.value.trim()) {
    setError("exam-difficulty", "Required");
    ok = false;
  } else setError("exam-difficulty", "");

  if (!marksInput.value || Number(marksInput.value) <= 0) {
    setError("exam-marks", "Invalid");
    ok = false;
  } else setError("exam-marks", "");

  if (!ok) return false;

  examState.info = {
    title: titleInput.value.trim(),
    subject: subjectInput.value.trim(),
    grade: gradeInput.value.trim(),
    duration: Number(durationInput.value),
    totalMarks: Number(marksInput.value),
    description: descInput.value.trim(),
    difficulty: difficultyInput.value.trim(),
  };

  return true;
}

// ==============================================
//        LOAD TEACHER INFO (examsCount)
// ==============================================

async function loadTeacherInfo() {
  const user = auth.currentUser;
  if (!user) return;

  const tRef = doc(db, "teachers", user.uid);
  const tSnap = await getDoc(tRef);

  const uRef = doc(db, "users", user.uid);
  const uSnap = await getDoc(uRef);

  // Teacher count موجود في أي واحدة منهم → استخدمه
  const tCount = tSnap.exists() ? tSnap.data().examsCount : 0;
  const uCount = uSnap.exists() ? uSnap.data().examsCount : 0;

  examState.teacherExamsCount = Math.max(tCount, uCount);
}

document.addEventListener("DOMContentLoaded", loadTeacherInfo);

// ==============================================
//             STEP 2 — QUESTIONS
// ==============================================

let questionIndex = 0;

function createQuestionCard() {
  questionIndex += 1;

  const card = document.createElement("div");
  card.className = "question-card";

  // HEADER
  const header = document.createElement("div");
  header.className = "question-header-row";

  const left = document.createElement("div");

  const title = document.createElement("span");
  title.className = "question-title";
  title.textContent = `Question ${questionIndex}`;

  const pill = document.createElement("span");
  pill.className = "question-index-pill";
  pill.textContent = `#${questionIndex}`;

  left.appendChild(title);
  left.appendChild(pill);

  const remove = document.createElement("button");
  remove.className = "remove-question-btn";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    card.remove();
  });

  header.appendChild(left);
  header.appendChild(remove);

  // QUESTION TEXT
  const qWrapper = document.createElement("div");
  qWrapper.className = "question-input";

  const qLabel = document.createElement("label");
  qLabel.textContent = "Question text";

  const qText = document.createElement("textarea");
  qText.placeholder = "Write the question...";
  qText.rows = 2;
  qText.dataset.role = "question-text";

  qWrapper.appendChild(qLabel);
  qWrapper.appendChild(qText);

  // OPTIONS
  const optionsGrid = document.createElement("div");
  optionsGrid.className = "options-grid";

  for (let i = 1; i <= 4; i++) {
    const optField = document.createElement("div");
    optField.className = "option-field";

    const optLabel = document.createElement("label");
    optLabel.textContent = `Option ${i}`;

    const optInput = document.createElement("input");
    optInput.type = "text";
    optInput.placeholder = `Option ${i}`;
    optInput.dataset.role = "option-input";

    optField.appendChild(optLabel);
    optField.appendChild(optInput);
    optionsGrid.appendChild(optField);
  }

  // CORRECT SELECT
  const correctRow = document.createElement("div");
  correctRow.className = "correct-select-row";

  const correctLabel = document.createElement("span");
  correctLabel.textContent = "Correct answer:";

  const select = document.createElement("select");
  select.dataset.role = "correct";

  for (let i = 0; i < 4; i++) {
    const op = document.createElement("option");
    op.value = i;
    op.textContent = `Option ${i + 1}`;
    select.appendChild(op);
  }

  correctRow.appendChild(correctLabel);
  correctRow.appendChild(select);

  card.appendChild(header);
  card.appendChild(qWrapper);
  card.appendChild(optionsGrid);
  card.appendChild(correctRow);

  return card;
}

addQuestionBtn.addEventListener("click", () => {
  questionsContainer.appendChild(createQuestionCard());
});

// ============================================================
//      Collect Questions
// ============================================================

function collectQuestions() {
  const cards = questionsContainer.querySelectorAll(".question-card");
  const result = [];

  cards.forEach((card) => {
    const qText = card
      .querySelector("[data-role='question-text']")
      .value.trim();
    const optionInputs = card.querySelectorAll("[data-role='option-input']");
    const correct = card.querySelector("[data-role='correct']").value;

    if (!qText) return;

    const options = [...optionInputs].map((o) => o.value.trim());
    if (options.every((o) => !o)) return;

    result.push({
      text: qText,
      options,
      correctIndex: Number(correct),
    });
  });

  return result;
}

// ============================================================
//                 Step 3 — Summary
// ============================================================

function fillSummary() {
  const info = examState.info;
  const qs = examState.questions;

  summaryTitle.textContent = info.title;
  summarySubject.textContent = info.subject;
  summaryGrade.textContent = info.grade || "—";
  summaryDuration.textContent = info.duration + " mins";
  summaryMarks.textContent = info.totalMarks;
  summaryDescription.textContent = info.description || "No description.";
  summaryQuestionsCount.textContent = qs.length;

  summaryQuestionsList.innerHTML = "";

  qs.forEach((q, i) => {
    const item = document.createElement("div");
    item.className = "summary-question-item";

    const h4 = document.createElement("h4");
    h4.textContent = `Q${i + 1}. ${q.text}`;
    item.appendChild(h4);

    const ul = document.createElement("ul");
    ul.className = "summary-options";

    q.options.forEach((opt, idx) => {
      if (!opt) return;
      const li = document.createElement("li");
      li.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;
      ul.appendChild(li);
    });

    item.appendChild(ul);

    const correct = document.createElement("p");
    correct.className = "summary-correct";
    correct.textContent = `Correct answer: ${q.options[q.correctIndex]}`;
    item.appendChild(correct);

    summaryQuestionsList.appendChild(item);
  });
}

// ============================================================
//               PUBLISH TO FIRESTORE
// ============================================================

async function publishExamToDB() {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    // 1) Save exam
    const examRef = await addDoc(collection(db, "exams"), {
      teacherId: user.uid,
      title: examState.info.title,
      subject: examState.info.subject,
      grade: examState.info.grade,
      difficulty: examState.info.difficulty,
      duration: examState.info.duration,
      totalMarks: examState.info.totalMarks,
      description: examState.info.description,
      questionsCount: examState.questions.length,
      createdAt: serverTimestamp(),
    });

    // 2) Save questions
    for (const q of examState.questions) {
      await addDoc(collection(db, "questions"), {
        examId: examRef.id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
      });
    }

    // 3) Update teacher exam count
    const tRef = doc(db, "teachers", user.uid);
    await updateDoc(tRef, {
      examsCount: examState.teacherExamsCount + 1,
    });

    // UPDATE EXAMS COUNT IN USERS TOO
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      examsCount: examState.teacherExamsCount + 1,
    });

    // 4) Redirect
    window.location.href = "./teacher-home.html";
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}

// ============================================================
//                     BUTTON EVENTS
// ============================================================

// STEP 1 → STEP 2
step1NextBtn.addEventListener("click", () => {
  if (!validateStep1()) return;

  if (!questionsContainer.querySelector(".question-card")) {
    questionsContainer.appendChild(createQuestionCard());
  }

  goToStep(2);
});

// STEP 2 → BACK
step2BackBtn.addEventListener("click", () => {
  goToStep(1);
});

// STEP 2 → STEP 3
step2NextBtn.addEventListener("click", () => {
  const qs = collectQuestions();
  if (!qs.length) {
    alert("Please add at least one question!");
    return;
  }

  examState.questions = qs;
  fillSummary();
  goToStep(3);
});

// STEP 3 → BACK
step3BackBtn.addEventListener("click", () => {
  goToStep(2);
});

// PUBLISH
publishExamBtn.addEventListener("click", publishExamToDB);
