/* ===================== NAVBAR (Injected) ===================== */

const navbar = `
<nav class="navbar">
  <div class="nav-container">

    <div class="nav-logo">
      <a href="./teacher-home.html">ExamPro</a>
    </div>

    <div class="nav-links">
      <a href="./teacher-home.html">Dashboard</a>
      <a href="./about-teacher.html">About</a>
      <a href="./contact-teacher.html">Contact</a>
    </div>

    <button id="themeToggle" class="theme-toggle-btn">🌙</button>

    <div class="user-menu" id="userMenu">
      <img id="teacherAvatar" class="user-avatar" src="../../assets/img/teacher-avatar.png" />

      <div class="dropdown hidden" id="userDropdown">
        <div class="dropdown-title">Teacher Account</div>
        <a href="./teacher-home.html">My Exams</a>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    </div>

    <div class="nav-toggle" id="navToggle">☰</div>

  </div>
</nav>

<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="sidebar" id="sidebarMenu">

  <div class="sidebar-header">
    <h3>Menu</h3>
    <span class="close-btn" id="sidebarClose">✖</span>
  </div>

  <a href="./teacher-home.html">Dashboard</a>
  <a href="./teacher-exams.html">My Exams</a>
  <a href="./teacher-students.html">Students</a>
  <a href="./about-teacher.html">About</a>
  <a href="./contact-teacher.html">Contact</a>

  <hr />

  <button id="sideLogout" class="logout-btn">Logout</button>
</div>
`;

document.getElementById("navbar").innerHTML = navbar;

/* ===================== THEME LOGIC ===================== */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const btn = document.getElementById("themeToggle");
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

applyTheme(localStorage.getItem("theme") || "light");

document.getElementById("themeToggle").addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
});

/* ===================== SIDEBAR ===================== */

const sidebar = document.getElementById("sidebarMenu");
const overlay = document.getElementById("sidebarOverlay");

document.getElementById("navToggle").addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

document.getElementById("sidebarClose").addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

/* -------------------- DROPDOWN (FIXED) -------------------- */
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");

userMenu?.addEventListener("click", (e) => {
  e.stopPropagation();
  userDropdown.classList.toggle("show");
});

document.addEventListener("click", () => {
  userDropdown.classList.remove("show");
});

userDropdown?.addEventListener("click", (e) => e.stopPropagation());

/* ===================== LOGOUT ===================== */

import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";

function logoutNow() {
  signOut(auth)
    .then(() => (window.location.href = "./login.html"))
    .catch((e) => console.error(e));
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutNow);
  document.getElementById("sideLogout")?.addEventListener("click", logoutNow);
});
