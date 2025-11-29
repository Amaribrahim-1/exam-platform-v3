const app = document.getElementById("app");

// Dummy data for UI
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

// Main container
const container = document.createElement("div");
container.className = "profile-container";

// Build inner HTML
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
      <h1 id="profile-name">${data.name}</h1>
      <p id="profile-role">${data.role}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Birthday:</strong> ${data.birthdate}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Website:</strong> <a href="${data.website}" target="_blank">${
  data.website
}</a></p>
      ${
        data.skills
          ? `<p><strong>Skills:</strong> ${data.skills.join(", ")}</p>`
          : ""
      }
    </div>
  </div>

  <div class="profile-bio">
    <textarea id="bio" placeholder="Write something about yourself...">${
      data.bio
    }</textarea>
    <button id="saveBtn">Save Profile</button>
  </div>
`;

app.appendChild(container);

// Cache elements
const bioInput = container.querySelector("#bio");
const saveBtn = container.querySelector("#saveBtn");
const photoWrapper = container.querySelector(".photo-wrapper");
const overlay = photoWrapper.querySelector(".photo-overlay");

// Hover animation for overlay
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

// Save button action (dummy)
saveBtn.addEventListener("click", () => {
  alert(`Profile updated successfully!\nNew bio: ${bioInput.value}`);
});
