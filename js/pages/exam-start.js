import { auth, db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { increment, updateDoc } from "firebase/firestore";

// ====== URL PARAMS ======
const params = new URLSearchParams(window.location.search);
const examId = params.get("eid");

if (!examId) {
  alert("Invalid exam id");
  window.location.href = "./student-home.html";
}

// ====== SELECTORS ======
const examTitleEl = document.getElementById("examTitle");
const examSubjectEl = document.getElementById("examSubject");
const examDurationEl = document.getElementById("examDuration");
const examMarksEl = document.getElementById("examMarks");
const examDifficultyEl = document.getElementById("examDifficulty");

const questionDotsEl = document.getElementById("questionDots");
const answeredCountEl = document.getElementById("answeredCount");

const timerDisplayEl = document.getElementById("timerDisplay");
const timerBarEl = document.getElementById("timerBar");
const timerBlockEl = document.getElementById("timerBlock");

const questionCounterEl = document.getElementById("questionCounter");
const questionTextEl = document.getElementById("questionText");
const optionsListEl = document.getElementById("optionsList");

const prevBtn = document.getElementById("prevQuestionBtn");
const nextBtn = document.getElementById("nextQuestionBtn");
const submitBtn = document.getElementById("submitExamBtn");

const examMainEl = document.querySelector(".exam-main");
const statusBannerEl = document.getElementById("examStatusBanner");

const resultModalEl = document.getElementById("resultModal");
const resultScoreEl = document.getElementById("resultScore");
const resultTotalEl = document.getElementById("resultTotal");
const resultPercentEl = document.getElementById("resultPercent");
const resultMessageEl = document.getElementById("resultMessage");

const reviewBtn = document.getElementById("reviewBtn");
const goBackBtn = document.getElementById("goBackBtn");
const backToTeacherBtn = document.getElementById("backToTeacher");

// ====== LOCAL STORAGE STATE ======
// const STORAGE_KEY = `exam_state_${examId}_v1`;

const state = {
  exam: null,
  questions: [],
  answers: [],
  currentIndex: 0,
  durationSeconds: 0,
  startedAt: null,
  remainingSeconds: 0,
  timerId: null,
  submitted: false,
  score: 0,
  percentage: 0,
};

// ====== STORAGE HELPERS ======
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);

    state.answers = saved.answers || state.answers;
    state.currentIndex = saved.currentIndex || 0;
    state.startedAt = saved.startedAt || null;
    // state.submitted = !!saved.submitted;
    state.score = saved.score || 0;
    state.percentage = saved.percentage || 0;
  } catch (e) {
    console.warn("Failed to load exam state:", e);
  }
}

