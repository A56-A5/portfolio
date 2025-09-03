// js/main.js
// Main terminal logic — works with the existing content.js (portfolioContent)

const inputArea = document.getElementById("input");
const cursor = document.querySelector(".cursor");
const output = document.getElementById("output");
const terminal = document.getElementById("terminal");
const inputLine = document.getElementById("input-line");
const asciiBanner = document.querySelector(".ascii-banner");
const welcomeText = document.querySelector(".welcome-text");

const commands = [
  "help",
  "ls",
  "pwd",
  "cd",
  "cat",
  "clear",
  "portfolio",
  "about",
  "projects",
  "achievements",
  "contact",
  "resume",
  "exit",
  "logout",
  "whoami",
  "open"
];

// Keep the cursor synced to input text (uses the existing cursor element/CSS)
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

  // position cursor relative to the input element
  const inputRect = inputArea.getBoundingClientRect();
  const parentRect = document.body.getBoundingClientRect();
  cursor.style.position = "absolute";
  cursor.style.left = (inputRect.left - parentRect.left + width) + "px";
  cursor.style.top = (inputRect.top - parentRect.top) + "px";
}

// Update cursor whenever input changes or user types
inputArea.addEventListener("input", updateCursor);
inputArea.addEventListener("focus", updateCursor);
window.addEventListener("resize", updateCursor);
updateCursor(); // initial

const helpText = `
<span class="category">Core</span>
  <span class="cmd">help</span>       <span class="desc">Show this help message</span><br>
  <span class="cmd">ls</span>         <span class="desc">List files / folders in current directory</span><br>
  <span class="cmd">pwd</span>        <span class="desc">Show current directory</span><br>
  <span class="cmd">cd &lt;dir&gt;</span> <span class="desc">Change directory (use .. to go up)</span><br>
  <span class="cmd">cat &lt;file&gt;</span> <span class="desc">Open a file / window</span><br>
  <span class="cmd">open &lt;file&gt;</span> <span class="desc">Alias for 'cat'</span><br>
  <span class="cmd">clear</span>      <span class="desc">Clear terminal screen</span><br><br>
<span class="category">Info</span>
  <span class="cmd">whoami</span>     <span class="desc">Show user information</span><br>
  <span class="cmd">exit</span>       <span class="desc">Reset the terminal</span><br>
  <span class="cmd">logout</span>     <span class="desc">Alias for 'exit'</span><br><br>
<span class="category">Portfolio</span>
  <span class="cmd">cat about</span>          <span class="desc">Open About</span><br>
  <span class="cmd">cd projects</span>        <span class="desc">Enter projects folder</span><br>
  <span class="cmd">ls</span> (inside projects) <span class="desc">List projects</span><br>
  <span class="cmd">cat &lt;proj name or index&gt;</span> <span class="desc">Open project (when inside projects)</span><br>
  <span class="cmd">cat portfolio</span>      <span class="desc">Open portfolio file explorer</span><br>
  <span class="cmd">cat resume</span>         <span class="desc">Download my resume</span>
`;

// Virtual cwd: root is "portfolio"
let currentPath = ["portfolio"];

// Helper: show prompt & focus input
function showPrompt() {
  inputLine.classList.remove("hidden");
  inputArea.focus();
  terminal.scrollTop = terminal.scrollHeight;
  updateCursor();
}

