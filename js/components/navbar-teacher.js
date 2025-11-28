// ========== TEACHER NAVBAR (Injected) ==========

const navbar = `
<nav class="navbar">
  <div class="nav-container">

    <!-- Logo -->
    <div class="nav-logo">
      <a href="./teacher-home.html">ExamPro</a>
    </div>

    <!-- Links -->
    <div class="nav-links">
      <a href="./teacher-home.html">Dashboard</a>
      <a href="./teacher-exams.html">My Exams</a>
      <a href="./teacher-students.html">Students</a>
      <a href="./about.html">About</a>
      <a href="./contact.html">Contact</a>
    </div>

    <!-- User Menu -->
    <div class="user-menu" id="userMenu">
      <img id="teacherAvatar" class="user-avatar" src="../../assets/img/no-profile-photo.webp" />
      <div class="dropdown hidden" id="userDropdown">
        <div class="dropdown-title">Teacher Account</div>

        <a href="./teacher-profile.html">Profile</a>
        <a href="./teacher-exams.html">My Exams</a>

        <button class="logout-btn" id="logoutBtn">Logout</button>
      </div>
    </div>

    <!-- Mobile icon -->
    <div class="nav-toggle" id="navToggle">☰</div>

  </div>
</nav>

<!-- Sidebar -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="sidebar" id="sidebarMenu">
  <div class="sidebar-header">
    <h3>Menu</h3>
    <span class="close-btn" id="sidebarClose">✖</span>
  </div>

  <a href="./teacher-home.html">Dashboard</a>
  <a href="./teacher-exams.html">My Exams</a>
  <a href="./teacher-students.html">Students</a>
  <a href="./about.html">About</a>
  <a href="./contact.html">Contact</a>

  <hr />

  <button id="sideLogout" class="logout-btn">Logout</button>
</div>
`;

document.getElementById("navbar").innerHTML = navbar;

// ========== INTERACTIVITY ==========

// Sidebar
const toggle = document.getElementById("navToggle");
const sidebar = document.getElementById("sidebarMenu");
const overlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");

toggle.onclick = () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
};
sidebarClose.onclick = () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
};
overlay.onclick = () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
};

// Dropdown
const userMenu = document.getElementById("userMenu");
const userDropdown = document.getElementById("userDropdown");

userMenu.onclick = () => {
  userDropdown.classList.toggle("hidden");
};

// Logout (Firebase)
import { logoutUser } from "../auth.js";

document.getElementById("logoutBtn").onclick = logoutUser;
document.getElementById("sideLogout").onclick = logoutUser;