function saveToStorage() {
  const data = {
    answers: state.answers,
    currentIndex: state.currentIndex,
    startedAt: state.startedAt,
    submitted: state.submitted,
    score: state.score,
    percentage: state.percentage,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// =====================================================
// 🔥🔥 منع إعادة الامتحان (Firestore Check)
// =====================================================

async function checkAlreadySubmitted(userId) {
  const resultsRef = collection(db, "examResults");
  const q = query(
    resultsRef,
    where("examId", "==", examId),
    where("studentId", "==", userId)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    alert("You have already submitted this exam before.");
    window.location.href = "./my-exams.html";
    return true;
  }

  return false;
}

// =====================================================
// ✓ AUTH + START FLOW
// =====================================================

auth.onAuthStateChanged(async (user) => {
  if (!user) return (window.location.href = "./login.html");

  // 🔥 أول حاجة نعمل Check
  const blocked = await checkAlreadySubmitted(user.uid);
  if (blocked) return;

  // لو مسمّح → نبدأ الامتحان
  loadExamAndQuestions();
});

// =====================================================
// RENDER FUNCTIONS (لم يتم تغييرها)
// =====================================================

function renderExamHeader() {
  const e = state.exam;
  if (!e) return;

  examTitleEl.textContent = e.title || "Exam";
  examSubjectEl.textContent = e.subject || "";
  examDurationEl.textContent = e.duration || "—";
  examMarksEl.textContent = e.totalMarks || "—";
  examDifficultyEl.textContent = e.difficulty || "—";

  examDifficultyEl.classList.remove("diff-easy", "diff-medium", "diff-hard");
  const diff = (e.difficulty || "").toLowerCase();
  if (diff === "easy") examDifficultyEl.classList.add("diff-easy");
  if (diff === "medium") examDifficultyEl.classList.add("diff-medium");
  if (diff === "hard") examDifficultyEl.classList.add("diff-hard");
}

function renderQuestionDots() {
  questionDotsEl.innerHTML = "";
  const total = state.questions.length;

  const answeredCount = state.answers.filter((a) => a !== null).length;
  answeredCountEl.textContent = `${answeredCount} answered`;

  state.questions.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "q-dot";
    btn.textContent = idx + 1;

    if (idx === state.currentIndex) btn.classList.add("current");
    if (state.answers[idx] !== null) btn.classList.add("answered");

    btn.addEventListener("click", () => {
      state.currentIndex = idx;
      saveToStorage();
      renderQuestion();
      renderQuestionDots();
    });

    questionDotsEl.appendChild(btn);
  });
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  const total = state.questions.length;
  questionCounterEl.textContent = `Question ${
    state.currentIndex + 1
  } of ${total}`;
  questionTextEl.textContent = q.text;

  optionsListEl.innerHTML = "";

  q.options.forEach((optText, idx) => {
    if (!optText) return;

    const wrapper = document.createElement("label");
    wrapper.className = "option-item";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "question-option";
    input.value = idx;

    const span = document.createElement("div");
    span.className = "option-text";
    span.textContent = optText;

    wrapper.appendChild(input);
    wrapper.appendChild(span);

    if (state.answers[state.currentIndex] === idx) {
      input.checked = true;
      wrapper.classList.add("selected");
    }

    wrapper.addEventListener("click", () => {
      if (state.submitted) return;
      input.checked = true;
      state.answers[state.currentIndex] = idx;
      saveToStorage();
      renderQuestionDots();
      optionsListEl
        .querySelectorAll(".option-item")
        .forEach((el) => el.classList.remove("selected"));
      wrapper.classList.add("selected");
    });

    optionsListEl.appendChild(wrapper);
  });

  if (state.submitted) {
    applySubmittedStylesForCurrentQuestion();
  }

  updateNavButtons();
}

function updateNavButtons() {
  const total = state.questions.length;
  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.disabled = state.currentIndex === total - 1;
}

function applySubmittedStylesForCurrentQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) return;

  const userAns = state.answers[state.currentIndex];

  const optionEls = optionsListEl.querySelectorAll(".option-item");
  optionEls.forEach((el, idx) => {
    el.classList.remove("correct", "wrong-selected");
    if (idx === q.correctIndex) {
      el.classList.add("correct");
    }
    if (userAns === idx && idx !== q.correctIndex) {
      el.classList.add("wrong-selected");
    }
  });

  optionsListEl
    .querySelectorAll("input[type='radio']")
    .forEach((inp) => (inp.disabled = true));
}

// =====================================================
// TIMER
// =====================================================

function formatTime(sec) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function startTimer() {
  if (state.submitted) {
    timerDisplayEl.textContent = "00:00";
    timerBarEl.style.transform = "scaleX(0)";
    return;
  }

  const total = state.durationSeconds;

  function tick() {
    const now = Date.now();
    const elapsed = Math.floor((now - state.startedAt) / 1000);
    state.remainingSeconds = Math.max(total - elapsed, 0);

    timerDisplayEl.textContent = formatTime(state.remainingSeconds);

    const ratio = state.remainingSeconds / total;
    timerBarEl.style.transform = `scaleX(${Math.max(ratio, 0)})`;

    if (state.remainingSeconds <= 0) {
      clearInterval(state.timerId);
      state.timerId = null;
      handleTimeUp();
    }
  }

  tick();
  state.timerId = setInterval(tick, 1000);
}

