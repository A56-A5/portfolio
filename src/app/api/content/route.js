export async function GET() {
  const data = {
    intro: {
      banner: `
    _____  .____ ____   ____.___     _____    ____   ____
  /  _   \\ |    |\\   \\ /   /|   |   /  _   \\   \\   \\ /   /
 /  /_\\   \\|    | \\   Y   / |   |  /  /_\\   \\   \\   Y   /
/   ____   \\    |__\\     /  |   | /   ___    \\   \\     /
\\_/     \\  /_______ \\\___/   |___| \\_/     \\  /    \\___/
         \\/       \\/                       \\/
      `,
      socials: [
        { label: 'Resume', href: 'https://drive.google.com/file/d/189dxJaea-Zmx55-ddGKd3hrpqI6rJXpm/view?usp=sharing', text: 'View my resume...' },
        { label: 'GitHub', href: 'https://github.com/A56-A5', text: 'github/A56-A5' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alvi-av', text: 'linkedin/alvi_av' },
        { label: 'Devfolio', href: 'https://devfolio.co/@a56', text: 'devfolio.co/@a56' }
      ],
    },
    portfolioContent: {
      about: `
        <h3>About Me</h3>
        <p>Hi, I'm <b>Alvi</b> — a developer who loves turning ideas into playful, 
        interactive experiences. I thrive at the crossroads of <i>engineering</i> and <i>art</i>, 
        where code becomes a canvas.</p>
        <p>From crafting <i>retro-inspired interfaces</i> to building <i>AI-driven tools</i> 
        and <i>immersive games</i>, I’m always exploring new ways to blend creativity 
        with technology.</p>
      `,
      projects: [
        
        { name: "Portal", icon: "/icons/portal.png", content: `
          <h3>Portal</h3>
          <p>A cross-platform Python application for sharing your mouse, keyboard, clipboard, and audio across
          multiple devices on the same network. Supports both Linux and Windows.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/portal" target="_blank">github.com/A56-A5/portal</a></p>
        `},
        { name: "TTS", icon: "/icons/tts.png", content: `
          <h3>Realtime Dictation + TTS</h3>
          <p>A desktop app that turns your speech into text in real-time and reads it back with customizable voice, speed, and volume. Includes playback controls (pause, resume, stop) and works fully offline once installed.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/TTS" target="_blank">github.com/A56-A5/TTS</a></p>
        `},
        { name: "StockFolio", icon: "/icons/stock.png", content: `
          <h3>StockFolio</h3>
          <p>A stock market educational and prediction platform designed to make financial knowledge and
          investment tools accessible to everyone, especially beginners and low-income individuals.</p>
          <p>Features interactive learning modules, real-time stock dashboard with MA100 & MA200 visualizations,
          React frontend with secure login and progress tracking.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/stockfolio" target="_blank">github.com/A56-A5/stockfolio</a></p>
        `},
        { name: "Sensora.ai",icon: "/icons/sensora.png", content: `
          <h3>Sensora.ai</h3>
          <p>A platform bridging the gap between access and feeling in digital content, making it emotionally
          inclusive.</p>
          <p>Engineered a React/Vite frontend and integrated the Google Gemini 1.5 Flash AI engine.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/sensora" target="_blank">github.com/A56-A5/sensora</a></p>
        `},
        { name: "Cue App", icon: "/icons/cue.png", content: `
          <h3>Cue App</h3>
          <p>A lightweight, stylish utility designed to instantly launch groups of programs or URLs using simple
          custom-named cues. Built with PyQt6 for a clean dark-mode interface with colorful window controls.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/CueApp" target="_blank">github.com/A56-A5/CueApp</a></p>
        `},
        { name: "Collaborative Canva", icon: "/icons/colab.png", content: `
          <h3>Collaborative Canva</h3>
          <p>A real-time collaborative whiteboard where anyone can draw using pens of different colors, brush
          sizes, and opacities. Features undo/redo support and mobile-friendly touch input.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/collaborative-whiteboard" target="_blank">github.com/A56-A5/collaborative-whiteboard</a></p>
          <p><b>Live Demo:</b> <a href="https://collaborative-whiteboard-kfu2.onrender.com" target="_blank">collaborative-whiteboard-kfu2.onrender.com</a></p>
        `},
        { name: "Emojify Chaos App", icon: "/icons/emojify.png", content: `
          <h3>Emojify Chaos App</h3>
          <p>A quirky web app where filling out a registration form is nearly impossible with jumping fields 
          and a tiny register button. Once inside, the chatroom hilariously flips your messages into their 
          opposite meaning and sprinkles random emojis using the Gemini Flash 1.5 API.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/emojify" target="_blank">github.com/A56-A5/emojify</a></p>
          <p><b>Live Demo:</b> <a href="https://emojify-murex.vercel.app" target="_blank">emojify-murex.vercel.app</a></p>          
        `},{ 
          name: "EcoClassify AI", icon: "/icons/ecoclassify.png", content: `
          <h3>EcoClassify AI</h3>
          <p>A web app that classifies waste into Organic, Recyclable, or Unusable using a Teachable Machine model. 
          Built with a lightweight HTML/CSS/JS frontend and a Flask backend for authentication and image handling.</p>
          <p><b>Project Link:</b> <a href="https://github.com/A56-A5/ecoclassify" target="_blank">github.com/A56-A5/ecoclassify</a></p>
        `}


      ],
      achievements: `
        <h3>Achievements</h3>
        <ul>
          <li> 1st place in Debugging Python (August 11, 2025) at Christ College of Engineering</li>
          <li> 1st position in Idea pitching (February 6, 2025) at Christ College of Engineering</li>
          <li> 1st prize in Web Development (July 9, 2024) at Christ College of Engineering</li>
        </ul>
      `,
      contact: `
        <h3>Contact</h3>
        <p> Email: <a href="mailto:alvivinod16@gmail.com">alvivinod16@gmail.com</a></p>
        <p> LinkedIn: <a href="https://www.linkedin.com/in/alvi-av" target="_blank">linkedin/alvi_av</a></p>
        <p> GitHub: <a href="https://github.com/A56-A5" target="_blank">github/A56-A5</a></p>
        <p> <a href="https://drive.google.com/file/d/189dxJaea-Zmx55-ddGKd3hrpqI6rJXpm/view?usp=sharing" target="_blank">View Resume</a></p>
      `,
      other: `
        <h3>Other</h3>
        <ul>
          <li><b>LeetCode:</b> <a href="https://leetcode.com/u/A56A5" target="_blank">leetcode.com/u/A56A5</a></li>
          <li><b>Monkeytype:</b> <a href="https://monkeytype.com/profile/A56" target="_blank">monkeytype.com/profile/A56</a> — 129 WPM</li>
          <li><b>Games:</b> <a href="https://a56-a5.github.io/Random-Stuff/Code/games.html" target="_blank">a56-a5.github.io/.../games.html</a></li>
          <li><b>Drawings:</b> <a href="https://a56-a5.github.io/Random-Stuff/Code/gallery.html" target="_blank">a56-a5.github.io/.../gallery.html</a></li>
        </ul>
      `,
      otherLinks: [
        { name: "leetcode", label: "LeetCode", href: "https://leetcode.com/u/A56A5" },
        { name: "monkeytype", label: "Monkeytype (129 WPM)", href: "https://monkeytype.com/profile/A56" },
        { name: "games", label: "Games", href: "https://a56-a5.github.io/Random-Stuff/Code/games.html" },
        { name: "drawings", label: "Drawings", href: "https://a56-a5.github.io/Random-Stuff/Code/gallery.html" }
      ],
      whoami: `
        <h3>User Profile</h3>
        <p><b>Username:</b> A56 A5</p>
        <p><b>Name:</b> Alvi A V</p>
        <p><b>Location:</b> India</p>
        <p><b>Bio:</b> I’m a second-year B.Tech Data Science student passionate about building 
        full-stack web apps and exploring the potential of AI. I love experimenting with creative 
        projects that bridge technology, design, and real-world problem-solving.</p>
        `
    },
    helpHtml: `
    <span class="category">CORE</span>
    <span class="cmd">help</span>       <span class="desc">Show this help message</span><br>
    <span class="cmd">cat portfolio</span>      <span class="desc">Open portfolio UI</span><br>
    <span class="cmd">ls</span>         <span class="desc">List files/folders</span><br>
    <span class="cmd">pwd</span>        <span class="desc">Show current directory</span><br>
    <span class="cmd">cd [dir]</span>   <span class="desc">Change directory</span><br>
    <span class="cmd">cat [file]</span> <span class="desc">Open a file / window</span><br>
    <span class="cmd">open [file]</span> <span class="desc">Alias for 'cat'</span><br>
    <span class="cmd">clear</span>      <span class="desc">Clear terminal screen</span><br>
    <span class="category">INFO</span>
    <span class="cmd">whoami</span>     <span class="desc">Show user information</span><br>
    <span class="cmd">exit</span>       <span class="desc">Reset the terminal</span><br>
    <span class="cmd">logout</span>     <span class="desc">Alias for 'exit'</span><br>
    <span class="category">PORTFOLIO</span>
    <span class="cmd">cat about</span>          <span class="desc">Open About</span><br>
    <span class="cmd">cd projects</span>        <span class="desc">Enter projects folder</span><br>
    <span class="cmd">ls</span>                 <span class="desc">List projects</span><br>
    <span class="cmd">cat [proj name]</span>    <span class="desc">Open project</span><br>
    <span class="cmd">cat portfolio</span>      <span class="desc">Open portfolio UI</span><br>
    <span class="cmd">cat resume</span>         <span class="desc">Open my resume</span>
    `,
  };
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } });
}

