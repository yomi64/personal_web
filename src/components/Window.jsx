import { useEffect, useState } from "react";
import "./Window.css";

export default function Window({
  title,
  icon,
  position,
  zIndex,
  isFocused,
  onPositionChange,
  onFocus,
  onClose,
  onMinimize,
}) {
  const [dragStart, setDragStart] = useState(null);

  function handleTitleBarMouseDown(e) {
    if (e.target.closest("button")) return;

    onFocus();
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
      onPositionChange({
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

  return (
    <div
      className={`xp-window ${isFocused ? "is-focused" : ""}`}
      style={{ left: position.x, top: position.y, width: 400, height: 300, zIndex }}
      onMouseDown={onFocus}
    >
      <div className="xp-titlebar" onMouseDown={handleTitleBarMouseDown}>
        <div className="xp-titlebar-left">
          <img src={icon} alt="" className="xp-titlebar-icon" />
          <span className="xp-titlebar-text">{title}</span>
        </div>
        <div className="xp-titlebar-controls">
          <button
            className="xp-btn xp-btn-minimize"
            aria-label={`Minimize ${title}`}
            onClick={onMinimize}
          >
            &#x2013;
          </button>
          <button
            className="xp-btn xp-btn-close"
            aria-label={`Close ${title}`}
            onClick={onClose}
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