// =====================================================
// CALCULATE SCORE
// =====================================================

function calculateScore() {
  const totalQuestions = state.questions.length;
  if (!totalQuestions) return { score: 0, correct: 0 };

  let correctCount = 0;
  state.questions.forEach((q, idx) => {
    if (state.answers[idx] === q.correctIndex) correctCount++;
  });

  const totalMarks = state.exam.totalMarks || totalQuestions;
  const markPerQ = totalMarks / totalQuestions;
  const score = Math.round(correctCount * markPerQ);
  const percentage = Math.round((score / totalMarks) * 100);

  state.score = score;
  state.percentage = percentage;

  saveToStorage();

  return { score, correctCount, totalMarks, percentage };
}

// =====================================================
// SAVE RESULT TO FIRESTORE
// =====================================================

async function saveResultToDB(reason = "manual") {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const { score, correctCount, totalMarks, percentage } = calculateScore();

    // === Load user data
    let studentData = {};
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        studentData = userSnap.data();
      }
    } catch (e) {}

    // === Save attempt
    await addDoc(collection(db, "examResults"), {
      examId,
      teacherId: state.exam.teacherId,
      studentId: user.uid,
      studentName: studentData.name || "Unknown",
      studentEmail: studentData.email || user.email,
      score,
      totalMarks,
      percentage,
      correctCount,
      totalQuestions: state.questions.length,
      answers: state.answers,
      submittedAt: serverTimestamp(),
      reason,
    });

    // === update counters
    await updateDoc(doc(db, "exams", examId), { attempts: increment(1) });
    await updateDoc(doc(db, "teachers", state.exam.teacherId), {
      totalAttempts: increment(1),
    });
  } catch (err) {
    console.error("Failed to save result:", err);
  }
}

// =====================================================
// SUBMISSION HANDLING
// =====================================================

// async function handleTimeUp() {
//   if (state.submitted) return;
//   state.submitted = true;
//   saveToStorage();

//   examMainEl.classList.add("submitted");
//   submitBtn.disabled = true;

//   applySubmittedStylesForCurrentQuestion();

//   statusBannerEl.className = "exam-status-banner danger";
//   statusBannerEl.textContent = "Time is over. Exam submitted.";
//   statusBannerEl.classList.remove("hidden");

//   await saveResultToDB("timeout");
//   showResultModal(true);
// }
async function handleTimeUp() {
  if (state.submitted) return;

  state.submitted = true;
  saveToStorage();

  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null; // 🔥 لازم
  }

  state.remainingSeconds = 0;
  timerDisplayEl.textContent = "00:00";
  timerBarEl.style.transform = "scaleX(0)";
}

// async function handleSubmitClick() {
//   if (state.submitted) return;

//   state.submitted = true;
//   saveToStorage();

//   if (state.timerId) clearInterval(state.timerId);

//   examMainEl.classList.add("submitted");
//   submitBtn.disabled = true;

//   applySubmittedStylesForCurrentQuestion();

//   statusBannerEl.className = "exam-status-banner success";
//   statusBannerEl.textContent =
//     "Exam submitted. You can still review your answers.";
//   statusBannerEl.classList.remove("hidden");

//   await saveResultToDB("manual");
//   showResultModal(false);
// }

async function handleSubmitClick() {
  if (state.submitted) return;

  state.submitted = true;
  saveToStorage();

  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null; // 🔥 مهم جداً
  }

  state.remainingSeconds = 0; // 🔥 علشان الـ UI يقفل الوقت
  timerDisplayEl.textContent = "00:00";
  timerBarEl.style.transform = "scaleX(0)";

  examMainEl.classList.add("submitted");
  submitBtn.disabled = true;

  applySubmittedStylesForCurrentQuestion();

  statusBannerEl.className = "exam-status-banner success";
  statusBannerEl.textContent =
    "Exam submitted. You can still review your answers.";
  statusBannerEl.classList.remove("hidden");

  await saveResultToDB("manual");
  showResultModal(false);
}

