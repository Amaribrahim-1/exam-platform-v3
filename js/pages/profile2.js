document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return console.error("App div not found");

  // Dummy data
  const data = {
    name: "John Doe",
    role: "Teacher",
    photoURL: "../../assets/img/ibrahim.jpg",
    email: "john@example.com",
    phone: "0123456789",
    birthdate: "1990-01-01",
    address: "Cairo",
    website: "https://example.com",
    linkedin: "https://linkedin.com",
    skills: ["JavaScript", "CSS", "HTML"],
    bio: "This is a sample bio for the user profile.",
  };

  let isEditing = false;

  // Main container
  const container = document.createElement("div");
  container.className = "profile-container";
  app.appendChild(container);

  // Render profile
  function renderProfile() {
    container.innerHTML = `
      <div class="profile-header">
        <div class="photo-wrapper">
          <img id="profile-photo" src="${data.photoURL}" alt="Profile Photo">
          ${
            data.linkedin
              ? `<div class="photo-overlay"><a href="${data.linkedin}" target="_blank">Learn More</a></div>`
              : ""
          }
        </div>
        <div class="profile-info">
          <div class="header-actions">
            <h1 id="profile-name">${data.name}</h1>
            <button id="editToggleBtn" class="edit-toggle-btn">${
              isEditing ? "Cancel" : "Edit Profile"
            }</button>
          </div>

          ${
            isEditing
              ? `<div class="edit-fields">
                  <div class="form-group">
                    <label>Full Name:</label>
                    <input type="text" id="edit-name" value="${
                      data.name
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Role:</label>
                    <input type="text" id="edit-role" value="${
                      data.role
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="edit-email" value="${
                      data.email
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Phone:</label>
                    <input type="tel" id="edit-phone" value="${
                      data.phone
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Birthday:</label>
                    <input type="date" id="edit-birthdate" value="${
                      data.birthdate
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Address:</label>
                    <input type="text" id="edit-address" value="${
                      data.address
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Website:</label>
                    <input type="url" id="edit-website" value="${
                      data.website
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>LinkedIn:</label>
                    <input type="url" id="edit-linkedin" value="${
                      data.linkedin
                    }" class="edit-input">
                  </div>
                  <div class="form-group">
                    <label>Skills (comma separated):</label>
                    <input type="text" id="edit-skills" value="${data.skills.join(
                      ", "
                    )}" class="edit-input">
                  </div>
                </div>`
              : `<p id="profile-role" class="role-badge">${data.role}</p>
                 <p><strong>Email:</strong> ${data.email}</p>
                 <p><strong>Phone:</strong> ${data.phone}</p>
                 <p><strong>Birthday:</strong> ${data.birthdate}</p>
                 <p><strong>Address:</strong> ${data.address}</p>
                 <p><strong>Website:</strong> <a href="${
                   data.website
                 }" target="_blank">${data.website}</a></p>
                 ${
                   data.skills
                     ? `<p><strong>Skills:</strong> ${data.skills.join(
                         ", "
                       )}</p>`
                     : ""
                 }`
          }
        </div>
      </div>

      <div class="profile-bio">
        <h3>About Me</h3>
        ${
          isEditing
            ? `<textarea id="bio" placeholder="Write something about yourself...">${data.bio}</textarea>
               <div class="action-buttons">
                 <button id="saveBtn" class="btn-save">Save Changes</button>
               </div>`
            : `<div class="bio-display">${data.bio}</div>`
        }
      </div>

      <!-- Stats Section -->
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-number">24</span>
          <span class="stat-label">Exams Created</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">156</span>
          <span class="stat-label">Students</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">4.8</span>
          <span class="stat-label">Rating</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">12</span>
          <span class="stat-label">Active Exams</span>
        </div>
      </div>
    `;

    attachEventListeners();
  }

  function attachEventListeners() {
    const editToggleBtn = container.querySelector("#editToggleBtn");
    const saveBtn = container.querySelector("#saveBtn");

    if (editToggleBtn) editToggleBtn.addEventListener("click", toggleEditMode);
    if (saveBtn) saveBtn.addEventListener("click", saveProfile);

    // Hover overlay
    const photoWrapper = container.querySelector(".photo-wrapper");
    const overlay = photoWrapper?.querySelector(".photo-overlay");
    if (overlay) {
      photoWrapper.addEventListener(
        "mouseenter",
        () => (overlay.style.opacity = "1")
      );
      photoWrapper.addEventListener(
        "mouseleave",
        () => (overlay.style.opacity = "0")
      );
    }
  }

  function toggleEditMode() {
    isEditing = !isEditing;
    renderProfile();
  }

  function saveProfile() {
    data.name = document.getElementById("edit-name").value;
    data.role = document.getElementById("edit-role").value;
    data.email = document.getElementById("edit-email").value;
    data.phone = document.getElementById("edit-phone").value;
    data.birthdate = document.getElementById("edit-birthdate").value;
    data.address = document.getElementById("edit-address").value;
    data.website = document.getElementById("edit-website").value;
    data.linkedin = document.getElementById("edit-linkedin").value;
    data.skills = document
      .getElementById("edit-skills")
      .value.split(",")
      .map((skill) => skill.trim());
    data.bio = document.getElementById("bio").value;

    alert("Profile updated successfully!");
    isEditing = false;
    renderProfile();
  }

  // Initial render
  renderProfile();
});
