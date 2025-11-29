import { auth } from "../firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";

// ==================== NAVBAR TEMPLATE ====================
const navbarHTML = `
<header class="navbar">
  <div class="nav-container">

    <div class="nav-logo" onclick="location.href='student-home.html'">
      <span>ExamPro</span>
    </div>

    <nav class="nav-links">
      <a href="student-home.html">Home</a>
      <a href="my-exams.html">My Exams</a>
      <a href="about-student.html">About</a>
      <a href="contact-student.html">Contact</a>
    </nav>

    <!-- Theme Toggle -->
    <button id="themeToggle" class="theme-toggle-btn" aria-label="Toggle Theme">🌙</button>

    <div class="nav-right">

      <!-- Auth Buttons -->
      <div id="authButtons" class="auth-buttons">
        <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
        <button class="btn-register" onclick="window.location.href='register.html'">Register</button>
      </div>
  
      <!-- User Avatar -->
      <div id="userMenu" class="user-menu">
        <img id="userAvatar" class="user-avatar" src="../../assets/img/student-avatar.png">

        <div id="dropdownMenu" class="dropdown hidden">
          <p class="dropdown-title">Student Account</p>
          <a href="my-exams.html">My Exams</a>
          <button id="logoutBtn" class="logout-btn">Logout</button>
        </div>
      </div>

      <!-- Burger -->
      <div class="nav-toggle" id="navToggle">☰</div>

    </div>
  </div>
</header>

<!-- Sidebar -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<div class="sidebar" id="sidebar">

  <div class="sidebar-header">
    <span class="sidebar-title">Menu</span>
    <span id="closeSidebar" class="close-btn">✕</span>
  </div>

  <a href="student-home.html">Home</a>
  <a href="exams.html">Exams</a>
  <a href="teachers.html">Teachers</a>
  <a href="profile.html">Profile</a>

  <hr/>

  <!-- IF NOT LOGGED IN -->
  <div id="sidebarAuth" class="sidebar-section">
      <button class="sidebar-btn" onclick="window.location.href='login.html'">Login</button>
      <button class="sidebar-btn" onclick="window.location.href='register.html'">Register</button>
  </div>

  <!-- IF LOGGED IN -->
  <div id="sidebarUser" class="sidebar-section hidden">
      <button class="sidebar-btn" onclick="window.location.href='profile.html'">Profile</button>
      <button class="sidebar-btn" onclick="window.location.href='my-exams.html'">My Exams</button>
      <button id="sidebarLogout" class="sidebar-btn logout-btn">Logout</button>
  </div>
</div>
`;

// Inject navbar
document.getElementById("navbar").innerHTML = navbarHTML;

// ============= ELEMENTS =============
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebarOverlay");
const openBtn = document.getElementById("navToggle");
const closeBtn = document.getElementById("closeSidebar");

const userMenuBox = document.getElementById("userMenu");
const dropdownMenu = document.getElementById("dropdownMenu");

const authButtons = document.getElementById("authButtons");
const sidebarAuth = document.getElementById("sidebarAuth");
const sidebarUser = document.getElementById("sidebarUser");

// ============= SIDEBAR =============
openBtn.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("show");
});

function closeSidebarFn() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

overlay.addEventListener("click", closeSidebarFn);
closeBtn.addEventListener("click", closeSidebarFn);

// ============= DROPDOWN =============
userMenuBox?.addEventListener("click", () => {
  if (auth.currentUser) {
    dropdownMenu.classList.toggle("hidden");
  }
});

document.addEventListener("click", (e) => {
  if (!userMenuBox.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
  }
});

// ============= AUTH STATE =============
onAuthStateChanged(auth, (user) => {
  if (user) {
    authButtons.style.display = "none";
    userMenuBox.style.display = "flex";

    sidebarAuth.classList.add("hidden");
    sidebarUser.classList.remove("hidden");
  } else {
    authButtons.style.display = "flex";
    userMenuBox.style.display = "none";

    sidebarAuth.classList.remove("hidden");
    sidebarUser.classList.add("hidden");
  }
});

// ============= LOGOUT =============
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  signOut(auth).then(() => (window.location.href = "login.html"));
});

document.getElementById("sidebarLogout")?.addEventListener("click", () => {
  signOut(auth).then(() => (window.location.href = "login.html"));
});

// ============= THEME LOGIC =============
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "light";
  applyTheme(saved);
}

initTheme();

document.getElementById("themeToggle")?.addEventListener("click", () => {
  const current = localStorage.getItem("theme") || "light";
  const newTheme = current === "light" ? "dark" : "light";
  applyTheme(newTheme);
});