function showResultModal(auto = false) {
  const { score, totalMarks, percentage } = state;

  resultScoreEl.textContent = score;
  resultTotalEl.textContent = totalMarks;
  resultPercentEl.textContent = percentage;

  resultMessageEl.textContent = auto
    ? "Time is up. Your exam has been submitted automatically."
    : "You can now review your answers.";

  resultModalEl.classList.remove("hidden");
}

// =====================================================
// LOAD EXAM
// =====================================================

let STORAGE_KEY = null;

auth.onAuthStateChanged((user) => {
  if (user) {
    STORAGE_KEY = `exam_state_${examId}_${user.uid}`;
    loadExamAndQuestions();
  }
});

async function loadExamAndQuestions() {
  const examRef = doc(db, "exams", examId);
  const examSnap = await getDoc(examRef);

  if (!examSnap.exists()) {
    questionTextEl.textContent = "Exam not found.";
    return;
  }

  state.exam = { id: examId, ...examSnap.data() };
  state.durationSeconds = (state.exam.duration || 60) * 60;

  // ====== CHECK IF STUDENT ALREADY SUBMITTED FROM FIRESTORE ======
  const tryQuery = query(
    collection(db, "examResults"),
    where("examId", "==", examId),
    where("studentId", "==", auth.currentUser.uid)
  );

  const trySnap = await getDocs(tryQuery);

  if (!trySnap.empty) {
    state.submitted = true;
  }

  renderExamHeader();

  // ==== load questions
  const qRef = collection(db, "questions");
  const qQuery = query(qRef, where("examId", "==", examId));
  const qSnap = await getDocs(qQuery);

  state.questions = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (!state.questions.length) {
    questionTextEl.textContent = "No questions found.";
    optionsListEl.innerHTML = "";
    submitBtn.disabled = true;
    return;
  }

  state.answers = new Array(state.questions.length).fill(null);

  loadFromStorage();

  if (!state.startedAt) {
    state.startedAt = Date.now();
    state.submitted = false;
    state.currentIndex = 0;
    saveToStorage();
  }

  if (state.submitted) {
    examMainEl.classList.add("submitted");
    submitBtn.disabled = true;

    statusBannerEl.className = "exam-status-banner info";
    statusBannerEl.textContent =
      "You already submitted this exam. Review only.";
    statusBannerEl.classList.remove("hidden");
  } else if (!state.submitted) {
    startTimer();
  }

  renderQuestionDots();
  renderQuestion();
}

// =====================================================
// BUTTON LISTENERS
// =====================================================

prevBtn.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    saveToStorage();
    renderQuestion();
    renderQuestionDots();
  }
});

nextBtn.addEventListener("click", () => {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex++;
    saveToStorage();
    renderQuestion();
    renderQuestionDots();
  }
});

submitBtn.addEventListener("click", () => {
  if (state.submitted) return;
  document.getElementById("confirmModal").classList.remove("hidden");
});

document.getElementById("confirmSubmit").addEventListener("click", () => {
  document.getElementById("confirmModal").classList.add("hidden");
  handleSubmitClick();
});

document.getElementById("cancelSubmit").addEventListener("click", () => {
  document.getElementById("confirmModal").classList.add("hidden");
});

reviewBtn.addEventListener("click", () => {
  resultModalEl.classList.add("hidden");
});

goBackBtn.addEventListener("click", () => {
  if (state.exam?.teacherId) {
    window.location.href = `./student-teacher-exams.html?teacherId=${state.exam.teacherId}`;
  } else {
    window.location.href = "./student-home.html";
  }
});

backToTeacherBtn.addEventListener("click", () => {
  if (state.exam?.teacherId) {
    window.location.href = `./student-teacher-exams.html?teacherId=${state.exam.teacherId}`;
  } else {
    window.history.back();
  }
});
