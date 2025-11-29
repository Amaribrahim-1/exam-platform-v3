// contact.js (module)
// Builds a fullscreen contact landing with glass form, map, whatsapp button

const app = document.getElementById("app");

// Root wrap
const landing = document.createElement("section");
landing.className = "contact-landing";

// main wrapper
const wrap = document.createElement("div");
wrap.className = "contact-wrap";

// left: form card
const formCard = document.createElement("div");
formCard.className = "contact-card";

// header
const h1 = document.createElement("h1");
h1.className = "contact-title";
h1.textContent = "Contact Us";

const sub = document.createElement("p");
sub.className = "contact-sub";
sub.textContent =
  "We’d love to hear from you. Send a message and we’ll respond within 24 hours.";

// form
const form = document.createElement("form");
form.className = "contact-form";
form.id = "contact-form";

// row inputs
const row1 = document.createElement("div");
row1.className = "form-row";

const nameInput = document.createElement("input");
nameInput.className = "form-input";
nameInput.id = "contact-name";
nameInput.placeholder = "Your Name";
nameInput.type = "text";

const emailInput = document.createElement("input");
emailInput.className = "form-input";
emailInput.id = "contact-email";
emailInput.placeholder = "Your Email";
emailInput.type = "email";

row1.appendChild(nameInput);
row1.appendChild(emailInput);

// subject
const subjectInput = document.createElement("input");
subjectInput.className = "form-input";
subjectInput.id = "contact-subject";
subjectInput.placeholder = "Subject";

// message
const messageInput = document.createElement("textarea");
messageInput.className = "form-textarea";
messageInput.id = "contact-message";
messageInput.placeholder = "Your message...";

// submit + status
const rowBtn = document.createElement("div");
rowBtn.style.display = "flex";
rowBtn.style.alignItems = "center";
rowBtn.style.gap = "12px";

const submitBtn = document.createElement("button");
submitBtn.className = "form-btn";
submitBtn.type = "submit";
submitBtn.textContent = "Send Message";

const status = document.createElement("div");
status.id = "contact-status";
status.className = "status";

rowBtn.appendChild(submitBtn);
rowBtn.appendChild(status);

// append to form
form.appendChild(row1);
form.appendChild(subjectInput);
form.appendChild(messageInput);
form.appendChild(rowBtn);

// small meta (email / phone)
const meta = document.createElement("div");
meta.className = "contact-meta";
meta.innerHTML = `
  <div class="office-card">📍 Kafr El-Shiekh, Egypt</div>
  <div class="office-card">✉️ ibrahimabdullaziz55@gmail.com</div>
  <div class="office-card">📞 +20 1024642180</div>
`;

// assemble left
formCard.appendChild(h1);
formCard.appendChild(sub);
formCard.appendChild(form);
formCard.appendChild(meta);

// right: map card
const mapCard = document.createElement("div");
mapCard.className = "map-card";

// choose coordinates/place — replace with your coordinates if needed
const mapIframe = document.createElement("iframe");
mapIframe.className = "map-iframe";
mapIframe.loading = "lazy";
mapIframe.referrerPolicy = "no-referrer-when-downgrade";
mapIframe.src =
  "https://www.google.com/maps?q=31.1091,30.9426&z=15&output=embed";

// assemble right
mapCard.appendChild(mapIframe);

// append both cards into wrapper
wrap.appendChild(formCard);
wrap.appendChild(mapCard);

// append wrapper to landing
landing.appendChild(wrap);
document.body.style.margin = "0";
app.appendChild(landing);

// WhatsApp floating button
const waBtn = document.createElement("a");
waBtn.className = "whatsapp-btn";
waBtn.href =
  "https://wa.me/201024642180?text=" +
  encodeURIComponent(
    "Hello Team megatrons, I want to contact you regarding..."
  );
waBtn.target = "_blank";
waBtn.innerHTML = `
  <svg viewBox="0 0 24 24"><path d="M20.52 3.48A11.86 11.86 0 0012.06.25 11.9 11.9 0 001.5 11.9c0 2.1.55 4.16 1.6 6L.75 23.25l5.5-1.45a11.86 11.86 0 006.86 2.02h.01c6.62 0 11.99-5.36 11.99-11.99 0-3.2-1.25-6.2-3.59-8.35zM12.06 21.25a9.4 9.4 0 01-5.08-1.43l-.36-.22-3.27.86.87-3.19-.23-.36A9.31 9.31 0 012.6 11.9 9.38 9.38 0 1112.06 21.25zM17.1 14.34c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.57.75-.7.9-.13.15-.26.17-.49.06-.23-.12-1-0.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.62-.13-.23 0-.35.09-.47.09-.09.23-.26.35-.39.12-.13.16-.22.25-.37.09-.15.04-.28-.02-.39-.06-.12-.51-1.24-.7-1.7-.18-.47-.37-.4-.51-.41l-.44-.01c-.15 0-.39.06-.59.28-.2.22-.76.74-.76 1.8 0 1.06.78 2.08.89 2.22.12.15 1.53 2.42 3.72 3.39 2.2.97 2.2.65 2.6.61.4-.04 1.36-.55 1.55-1.09.19-.54.19-1.01.13-1.1-.06-.09-.23-.14-.46-.26z"/></svg>
  <span>WhatsApp</span>
`;
document.body.appendChild(waBtn);

/* ===================== Form Validation & Behavior ===================== */

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.textContent = "";
  status.className = "status";

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!name || !email || !message) {
    status.textContent = "Please fill required fields.";
    status.classList.add("error");
    return;
  }
  if (!validateEmail(email)) {
    status.textContent = "Please enter a valid email.";
    status.classList.add("error");
    return;
  }

  // Simulate sending — replace with API call when ready
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
    status.textContent =
      "Message sent successfully. We'll reply within 24 hours.";
    status.classList.remove("error");
    status.classList.add("success");
    form.reset();
  }, 1100);
});

/* Optional: Nice entrance animation for form fields (stagger) */
const inputs = [nameInput, emailInput, subjectInput, messageInput, submitBtn];
inputs.forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(8px)";
  setTimeout(() => {
    el.style.transition = "all .5s cubic-bezier(.2,.9,.2,1)";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, 300 + i * 80);
});
