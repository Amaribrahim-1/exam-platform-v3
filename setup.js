// setup.js
import fs from "fs";
import path from "path";

// Helper: create folder if not exists
function makeDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper: create empty file
function makeFile(filePath, content = "") {
  fs.writeFileSync(filePath, content);
}

// ==============================
// PROJECT STRUCTURE
// ==============================

const pages = [
  "index.html",
  "register.html",
  "student-home.html",
  "teacher-home.html",
  "exams.html",
  "exam-solve.html",
  "add-exam.html",
  "add-questions.html",
  "profile.html",
  "about.html",
  "contact.html",
];

const pageScripts = [
  "login.js",
  "register.js",
  "student-home.js",
  "teacher-home.js",
  "exams.js",
  "exam-solve.js",
  "add-exam.js",
  "add-questions.js",
  "profile.js",
  "about.js",
  "contact.js",
];

function htmlTemplate(pageScript) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Exam Platform</title>
  <link rel="stylesheet" href="./assets/css/style.css" />
</head>
<body>

  <div id="app"></div>

  <script type="module" src="./js/pages/${pageScript}"></script>
</body>
</html>
`.trim();
}

// ==============================
// START BUILDING STRUCTURE
// ==============================
console.log("🚀 Building Project Structure...");

// Create folders
makeDir("assets/css");
makeDir("assets/img");
makeDir("js/pages");

// Main JS service files
makeFile("js/firebase.js");
makeFile("js/auth.js");
makeFile("js/user.js");
makeFile("js/guard.js");
makeFile("js/student.js");
makeFile("js/teacher.js");

// Style file
makeFile("assets/css/style.css", "/* Global styles */");

// Create HTML pages
pages.forEach((file, i) => {
  const html = htmlTemplate(pageScripts[i] || "login.js");
  makeFile(file, html);
});

// Create empty page scripts
pageScripts.forEach((file) => {
  makeFile(`js/pages/${file}`, `// ${file} script`);
});

console.log("✅ Done! All files and folders created successfully!");
