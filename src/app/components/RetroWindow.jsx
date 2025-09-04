"use client";
import { useRef, useState, useEffect } from "react";

export default function RetroWindow({ id, title, onClose, children, initial }) {
  const windowRef = useRef(null);
  const [position, setPosition] = useState({ x: initial?.x ?? 100, y: initial?.y ?? 100 });
  const [size, setSize] = useState({ w: initial?.w ?? 400, h: initial?.h ?? 280 });
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [z, setZ] = useState(initial?.zIndex ?? 100 + Math.random() * 1000);

  useEffect(() => {
    function getClientPos(evt) {
      if (evt.touches) return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
      if (evt.changedTouches) return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
      return { x: evt.clientX, y: evt.clientY };
    }

    function onMove(e) {
      const pos = getClientPos(e);
      if (!pos) return;
      if (dragState) {
        let newX = pos.x - dragState.offsetX;
        let newY = pos.y - dragState.offsetY;
        const win = windowRef.current;
        if (win) {
          const maxX = window.innerWidth - win.offsetWidth;
          const maxY = window.innerHeight - win.offsetHeight;
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));
        }
        setPosition({ x: newX, y: newY });
      }
      if (resizeState) {
        const dx = pos.x - resizeState.startX;
        const dy = pos.y - resizeState.startY;
        let { w, h, x, y } = resizeState;
        if (resizeState.dir.includes("e")) w = resizeState.startW + dx;
        if (resizeState.dir.includes("s")) h = resizeState.startH + dy;
        if (resizeState.dir.includes("w")) { w = resizeState.startW - dx; x = resizeState.startXPos + dx; }
        if (resizeState.dir.includes("n")) { h = resizeState.startH - dy; y = resizeState.startYPos + dy; }
        w = Math.max(240, w);
        h = Math.max(160, h);
        setSize({ w, h });
        if (x !== undefined && y !== undefined) setPosition({ x, y });
      }
    }
    function onUp() {
      setDragState(null);
      setResizeState(null);
      document.body.style.userSelect = "auto";
      document.body.style.overflow = "";
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragState, resizeState]);

  function getClientPos(e) {
    if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    if (e.changedTouches) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    const rect = windowRef.current.getBoundingClientRect();
    const pos = getClientPos(e);
    setZ(z + 1);
    setDragState({ offsetX: pos.x - rect.left, offsetY: pos.y - rect.top });
    document.body.style.userSelect = "none";
    document.body.style.overflow = "hidden";
  }

  function startResize(e, dir) {
    e.preventDefault();
    e.stopPropagation();
    const rect = windowRef.current.getBoundingClientRect();
    const pos = getClientPos(e);
    setResizeState({
      dir,
      startX: pos.x,
      startY: pos.y,
      startW: rect.width,
      startH: rect.height,
      startXPos: rect.left,
      startYPos: rect.top,
      w: rect.width,
      h: rect.height,
      x: position.x,
      y: position.y
    });
  }

  return (
    <div
      ref={windowRef}
      className="window"
      style={{ left: position.x, top: position.y, width: size.w, height: size.h, zIndex: z }}
      onMouseDown={() => setZ(z + 1)}
      onTouchStart={() => setZ(z + 1)}
      data-id={id}
    >
      <div className="window-header" onMouseDown={startDrag} onTouchStart={startDrag} style={{ touchAction: "none" }}>
        <span>{title}</span>
        <button className="close-btn" onClick={onClose}>x</button>
      </div>
      <div className="window-body">
        {children}
      </div>
      <div className="resize-handle n" onMouseDown={(e)=>startResize(e,'n')} onTouchStart={(e)=>startResize(e,'n')} style={{ touchAction: "none" }} />
      <div className="resize-handle s" onMouseDown={(e)=>startResize(e,'s')} onTouchStart={(e)=>startResize(e,'s')} style={{ touchAction: "none" }} />
      <div className="resize-handle e" onMouseDown={(e)=>startResize(e,'e')} onTouchStart={(e)=>startResize(e,'e')} style={{ touchAction: "none" }} />
      <div className="resize-handle w" onMouseDown={(e)=>startResize(e,'w')} onTouchStart={(e)=>startResize(e,'w')} style={{ touchAction: "none" }} />
      <div className="resize-handle nw" onMouseDown={(e)=>startResize(e,'nw')} onTouchStart={(e)=>startResize(e,'nw')} style={{ touchAction: "none" }} />
      <div className="resize-handle ne" onMouseDown={(e)=>startResize(e,'ne')} onTouchStart={(e)=>startResize(e,'ne')} style={{ touchAction: "none" }} />
      <div className="resize-handle sw" onMouseDown={(e)=>startResize(e,'sw')} onTouchStart={(e)=>startResize(e,'sw')} style={{ touchAction: "none" }} />
      <div className="resize-handle se" onMouseDown={(e)=>startResize(e,'se')} onTouchStart={(e)=>startResize(e,'se')} style={{ touchAction: "none" }} />
    </div>
  );
}

