const profileTyping = document.getElementById("profile-typing");

const profileLines = [
"My name is Oscar Storm, and I'm a Computer Science student at Zealand.",
"I'm particularly interested in backend development, systems programming, low-level programming and Linux.",
"",
"Outside my studies, I work on independent software projects to deepen my understanding of software architecture, algorithms, and how systems work under the hood.",
"Technologies I've worked with include:",
"Python, JavaScript, SQL, Java, C#, Rust, Docker, Bash and Linux",
"",
"Projects:",
"1.",
"This website is built with vanilla JavaScript. The boids and worm simulations are written in pure JavaScript.",
"The boids page explore a flocking algorithm.",
"The worm page explore procedural animation using inverse kinematics.",
"It uses WASM to run the Godot game and WebGL to render the graphics.",
"The site also has a serverless analytics backend that stores visitor data in a Neon PostgreSQL database.",
{
  prefix: "",
  text: "Personal website",
  href: "https://github.com/oscarStorm/personal_website",
  external: true
},
"2.",
"I built two implementations of the same booking system, one backend-heavy and one database-heavy, and compared their performance through latency testing.",
"The goal was to better understand where business logic should live and the trade-offs between the two architectural approaches.",
"The conclusion? It depends.",
"Implemented with Python and MySQL.",
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
"3.",
"A particle simulation built in Rust as a self-learning project to explore systems programming and improve my understanding of the language",
"I've included it as one of the simulations on the site - it's under particles",
{
  prefix: "",
  text: "Rust particle system",
  href: "https://github.com/oscarStorm/particle_system_RUST",
  external: true
},
"",
"Outside of studies, I enjoy playing tennis, chess and tinkering with my arch-config",
"",
"I'm currently looking for student positions in software development, particularly within backend and systems development.",
"Contact information:",
{
  prefix: "Email: ",
  text: "oscar.emil.storm@gmail.com",
  href: "mailto:oscar.emil.storm@gmail.com"
},
{
  prefix: "GitHub: ",
  text: "github.com/oscarStorm",
  href: "https://github.com/oscarStorm",
  external: true
},
"Phone: +45 53535623"
];

const characterDelay = 1;
const delayBetweenLines = 1;

let lineIndex = 0;
let characterIndex = 0;
let currentLine;
let typingTarget;

function createLine() {
  const line = profileLines[lineIndex];
  currentLine = document.createElement("span");
  currentLine.className = "profile-line profile-line-current";

  if (typeof line === "string") {
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
