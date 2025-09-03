let zIndex = 50;

function createWindow(title, content) {
  const win = document.createElement("div");
  document.body.style.overflow.x = 'hidden'; // disable scrolling
  win.className = "window";
  win.style.top = (100 + Math.random() * 50) + "px";
  win.style.left = (100 + Math.random() * 50) + "px";
  win.style.width = "400px";
  win.style.height = "280px";
  win.style.zIndex = zIndex++;

  win.innerHTML = `
    <div class="window-header">
      <span>${title}</span>
      <button class="close-btn">&times;</button>
    </div>
    <div class="window-body">${content}</div>
    <div class="resize-handle n"></div>
    <div class="resize-handle s"></div>
    <div class="resize-handle e"></div>
    <div class="resize-handle w"></div>
    <div class="resize-handle nw"></div>
    <div class="resize-handle ne"></div>
    <div class="resize-handle sw"></div>
    <div class="resize-handle se"></div>
  `;

  document.body.appendChild(win);

  const header = win.querySelector(".window-header");
  const closeBtn = win.querySelector(".close-btn");

  closeBtn.addEventListener("click", e => { e.stopPropagation(); win.remove(); });
  closeBtn.addEventListener("touchstart", e => { e.stopPropagation(); e.preventDefault(); win.remove(); });

  win.addEventListener("mousedown", () => win.style.zIndex = zIndex++);
  win.addEventListener("touchstart", () => win.style.zIndex = zIndex++);

  // --- Drag ---
  let isDragging = false, offsetX = 0, offsetY = 0;

  function getClientPos(e) {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    const pos = getClientPos(e);
    offsetX = pos.x - win.offsetLeft;
    offsetY = pos.y - win.offsetTop;
    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";
  }

  function doDrag(e) {
    if (!isDragging) return;
    const pos = getClientPos(e);
    if (!pos) return;
    e.preventDefault(); // prevent scrolling on touch

    let newLeft = pos.x - offsetX;
    let newTop = pos.y - offsetY;

    // Boundaries
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - win.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - win.offsetHeight));

    win.style.left = newLeft + "px";
    win.style.top = newTop + "px";
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.userSelect = "auto";
    document.body.style.overflow = "";
  }

  header.addEventListener("mousedown", startDrag);
  header.addEventListener("touchstart", startDrag, { passive: false });
  document.addEventListener("mousemove", doDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchmove", doDrag, { passive: false });
  document.addEventListener("touchend", stopDrag);

  // --- Resize (mobile + desktop compatible) ---
  const handles = win.querySelectorAll(".resize-handle");
  let isResizing = false, resizeDir = "", startX = 0, startY = 0, startW = 0, startH = 0, startL = 0, startT = 0;

  function startResize(e, dir) {
    e.preventDefault();
    isResizing = true;
    resizeDir = dir;
    const pos = getClientPos(e);
    if (!pos) return;
    startX = pos.x;
    startY = pos.y;
    startW = win.offsetWidth;
    startH = win.offsetHeight;
    startL = win.offsetLeft;
    startT = win.offsetTop;
    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";
  }

  function doResize(e) {
    if (!isResizing) return;
    const pos = getClientPos(e);
    if (!pos) return;
    e.preventDefault();

    let newW = startW;
    let newH = startH;
    let newL = startL;
    let newT = startT;

    if (resizeDir.includes("e")) newW = startW + (pos.x - startX);
    if (resizeDir.includes("s")) newH = startH + (pos.y - startY);
    if (resizeDir.includes("w")) { newW = startW - (pos.x - startX); newL = startL + (pos.x - startX); }
    if (resizeDir.includes("n")) { newH = startH - (pos.y - startY); newT = startT + (pos.y - startY); }

    if (newW > 200) { win.style.width = newW + "px"; win.style.left = newL + "px"; }
    if (newH > 150) { win.style.height = newH + "px"; win.style.top = newT + "px"; }
  }

  function stopResize() {
    isResizing = false;
    document.body.style.userSelect = "auto";
    document.body.style.overflow = "";
  }

  handles.forEach(h => {
    const dir = h.classList[1];
    h.addEventListener("mousedown", e => startResize(e, dir));
    h.addEventListener("touchstart", e => startResize(e, dir), { passive: false });
  });

  document.addEventListener("mousemove", doResize);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("touchmove", doResize, { passive: false });
  document.addEventListener("touchend", stopResize);
}
