// ==================== FOOTER COMPONENT ====================

const footerHTML = `
<footer class="footer">
  <div class="footer-container">

    <div class="footer-about">
      <h3>Exam Platform</h3>
      <p>A modern system for managing online exams and student performance.</p>
    </div>

    <div class="footer-links">
      <h4>Quick Links</h4>
      <a href="student-home.html">Home</a>
      <a href="exams.html">Exams</a>
      <a href="teachers.html">Teachers</a>
      <a href="contact.html">Contact</a>
    </div>

    <div class="footer-contact">
      <h4>Contact</h4>
      <p>Email: ibrahimabdullaziz55@gmail.com</p>
      <p>Phone: +20 1024642180</p>
    </div>

  </div>

  <div class="footer-bottom">
    © 2025 Exam Platform — All rights reserved.
  </div>
</footer>
`;

// Inject footer into page
document.getElementById("footer").innerHTML = footerHTML;
