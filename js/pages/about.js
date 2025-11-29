// about.js
const app = document.getElementById("app");

// Team Members Data
const teamMembers = [
  {
    name: "Ammar Ibrahim",
    title: "MERN Stack Developer",
    image: "../../assets/img/ammar.jpg",
    linkedin: "https://www.linkedin.com/in/amar-ibrahim-47961938a",
    description:
      "Ammar is a passionate MERN Stack developer who enjoys building dynamic, scalable, and high-performance applications. He specializes in creating seamless user experiences and writing clean, efficient code.",
  },
  {
    name: "Omar Gamal",
    title: "MERN Stack Developer",
    image: "../../assets/img/omar2.jpg",
    linkedin: "https://www.linkedin.com/in/omar-gamal-8b1222354",
    description:
      "Omar is a MERN Stack developer with a strong focus on performance, scalability, and maintainable architecture. He loves building full-stack applications with smooth user experiences.",
  },
  {
    name: "Ibrahim Elenany",
    title: "Frontend Developer",
    image: "../../assets/img/hema1.jpg",
    linkedin: "https://www.linkedin.com/in/ibrahim-elanany",
    description:
      "Ibrahim specializes in crafting visually appealing and responsive user interfaces. He brings creativity and precision to every project, turning ideas into modern interactive web experiences.",
  },
  {
    name: "Mohammed Hamdy",
    title: "Mobile App Developer",
    image: "../../assets/img/hamdy.jpg",
    linkedin: "https://www.linkedin.com/in/mohamed-hamdy-75b356288",
    description:
      "Hamdy is a dedicated mobile developer with experience in building smooth, intuitive apps. His focus is delivering the best user journey with clean UI and optimized performance.",
  },
  {
    name: "Ahmed Ashraf",
    title: "Frontend Developer",
    image: "../../assets/img/eldoksh.png",
    linkedin: "http://www.linkedin.com/in/ahmed-ashraf",
    description:
      "Ahmed is a creative frontend developer who specializes in UI animations and clean layouts. He enjoys transforming designs into pixel-perfect interfaces using modern JavaScript frameworks.",
  },
  {
    name: "Ali Gomaa",
    title: "Data Analyst",
    image: "../../assets/img/ali.jpg",
    linkedin: "https://www.linkedin.com/in/ali-gomaa-a73a23308",
    description:
      "Ali collects, processes, and analyzes data to extract meaningful insights. He works on improving decision-making processes by building accurate models and clear visualizations.",
  },
  {
    name: "Ibrahim Abdullaziz",
    title: "Backend Developer",
    image: "../../assets/img/ibrahim2.png",
    linkedin: "http://www.linkedin.com/in/ibrahim-abdullaziz-894035339",
    description:
      "Ibrahim focuses on backend engineering, designing reliable APIs, and optimizing server-side performance. His strong understanding of system architecture makes him the backbone of any technical team.",
  },
];

// Create Main Container
const container = document.createElement("div");
container.className = "about-container";

// Title
const title = document.createElement("h1");
title.textContent = "Our Team";
title.className = "about-title";
container.appendChild(title);

// Introduction
const intro = document.createElement("p");
intro.textContent =
  "We are Team Meagtrons, passionate about creating innovative digital solutions. Our mission is to deliver the best user experience through our diverse projects. Meet our team members below.";
intro.className = "about-intro";
container.appendChild(intro);

// Team Grid
const teamGrid = document.createElement("div");
teamGrid.className = "team-grid";

// Create Cards
teamMembers.forEach((member, index) => {
  const card = document.createElement("div");
  card.className = "team-card";
  card.style.animationDelay = `${index * 0.15}s`;

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "img-wrapper";

  const img = document.createElement("img");
  img.src = member.image;
  img.alt = member.name;

  const overlay = document.createElement("div");
  overlay.className = "img-overlay";
  overlay.innerHTML = `
    <a href="${member.linkedin}" target="_blank" class="learn-more">
      Learn More →
    </a>
  `;

  imgWrapper.appendChild(img);
  imgWrapper.appendChild(overlay);

  const name = document.createElement("h3");
  name.textContent = member.name;
  name.className = "team-name animated-text";

  const role = document.createElement("p");
  role.textContent = member.title;
  role.className = "team-role animated-text";

  const desc = document.createElement("p");
  desc.textContent = member.description;
  desc.className = "team-desc animated-text";

  const linkDiv = document.createElement("div");
  linkDiv.className = "team-link";

  linkDiv.innerHTML = `
    <a href="${member.linkedin}" target="_blank">
      <svg viewBox="0 0 24 24">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6C1.12 6 0 4.88 0 3.5C0 2.12 1.12 1 2.5 1C3.86 1 4.98 2.12 4.98 3.5ZM0.22 23.5H4.78V7.98H0.22V23.5ZM7.48 7.98H12V10.22H12.06C12.76 8.92 14.42 7.56 16.94 7.56C22.14 7.56 23 10.86 23 15.22V23.5H18.44V16.22C18.44 14.08 18.4 11.36 15.44 11.36C12.44 11.36 12 13.72 12 16.06V23.5H7.48V7.98Z"/>
      </svg>
      LinkedIn
    </a>
  `;

  card.appendChild(imgWrapper);
  card.appendChild(name);
  card.appendChild(role);
  card.appendChild(desc);
  card.appendChild(linkDiv);

  teamGrid.appendChild(card);
});

// Add Grid to Container
container.appendChild(teamGrid);

// Append to DOM
app.appendChild(container);
