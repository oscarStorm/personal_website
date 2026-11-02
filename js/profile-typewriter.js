const profileTyping = document.getElementById("profile-typing");

const profileLines = [

  {
    text: "Interactive Portfolio & JavaScript Simulations",
    tag: "h3",
    className: "project-heading"
  },
"This portfolio is built with vanilla JavaScript, HTML and CSS.",
"The boids simulation explores flocking behaviour through separation, alignment and cohesion.",
"The worm simulation uses inverse kinematics to create procedural movement.",
"A Godot game runs in the browser using WebAssembly and WebGL.",
"A serverless analytics backend stores visitor data in a Neon PostgreSQL database.",
{
  prefix: "",
  text: "Personal website",
  href: "https://github.com/oscarStorm/personal_website",
  external: true
},
{
    text: "Booking System: Backend vs Database Logic",
    tag: "h3",
    className: "project-heading"
},
"I built two booking system prototypes in Python and MySQL to investigate where business logic should live.",
"Both share the same API, frontend and database schema; one implements the rules in Python, the other uses MySQL stored procedures and triggers.",
"I compared maintainability, data integrity, system complexity and response times.",
"There was no single best approach. I've linked to the report below if you'd like to read about the trade-offs",
{
  prefix: "",
  text: "Backend heavy system",
  href: "https://github.com/oscarStorm/backend_heavy",
  external: true
},
{
  prefix: "",
  text: "Database heavy system",
  href: "https://github.com/oscarStorm/database_heavy",
  external: true
},
{
  prefix: "",
  text: "Read the report (PDF, Danish)",
  href: "../documents/rapport.pdf",
  external: true
},
{
  text: "Particle Simulation in Rust",
  tag: "h3",
  className: "project-heading"
},
"A particle simulation built in Rust as a self-learning project to explore systems programming and improve my understanding of the language.",
"I've included it as one of the simulations on the site - it's under particles.",
{
  prefix: "",
  text: "Rust particle system",
  href: "https://github.com/oscarStorm/particle_system_RUST",
  external: true
},
];

const characterDelay = 1;
const delayBetweenLines = 1;

let lineIndex = 0;
let characterIndex = 0;
let currentLine;
let typingTarget;

function createLine() {
    const line = profileLines[lineIndex];

    currentLine = document.createElement(
      typeof line === "string" ? "span" : (line.tag ?? "span")
    );

    currentLine.className = "profile-line profile-line-current";

    if (typeof line !== "string" && line.className) {
      currentLine.classList.add(line.className);
    }
 
  if (typeof line === "string" || !line.href) {
    typingTarget = currentLine;
  } else {
    currentLine.append(document.createTextNode(line.prefix));

    const link = document.createElement("a");
    link.className = "profile-link";
    link.href = line.href;

    if (line.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    currentLine.append(link);
    typingTarget = link;
  }

  profileTyping.append(currentLine);
}

function typeProfile() {
  if (!currentLine) {
    createLine();
  }

  const line = profileLines[lineIndex];
  const text = typeof line === "string" ? line : line.text;
  characterIndex = Math.min(characterIndex + 2, text.length);
  typingTarget.textContent = text.substring(0, characterIndex);

  if (characterIndex < text.length) {
    setTimeout(typeProfile, characterDelay);
    return;
  }

  if (lineIndex === profileLines.length - 1) {
    return;
  }

  currentLine.classList.remove("profile-line-current");
  lineIndex += 1;
  characterIndex = 0;
  currentLine = null;
  setTimeout(typeProfile, delayBetweenLines);
}

typeProfile();