// Typing effect (HTML-aware)
// Types the *text content* inside parsed HTML nodes so tags render properly
function typeOutput(html, callback, isHelp = false, speed = 5) {
  const container = document.createElement("div");
  container.style.whiteSpace = "pre-wrap";
  if (isHelp) container.classList.add("help-output");
  output.appendChild(container);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const nodes = Array.from(tempDiv.childNodes);
  let nodeIndex = 0;
  const baseSpeed = speed;

  function typeNode() {
    if (nodeIndex >= nodes.length) {
      if (callback) setTimeout(callback, 250);
      return;
    }

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      const chars = node.textContent.split("");
      let i = 0;
      function typeChar() {
        if (i < chars.length) {
          container.append(chars[i]);
          i++;
          setTimeout(typeChar, baseSpeed + Math.random() * baseSpeed);
        } else {
          nodeIndex++;
          typeNode();
        }
      }
      typeChar();

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = document.createElement(node.tagName.toLowerCase());
      if (node.className) el.className = node.className;
      // copy attributes that matter (href target etc.)
      for (let attr of node.attributes || []) {
        el.setAttribute(attr.name, attr.value);
      }
      container.appendChild(el);

      const chars = node.textContent.split("");
      let i = 0;
      function typeChar() {
        if (i < chars.length) {
          el.append(chars[i]);
          i++;
          setTimeout(typeChar, baseSpeed + Math.random() * baseSpeed);
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

/* ---------------------------
   Filesystem helpers (uses portfolioContent from content.js)
--------------------------- */

function listRoot() {
  return ["about", "projects", "achievements", "contact", "resume"];
}

function listProjects() {
  return portfolioContent.projects.map(p => p.name);
}

function isAtRoot() {
  return currentPath.length === 1;
}
function isInProjectsFolder() {
  return currentPath.length === 2 && currentPath[1] === "projects";
}

// Command handler
function handleCommandRaw(cmdRaw) {
  const cmd = (cmdRaw || "").trim();
  if (cmd === "") {
    showPrompt();
    return;
  }

  // split base but preserve rest with spaces
  const firstSpace = cmd.indexOf(" ");
  let base = cmd;
  let rest = "";
  if (firstSpace !== -1) {
    base = cmd.slice(0, firstSpace);
    rest = cmd.slice(firstSpace + 1).trim();
  }

  // --- New Commands ---
  if (base === "whoami") {
    typeOutput(portfolioContent.whoami, showPrompt);
    return;
  }
  
  if (base === "exit" || base === "logout") {
    output.innerHTML = "";
    currentPath = ["portfolio"];
    typeOutput("Connection closed. <br> Type anything to reconnect...", () => {
      inputLine.classList.add("hidden");
      inputArea.value = "";
    });
    return;
  }

  // --- End New Commands ---

  if (base === "help") {
    typeOutput(helpText, showPrompt, true);
    return;
  }

  if (base === "pwd") {
    const pathStr = "/" + currentPath.join("/");
    typeOutput(pathStr, showPrompt);
    return;
  }

  if (base === "clear") {
    output.innerHTML = "";
    showPrompt();
    return;
  }

  if (base === "ls") {
    if (rest) {
      if (rest === "projects") {
        typeOutput(listProjects().join("  "), showPrompt);
      } else {
        typeOutput(`ls: cannot access '${rest}': No such file or directory`, showPrompt);
      }
      return;
    }

    if (isAtRoot()) {
      typeOutput(listRoot().join("  "), showPrompt);
    } else if (isInProjectsFolder()) {
      typeOutput(listProjects().join("  "), showPrompt);
    } else {
      typeOutput("ls: not a directory", showPrompt);
    }
    return;
  }

  if (base === "cd") {
    if (!rest) { showPrompt(); return; }
    if (rest === "..") {
      if (currentPath.length > 1) currentPath.pop();
      showPrompt();
      return;
    }

    if (isAtRoot()) {
      if (rest === "projects") {
        currentPath.push("projects");
        showPrompt();
        return;
      } else {
        typeOutput(`cd: not a directory: ${rest}`, showPrompt);
        return;
      }
    }

    if (isInProjectsFolder()) {
      const projects = portfolioContent.projects;
      const idx = parseInt(rest, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= projects.length) {
        currentPath.push(projects[idx - 1].name);
        showPrompt();
        return;
      }
      const found = projects.find(p => p.name.toLowerCase() === rest.toLowerCase());
      if (found) {
        currentPath.push(found.name);
        showPrompt();
        return;
      }
      typeOutput(`cd: no such directory: ${rest}`, showPrompt);
      return;
    }

    typeOutput(`cd: no such directory: ${rest}`, showPrompt);
    return;
  }

  // Make 'open' work like 'cat'
  if (base === "cat" || base === "open") {
    if (!rest) {
      typeOutput("cat: missing file name", showPrompt);
      return;
    }
    
    // Special case for resume
    if (rest === "resume") {
      window.open("/Alvi_AV_Resume.pdf", "_blank");
      typeOutput("Opening resume in a new tab...", showPrompt);
      return;
    }
    
    if (rest === "portfolio") {
      openPortfolioExplorer();
      showPrompt();
      return;
    }

    if (isAtRoot()) {
      if (rest === "about") {
        createWindow("About", portfolioContent.about);
        showPrompt();
        return;
      }
      if (rest === "achievements") {
        createWindow("Achievements", portfolioContent.achievements);
        showPrompt();
        return;
      }
      if (rest === "contact") {
        createWindow("Contact", portfolioContent.contact);
        showPrompt();
        return;
      }
      if (rest === "projects") {
        openProjectsExplorer();
        showPrompt();
        return;
      }
      typeOutput(`cat: ${rest}: No such file`, showPrompt);
      return;
    }

    if (isInProjectsFolder()) {
      const projects = portfolioContent.projects;
      const idx = parseInt(rest, 10);
      if (!isNaN(idx) && idx >= 1 && idx <= projects.length) {
        const proj = projects[idx - 1];
        createWindow(proj.name, proj.content);
        showPrompt();
        return;
      }
      const found = projects.find(p => p.name.toLowerCase() === rest.toLowerCase());
      if (found) {
        createWindow(found.name, found.content);
        showPrompt();
        return;
      }
      typeOutput(`cat: ${rest}: No such file`, showPrompt);
      return;
    }

    typeOutput(`cat: ${rest}: No such file`, showPrompt);
    return;
  }

  typeOutput(`Command not found: ${cmd}`, showPrompt);
  return;
}

/* -------------------------
   File Explorer UI helpers (openPortfolioExplorer / openProjectsExplorer)
------------------------- */

function openPortfolioExplorer() {
  let explorer = `
    <div class="file-grid">
      <div class="file" role="button" onclick="createWindow('About', portfolioContent.about)">
        <img src="icons/about.png" class="file-icon" alt="about icon"><br>about
      </div>
      <div class="file" role="button" onclick="openProjectsExplorer()">
        <img src="icons/projects.png" class="file-icon" alt="projects folder"><br>projects
      </div>
      <div class="file" role="button" onclick="createWindow('Achievements', portfolioContent.achievements)">
        <img src="icons/achievements.png" class="file-icon" alt="achievements"><br>achievements
      </div>
      <div class="file" role="button" onclick="createWindow('Contact', portfolioContent.contact)">
        <img src="icons/contact.png" class="file-icon" alt="contact"><br>contact
      </div>
      <div class="file" role="button" onclick="openResumeFile()">
        <img src="icons/file.png" class="file-icon" alt="resume"><br>resume
      </div>
    </div>
  `;
  createWindow("Portfolio", explorer);
}

function openProjectsExplorer() {
  let projExplorer = `<div class="file-grid">`;
  portfolioContent.projects.forEach((p, i) => {
    // show index for quick numeric access
    projExplorer += `
      <div class="file" role="button" onclick="openProject(${i})">
        <img src="icons/project.png" class="file-icon" alt="project"><br>${p.name}
        <div style="font-size:11px;color:#666;margin-top:6px;">(${i+1})</div>
      </div>
    `;
  });
  projExplorer += `</div>`;
  createWindow("Projects", projExplorer);
}

// open individual project by index (used by onclick)
function openProject(index) {
  const proj = portfolioContent.projects[index];
  if (!proj) return;
  createWindow(proj.name, proj.content);
}

// open resume file
function openResumeFile() {
  window.open("/Alvi_AV_Resume.pdf", "_blank");
}

// expose functions to global scope for onclick strings
window.openProject = openProject;
window.openProjectsExplorer = openProjectsExplorer;
window.openPortfolioExplorer = openPortfolioExplorer;
window.openResumeFile = openResumeFile;


/* -------------------------
   Input handling
------------------------- */
document.addEventListener("keydown", function(e) {
  if (inputLine.classList.contains("hidden")) return;
  
  // Handle tab for autocomplete
  if (e.key === "Tab") {
    e.preventDefault();
    const currentInput = inputArea.value.trim().toLowerCase();
    
    // Get all possible completions based on the current directory
    let possibleCompletions = [];
    if (isAtRoot()) {
      possibleCompletions = commands.filter(cmd => cmd.startsWith(currentInput) || listRoot().find(f => f.startsWith(currentInput)));
      if (currentInput.length > 0) {
        possibleCompletions = possibleCompletions.concat(listRoot().filter(f => f.startsWith(currentInput) && !commands.includes(f)));
      }
    } else if (isInProjectsFolder()) {
      possibleCompletions = listProjects().filter(p => p.toLowerCase().startsWith(currentInput));
    }
    
    const uniqueCompletions = [...new Set(possibleCompletions)].sort();

    if (uniqueCompletions.length === 1) {
      inputArea.value = uniqueCompletions[0];
    } else if (uniqueCompletions.length > 1) {
      typeOutput(uniqueCompletions.join("  "), () => {
        const commandLine = document.createElement("div");
        commandLine.innerHTML = `<span class="prompt">alvi@portfolio:/${currentPath.length>1?currentPath.slice(1).join('/')+ '/':''}</span> ${escapeHtml(inputArea.value)}`;
        output.appendChild(commandLine);
        showPrompt();
      });
      return;
    }
    updateCursor();
  }

  if (e.key === "Enter") {
    const raw = inputArea.value.trim();
    const commandLine = document.createElement("div");
    commandLine.innerHTML = `<span class="prompt">alvi@portfolio:/${currentPath.length>1?currentPath.slice(1).join('/')+ '/':''}</span> ${escapeHtml(raw)}`;
    output.appendChild(commandLine);
    inputLine.classList.add("hidden");

    handleCommandRaw(raw);

    inputArea.value = "";
    updateCursor();
    terminal.scrollTop = terminal.scrollHeight;
    e.preventDefault();
  } else {
    setTimeout(updateCursor, 0);
  }
});

// small helper to escape HTML when echoing typed command
function escapeHtml(str) {
  if (!str) return "";
  return str.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// ensure prompt visible on load
window.onload = function() {
    // Type out the ASCII banner first
    const bannerContent = asciiBanner.textContent;
    asciiBanner.textContent = ''; // clear it
    
    let i = 0;
    function typeBanner() {
        if (i < bannerContent.length) {
            asciiBanner.textContent += bannerContent.charAt(i);
            i++;
            setTimeout(typeBanner, 3); // speed for banner
        } else {
            // Then type the welcome text and show the prompt
            typeOutput("Welcome to my portfolio! Type <span class='cmd'>help</span> to view available commands.", showPrompt, false, 5); // speed for welcome text
        }
    }
    typeBanner();
};