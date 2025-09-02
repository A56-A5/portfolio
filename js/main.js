const inputArea = document.getElementById("input");
const cursor = document.querySelector(".cursor");

function updateCursor() {
  const text = inputArea.value;

  // create a hidden span to measure text width
  const measurer = document.createElement("span");
  measurer.style.visibility = "hidden";
  measurer.style.position = "absolute";
  measurer.style.whiteSpace = "pre";
  measurer.style.font = getComputedStyle(inputArea).font;
  measurer.textContent = text.replace(/ /g, "\u00A0"); // preserve spaces
  document.body.appendChild(measurer);

  const width = measurer.offsetWidth;
  measurer.remove();

  cursor.style.left = inputArea.offsetLeft + width + "px";
  cursor.style.top = inputArea.offsetTop + "px";
}

// Update cursor whenever input changes or user types
inputArea.addEventListener("input", updateCursor);
inputArea.addEventListener("focus", updateCursor);
window.addEventListener("resize", updateCursor);

// Run once at start
updateCursor();

const output = document.getElementById("output");
const terminal = document.getElementById("terminal");
const inputLine = document.getElementById("input-line");

const helpText = `
<span class="category">Core</span>
  <span class="cmd">help</span>       <span class="desc">Show this help message</span><br>
  <span class="cmd">ls</span>         <span class="desc">List available sections</span><br>
  <span class="cmd">pwd</span>        <span class="desc">Show current directory</span><br>
  <span class="cmd">clear</span>      <span class="desc">Clear terminal screen</span><br><br>
<span class="category">Portfolio</span>
  <span class="cmd">cat about</span>          <span class="desc">Open About Me</span><br>
  <span class="cmd">cat projects</span>       <span class="desc">Show Projects folder</span><br>
  <span class="cmd">cat achievements</span>   <span class="desc">Open Achievements</span><br>
  <span class="cmd">cat contact</span>        <span class="desc">Open Contact</span><br>
  <span class="cmd">cat portfolio</span>      <span class="desc">Open File Explorer</span><br>
`;

document.addEventListener("keydown", function(e) {
  if (inputLine.classList.contains("hidden")) return;

  if (e.key === "Enter") {
    const cmd = inputArea.value.trim();
    const commandLine = document.createElement("div");
    commandLine.innerHTML = `<span class="prompt">alvi@portfolio:/$</span> ${cmd}`;
    output.appendChild(commandLine);
    inputLine.classList.add("hidden");

    if (cmd === "clear") {
      output.innerHTML = "";
      showPrompt();

    } else if (cmd === "pwd") {
      typeOutput("/home/alvi/portfolio", showPrompt);

    } else if (cmd === "help") {
      typeOutput(helpText, showPrompt, true);

    } else if (cmd === "ls") {
      typeOutput("about  projects  achievements  contact", showPrompt);

    } else if (cmd === "cat about") {
      createWindow("About", portfolioContent.about);
      showPrompt();

    } else if (cmd === "cat projects") {
      openProjectsExplorer();
      showPrompt();

    } else if (cmd === "cat achievements") {
      createWindow("Achievements", portfolioContent.achievements);
      showPrompt();

    } else if (cmd === "cat contact") {
      createWindow("Contact", portfolioContent.contact);
      showPrompt();

    } else if (cmd === "cat portfolio") {
      openPortfolioExplorer();
      showPrompt();

    } else {
      if (cmd !== "")
        typeOutput(`Command not found: ${cmd}`, showPrompt);
      else showPrompt();
    }

    inputArea.value = "";
    terminal.scrollTop = terminal.scrollHeight;
    e.preventDefault();
  }
});

function typeOutput(html, callback, isHelp = false) {
  const container = document.createElement("div");
  container.style.whiteSpace = "pre-wrap";
  if (isHelp) container.classList.add("help-output");
  output.appendChild(container);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const nodes = Array.from(tempDiv.childNodes);
  let speed = 5;
  let nodeIndex = 0;

  function typeNode() {
    if (nodeIndex >= nodes.length) {
      if (callback) setTimeout(callback, 300);
      return;
    }

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      let chars = node.textContent.split("");
      let i = 0;
      function typeChar() {
        if (i < chars.length) {
          container.append(chars[i]);
          i++;
          setTimeout(typeChar, 15 + Math.random() * speed); 
        } else {
          nodeIndex++;
          typeNode();
        }
      }
      typeChar();

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const span = document.createElement(node.tagName.toLowerCase());
      if (node.className) span.className = node.className;
      container.appendChild(span);

      let chars = node.textContent.split("");
      let i = 0;
      function typeChar() {
        if (i < chars.length) {
          span.append(chars[i]);
          i++;
          setTimeout(typeChar, 15 + Math.random() * speed);
        } else {
          nodeIndex++;
          typeNode();
        }
      }
      typeChar();
    } else {
      nodeIndex++;
      typeNode();
    }
  }

  typeNode();
}


function showPrompt() {
  inputLine.classList.remove("hidden");
  inputArea.focus();
  terminal.scrollTop = terminal.scrollHeight;
}

// 🔹 File Explorer for Portfolio
function openPortfolioExplorer() {
  let explorer = `
    <div class="file-grid">
      <div class="file" onclick="createWindow('About', portfolioContent.about)">
        <img src="icons/about.png" class="file-icon"><br>about
      </div>
      <div class="file" onclick="openProjectsExplorer()">
        <img src="icons/folder.png" class="file-icon"><br>projects
      </div>
      <div class="file" onclick="createWindow('Achievements', portfolioContent.achievements)">
        <img src="icons/achievements.png" class="file-icon"><br>achievements
      </div>
      <div class="file" onclick="createWindow('Contact', portfolioContent.contact)">
        <img src="icons/contact.png" class="file-icon"><br>contact
      </div>
    </div>
  `;
  createWindow("Portfolio", explorer);
}

// 🔹 Projects folder explorer
function openProjectsExplorer() {
  let projExplorer = `<div class="file-grid">`;
  portfolioContent.projects.forEach((p, i) => {
    projExplorer += `
      <div class="file" onclick="openProject(${i})">
        <img src="icons/project.png" class="file-icon"><br>${p.name}
      </div>
    `;
  });
  projExplorer += `</div>`;
  createWindow("Projects", projExplorer);
}

// Open individual project
function openProject(index) {
  const proj = portfolioContent.projects[index];
  createWindow(proj.name, proj.content);
}
