import { useState, useEffect } from "react";
import "./Window.css";

export default function Window({ title }) {
  const [position, setPosition] = useState({ x: 150, y: 100 });
  const [dragStart, setDragStart] = useState(null);

  function handleTitleBarMouseDown(e) {
    // Don't start a drag if a control button was clicked
    if (e.target.closest("button")) return;

    setDragStart({
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: position.x,
      startY: position.y,
    });
  }

  useEffect(() => {
    if (!dragStart) return;

    function handleMouseMove(e) {
      const dx = e.clientX - dragStart.startMouseX;
      const dy = e.clientY - dragStart.startMouseY;
      setPosition({
        x: dragStart.startX + dx,
        y: dragStart.startY + dy,
      });
    }

    function handleMouseUp() {
      setDragStart(null);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStart]);

  function handleMinimize() {
    console.log("minimize clicked");
  }

  function handleClose() {
    console.log("close clicked");
  }

  return (
    <div
      className="xp-window"
      style={{ left: position.x, top: position.y, width: 400, height: 300 }}
    >
      <div className="xp-titlebar" onMouseDown={handleTitleBarMouseDown}>
        <span className="xp-titlebar-text">{title}</span>
        <div className="xp-titlebar-controls">
          <button
            className="xp-btn xp-btn-minimize"
            aria-label={`Minimize ${title}`}
            onClick={handleMinimize}
          >
            &#x2013;
          </button>
          <button
            className="xp-btn xp-btn-close"
            aria-label={`Close ${title}`}
            onClick={handleClose}
          >
            &#x2715;
          </button>
        </div>
      </div>
      <div className="xp-window-content">
        Window content goes here.
      </div>
    </div>
  );
}