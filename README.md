# Alvi AV - Terminal Portfolio  

A **dynamic, retro-themed terminal portfolio** built with **Next.js**, designed to blend creativity and functionality.  
This project recreates a playful terminal-like interface where visitors can explore your **About, Projects, Achievements, Contact, Resume, and more** using familiar shell commands or a retro file explorer UI.  

 **Live Demo:** [alviav.vercel.app](https://alviav.vercel.app)  

---

## Features  

- Retro-inspired draggable windows (About, Projects, etc.)  
- Terminal-like experience with commands:  
  - `help` → Show available commands  
  - `ls`, `cd`, `pwd` → Navigate portfolio as a filesystem  
  - `cat [file]` / `open [file]` → Open sections like *about*, *achievements*, *projects*  
  - `whoami` → Show profile info  
  - `history`, `clear`, `exit`, `logout` → Classic terminal commands  
- ASCII art banner intro with typewriter animation  
- Quick access social links (GitHub, LinkedIn, Resume, etc.)  
- Projects Explorer with clickable icons and live demo links  
- Achievements section styled in retro popups  
- Responsive design for desktop & mobile  
- Hidden Easter egg: try typing **`duck`** in the terminal  

---

## Tech Stack  

- **Framework:** [Next.js 13+](https://nextjs.org/)  
- **Frontend:** React (Client Components), CSS (custom dark terminal theme + retro window styles)  
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)  
- **API Routes:** Custom `/api/content` endpoint serving portfolio data  
- **Styling:** Handcrafted CSS (retro terminal + draggable resizable windows)  

---

## Getting Started  

### 1. Clone this repo  
```bash
git clone https://github.com/A56-A5/portfolio.git
cd portfolio
```

### 2. Install dependencies  
```bash
npm install
```

### 3. Run development server  
```bash
npm run dev
```
Then visit: **[http://localhost:3000](http://localhost:3000)**  

---

## Project Structure  

```
├── app/
│   ├── layout.js         # Root layout (metadata, viewport setup)
│   ├── page.js           # Main terminal interface
│   ├── api/content/route.js # Portfolio data (About, Projects, Achievements, etc.)
│   └── components/
│       └── RetroWindow.jsx # Retro draggable/resizable window UI
├── styles/
│   └── style.css         # Terminal + retro UI styles
```

---

## Author  

**Alvi A V**  
- GitHub: [github.com/A56-A5](https://github.com/A56-A5)  
- LinkedIn: [linkedin/alvi-av](https://www.linkedin.com/in/alvi-av)  
- Resume: [View Resume](https://drive.google.com/file/d/189dxJaea-Zmx55-ddGKd3hrpqI6rJXpm/view?usp=sharing)  
- Email: [alvivinod16@gmail.com](mailto:alvivinod16@gmail.com)  

---

## License  

This project is open-source under the **MIT License**. 
