"use client";
import { useEffect, useRef, useState } from "react";
import "../styles/style.css";
import RetroWindow from "./components/RetroWindow.jsx";

export default function Home() {
  const [content, setContent] = useState(null);
  const [lines, setLines] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [windows, setWindows] = useState([]);
  const [cwd, setCwd] = useState(["portfolio"]);
  const inputRef = useRef(null);
  const hasInitialized = useRef(false);
  const cursorRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ left: 0, top: 0 });
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(setContent);
  }, []);

  useEffect(() => {
    if (!content || hasInitialized.current) return;
    hasInitialized.current = true;
    
    // Type out ASCII banner first
    typeText(content.intro.banner, "banner", 2);
    
    // Then immediately show social links (no animation)
    setTimeout(() => {
      const socialsHtml = content.intro.socials.map(s => 
        `${s.label} → <a class="cmd" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.text}</a>`
      ).join('\n');
      setLines(prev => [...prev, { type: "socials", html: `<div class="social-links">${socialsHtml}</div>` }]);
    }, 100);
    
    // Then welcome message
    setTimeout(() => {
      typeHtml("Welcome to my portfolio! Type <span style='font-weight: bold; color: #fff; text-shadow: 0 0 1px #ffffff, 0 0 4px #ffffff; padding: 0px; margin: 0px;'>help</span> to view available commands.", true, 3);
    }, 3000);
    
    // Show input after all animations complete
    setTimeout(() => {
      setShowInput(true);
      inputRef.current && inputRef.current.focus();
    }, 5000);
  }, [content]);

  function print(text) {
    setLines(prev => [...prev, { type: "text", text }]);
  }

  function printHtml(html, isHelp) {
    setLines(prev => [...prev, { type: isHelp ? "help" : "html", html }]);
  }

  function typeText(text, type = "text", speed = 5) {
    const lineId = Math.random().toString(36).slice(2);
    setLines(prev => [...prev, { id: lineId, type, text: "" }]);
    
    let builtText = "";
    const chars = text.split("");
    let i = 0;
    
    function tick() {
      if (i < chars.length) {
        builtText += chars[i++];
        setLines(prev => prev.map(l => l.id === lineId ? { ...l, text: builtText } : l));
        setTimeout(tick, speed + Math.random() * speed);
      }
    }
    tick();
  }

  function typeHtml(html, isHelp = false, speed = 5) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const nodes = Array.from(tempDiv.childNodes);
    let nodeIndex = 0;
    let builtHtml = "";
    
    // Add initial empty line
    const lineId = Math.random().toString(36).slice(2);
    setLines(prev => [...prev, { id: lineId, type: isHelp ? "help" : "html", html: "" }]);
    
    function updateLine() { 
      setLines(prev => prev.map(l => l.id === lineId ? { ...l, html: builtHtml } : l)); 
    }
    
    function typeNode() {
      if (nodeIndex >= nodes.length) return;
      const node = nodes[nodeIndex];
      if (node.nodeType === Node.TEXT_NODE) {
        const chars = node.textContent.split("");
        let i = 0;
        (function tick(){
          if (i < chars.length) { 
            builtHtml += chars[i++]; 
            updateLine(); 
            setTimeout(tick, speed + Math.random()*speed); 
          } else { 
            nodeIndex++; 
            typeNode(); 
          }
        })();
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const start = `<${node.tagName.toLowerCase()}${Array.from(node.attributes).map(a=>` ${a.name}="${a.value}"`).join("")}>`;
        const end = `</${node.tagName.toLowerCase()}>`;
        const chars = node.textContent.split("");
        let i = 0;
        builtHtml += start; 
        updateLine();
        (function tick(){
          if (i < chars.length) { 
            builtHtml += chars[i++]; 
            updateLine(); 
            setTimeout(tick, speed + Math.random()*speed); 
          } else { 
            builtHtml += end; 
            updateLine(); 
            nodeIndex++; 
            typeNode(); 
          }
        })();
      } else { 
        nodeIndex++; 
        typeNode(); 
      }
    }
    typeNode();
  }

  function createWindow(title, html) {
    const id = Math.random().toString(36).slice(2);
    setWindows(prev => [...prev, { id, title, body: html, zIndex: Date.now() }]);
  }

  function openPortfolioExplorer() {
    if (!content) return;
    const id = Math.random().toString(36).slice(2);
    const body = (
      <div className="file-grid">
        <div className="file" role="button" onClick={() => createWindow("About", content.portfolioContent.about)}>
          <img src="/icons/about.png" className="file-icon" alt="about" /><br />about
        </div>
        <div className="file" role="button" onClick={() => openProjectsExplorer()}>
          <img src="/icons/projects.png" className="file-icon" alt="projects" /><br />projects
        </div>
        <div className="file" role="button" onClick={() => createWindow("Achievements", content.portfolioContent.achievements)}>
          <img src="/icons/achievements.png" className="file-icon" alt="achievements" /><br />achievements
        </div>
        <div className="file" role="button" onClick={() => openOtherExplorer()}>
          <img src="/icons/projects.png" className="file-icon" alt="other" /><br />other
        </div>
        <div className="file" role="button" onClick={() => createWindow("Contact", content.portfolioContent.contact)}>
          <img src="/icons/contact.png" className="file-icon" alt="contact" /><br />contact
        </div>
        <div className="file" role="button" onClick={() => window.open("/Alvi_AV_Resume.pdf", "_blank") }>
          <img src="/icons/resume.png" className="file-icon" alt="resume" /><br />resume
        </div>
      </div>
    );
    setWindows(prev => [...prev, { id, title: "Portfolio", body, zIndex: Date.now() }]);
  }

  function openProjectsExplorer() {
    if (!content) return;
    const id = Math.random().toString(36).slice(2);
    const body = (
      <div className="file-grid">
        {content.portfolioContent.projects.map((p, i) => (
          <div key={i} className="file" role="button" onClick={() => createWindow(p.name, p.content)}>
            <img src={p.icon || "/icons/projects.png"} className="file-icon" alt={p.name} /><br />{p.name}

          </div>
        ))}
      </div>
    );
    setWindows(prev => [...prev, { id, title: "Projects", body, zIndex: Date.now() }]);
  }

  function openOtherExplorer() {
    if (!content) return;
    const id = Math.random().toString(36).slice(2);
    const items = content.portfolioContent.otherLinks || [];
    const iconFor = (name) => {
      const n = name.toLowerCase();
      if (n.includes('draw')) return '/icons/color.png';
      if (n.includes('game')) return '/icons/game.png';
      if (n.includes('monkey')) return '/icons/monkey.png';
      if (n.includes('leet')) return '/icons/leetcode.png';
      return '/icons/projects.png';
    };
    const body = (
      <div className="file-grid">
        {items.map((it, i) => (
          <div key={i} className="file" role="button" onClick={() => window.open(it.href, "_blank")}>
            <img src={iconFor(it.name)} className="file-icon" alt={it.name} /><br />{it.label || it.name}
          </div>
        ))}
      </div>
    );
    setWindows(prev => [...prev, { id, title: "Other", body, zIndex: Date.now() }]);
  }

  function openWindow(kind) {
    const id = Math.random().toString(36).slice(2);
    if (kind === "projects") {
      setWindows(prev => [...prev, { id, title: "Projects", body: (
        <div className="file-grid">
          {content.portfolioContent.projects.map((p, i) => (
            <div key={i} className="file" role="button" onClick={() => createWindow(p.name, p.content)}>
              <img src={p.icon || "/icons/projects.png"} className="file-icon" alt={p.name} />
              <div>{p.name}</div>
            </div>
          ))}
        </div>
      ), zIndex: Date.now() }]);
    } else if (kind === "achievements") {
      setWindows(prev => [...prev, { id, title: "Achievements", body: (
        <div dangerouslySetInnerHTML={{ __html: content.portfolioContent.achievements }} />
      ), zIndex: Date.now() }]);
    }
  }

  function handleCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    const firstSpace = cmd.indexOf(" ");
    let base = cmd;
    let rest = "";
    if (firstSpace !== -1) { base = cmd.slice(0, firstSpace); rest = cmd.slice(firstSpace + 1).trim(); }

    const isAtRoot = () => cwd.length === 1;
    const isInProjects = () => cwd.length === 2 && cwd[1] === "projects";
    const isInOther = () => cwd.length === 2 && cwd[1] === "other";
    const listRoot = () => ["about", "projects/", "achievements", "other/", "contact", "resume"];
    const listProjects = () => content.portfolioContent.projects.map(p => p.name);
    const listOther = () => (content.portfolioContent.otherLinks||[]).map(l => l.name);

    if (base === "whoami") { typeHtml(content.portfolioContent.whoami, false, 3); return; }
    if (base === "exit" || base === "logout") {
      setLines([]);
      setCwd(["portfolio"]);
      typeText("Connection closed. \n Type anything to reconnect...", "text", 3);
      return;
    }
    if (base === "help") { typeHtml(content.helpHtml, true, 3); return; }
    if (base === "pwd") { typeText("/" + cwd.join("/"), "text", 3); return; }
         if (base === "clear") { 
       setLines([]); 
       hasInitialized.current = false;
       setShowInput(false);
       // Re-initialize after clear
       setTimeout(() => {
         hasInitialized.current = true;
         typeText(content.intro.banner, "banner", 2);
         setTimeout(() => {
           const socialsHtml = content.intro.socials.map(s => 
             `${s.label} → <a class="cmd" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.text}</a>`
           ).join('\n');
           setLines(prev => [...prev, { type: "socials", html: `<div class="social-links">${socialsHtml}</div>` }]);
         }, 100);
         setTimeout(() => {
           typeHtml("Welcome to my portfolio! Type <span style='font-weight: bold; color: #fff; text-shadow: 0 0 1px #ffffff, 0 0 4px #ffffff; padding: 0px; margin: 0px;'>help</span> to view available commands.", true, 3);
         }, 3000);
         setTimeout(() => {
           setShowInput(true);
           inputRef.current && inputRef.current.focus();
         }, 5000);
       }, 100);
       return; 
     }
    if (base === "ls") {
      if (rest) {
        if (rest === "projects" || rest === "projects/") typeText(listProjects().join("  "), "text", 3);
        else if (rest === "other" || rest === "other/") typeText(listOther().join("  "), "text", 3);
        else typeText(`ls: cannot access '${rest}': No such file or directory`, "text", 3);
        return;
      }
      if (isAtRoot()) typeText(listRoot().join("  "), "text", 3);
      else if (isInProjects()) typeText(listProjects().join("  "), "text", 3);
      else if (isInOther()) typeText(listOther().join("  "), "text", 3);
      else typeText("ls: not a directory", "text", 3);
      return;
    }
    if (base === "cd") {
      if (!rest) return;
      if (rest === "..") { if (cwd.length > 1) setCwd(prev => prev.slice(0, -1)); return; }
      if (isAtRoot()) {
        if (rest === "projects" || rest === "projects/") setCwd(prev => [...prev, "projects"]);
        else if (rest === "other" || rest === "other/") setCwd(prev => [...prev, "other"]);
        else typeText(`cd: not a directory: ${rest}`, "text", 3);
        return;
      }
      if (isInProjects()) {
        const projects = content.portfolioContent.projects;
        const idx = parseInt(rest, 10);
        if (!isNaN(idx) && idx >= 1 && idx <= projects.length) { setCwd(prev => [...prev, projects[idx - 1].name]); return; }
        const found = projects.find(p => p.name.toLowerCase() === rest.toLowerCase());
        if (found) { setCwd(prev => [...prev, found.name]); return; }
        typeText(`cd: no such directory: ${rest}`, "text", 3);
        return;
      }
      if (isInOther()) {
        const items = content.portfolioContent.otherLinks||[];
        const idx = parseInt(rest, 10);
        if (!isNaN(idx) && idx >= 1 && idx <= items.length) { window.open(items[idx-1].href, "_blank"); typeText(`Opening ${items[idx-1].label}...`, "text", 3); return; }
        const found = items.find(x => x.name.toLowerCase() === rest.toLowerCase());
        if (found) { window.open(found.href, "_blank"); typeText(`Opening ${found.label}...`, "text", 3); return; }
        typeText(`cd: no such directory: ${rest}`, "text", 3);
        return;
      }
      typeText(`cd: no such directory: ${rest}`, "text", 3);
      return;
    }
    if (base === "cat" || base === "open") {
      if (!rest) { typeText("cat: missing file name", "text", 3); return; }
      if (rest === "resume") { window.open("/Alvi_AV_Resume.pdf", "_blank"); typeText("Opening resume in a new tab...", "text", 3); return; }
      if (rest === "portfolio") { openPortfolioExplorer(); return; }
      if (isAtRoot()) {
        if (rest === "about") { createWindow("About", content.portfolioContent.about); return; }
        if (rest === "achievements") { createWindow("Achievements", content.portfolioContent.achievements); return; }
        if (rest === "other") { openOtherExplorer(); return; }
        if (rest === "contact") { createWindow("Contact", content.portfolioContent.contact); return; }
        if (rest === "projects") { openProjectsExplorer(); return; }
        typeText(`cat: ${rest}: No such file`, "text", 3); return;
      }
      if (isInProjects()) {
        const projects = content.portfolioContent.projects;
        const idx = parseInt(rest, 10);
        if (!isNaN(idx) && idx >= 1 && idx <= projects.length) { createWindow(projects[idx - 1].name, projects[idx - 1].content); return; }
        const found = projects.find(p => p.name.toLowerCase() === rest.toLowerCase());
        if (found) { createWindow(found.name, found.content); return; }
        typeText(`cat: ${rest}: No such file`, "text", 3); return;
      }
      if (isInOther()) {
        const items = content.portfolioContent.otherLinks||[];
        const idx = parseInt(rest, 10);
        if (!isNaN(idx) && idx >= 1 && idx <= items.length) { window.open(items[idx-1].href, "_blank"); typeText(`Opening ${items[idx-1].label}...`, "text", 3); return; }
        const found = items.find(x => x.name.toLowerCase() === rest.toLowerCase());
        if (found) { window.open(found.href, "_blank"); typeText(`Opening ${found.label}...`, "text", 3); return; }
        typeText(`cat: ${rest}: No such file`, "text", 3); return;
      }
      typeText(`cat: ${rest}: No such file`, "text", 3);
      return;
    }
    typeText(`Command not found: ${cmd}`, "text", 3);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      const toRun = inputValue;
      const sub = cwd.length>1?cwd.slice(1).join('/') + '/':'';
      setLines(prev => [...prev, { type: "line", prompt: `alvi@portfolio:/${sub}`, text: toRun }]);
      setInputValue("");
      handleCommand(toRun);
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputValue.trim().toLowerCase();
      let options = [];
      const commands = ["help","ls","pwd","cd","cat","clear","portfolio","about","projects","achievements","other","contact","resume","exit","logout","whoami","open"];
      const listRoot = () => ["about","projects","achievements","other","contact","resume"];
      const listProjects = () => (content?.portfolioContent?.projects||[]).map(p => p.name);
      if (cwd.length === 1) {
        options = commands.filter(c => c.startsWith(current));
        if (current.length>0) options = [...new Set([...options, ...listRoot().filter(f => f.startsWith(current))])];
      } else if (cwd.length === 2 && cwd[1] === "projects") {
        options = listProjects().filter(p => p.toLowerCase().startsWith(current));
      }
      options = [...new Set(options)].sort();
      if (options.length === 1) setInputValue(options[0]);
      else if (options.length > 1) typeText(options.join("  "), "text", 3);
    }
  }

  useEffect(() => {
    // update cursor position on resize/focus too
    const onResize = () => setInputValue(v => v);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Accurate cursor positioning based on input text width
  useEffect(() => {
    const input = inputRef.current;
    const cursor = cursorRef.current;
    if (!input || !cursor) return;
    
    const measurer = document.createElement("span");
    const styles = window.getComputedStyle(input);
    measurer.style.visibility = "hidden";
    measurer.style.position = "absolute";
    measurer.style.whiteSpace = "pre";
    measurer.style.font = styles.font;
    measurer.textContent = (input.value || "").replace(/ /g, "\u00A0");
    document.body.appendChild(measurer);
    
    const width = measurer.offsetWidth;
    const inputRect = input.getBoundingClientRect();
    const wrapper = input.closest('.input-wrapper');
    const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : { top: 0 };
    const left = width;
    // Align cursor vertically with the input element
    const top = inputRect.top - wrapperRect.top;
    const height = inputRect.height;
    setCursorPos({ left, top, height });
    measurer.remove();
  }, [inputValue]);

  // Auto-scroll output to bottom on new content (mobile only) and tap-to-focus (mobile only)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;
    const out = document.getElementById("output");
    if (out) out.scrollTop = out.scrollHeight;
  }, [lines, showInput]);

  return (
    <div className="terminal" id="terminal">
      <div id="output" onClick={() => {
        const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
        if (isMobile && inputRef.current) inputRef.current.focus();
      }}>
                 {lines.map((l, i) => {
           if (l.type === "line") return (
             <div className="line" key={i}><span className="prompt">{l.prompt}</span><span>{l.text}</span></div>
           );
           if (l.type === "banner") return <pre className="ascii-banner" key={i}>{l.text}</pre>;
           if (l.type === "socials") return <div key={i} dangerouslySetInnerHTML={{ __html: l.html }} />;
           if (l.type === "help") return <div className="help-output" key={i} dangerouslySetInnerHTML={{ __html: l.html }} />;
           if (l.type === "html") return <div key={i} style={{ color: '#888' }} dangerouslySetInnerHTML={{ __html: l.html }} />;
           return <div className="help-output" key={i} style={{ color: '#888' }}>{l.text}</div>;
         })}
      </div>
      {showInput && (
        <div className="line" id="input-line">
          <span className="prompt">alvi@portfolio:/$</span>
          <div className="input-wrapper">
            <input
              ref={inputRef}
              id="input"
              className="input-area"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              autoFocus
            />
            <span ref={cursorRef} className="cursor" style={{ left: `${cursorPos.left}px`, top: `${cursorPos.top}px`, height: cursorPos.height ? `${cursorPos.height}px` : undefined }}></span>
          </div>
        </div>
      )}

      {windows.map(w => (
        <RetroWindow key={w.id} id={w.id} title={w.title} onClose={() => setWindows(prev => prev.filter(x => x.id !== w.id))} initial={{ zIndex: w.zIndex }}>
          {typeof w.body === 'string' ? <div dangerouslySetInnerHTML={{ __html: w.body }} /> : w.body}
        </RetroWindow>
      ))}
    </div>
  );
}

