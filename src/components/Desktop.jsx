import { useState, useEffect } from "react";
import "./Desktop.css";

const INITIAL_ICONS = [
  { id: "about", icon: "/icons/Generic_Text_Document.png", label: "About Me", row: 0, col: 0 },
  { id: "projects", icon: "/icons/Packager.png", label: "My Projects", row: 1, col: 0 },
  { id: "resume", icon: "/icons/Briefcase.png", label: "Resume", row: 2, col: 0 },
  { id: "contact", icon: "/icons/Dialer.png", label: "Contact", row: 3, col: 0 },
];

const CELL_WIDTH = 80;
const CELL_HEIGHT = 90;

export default function Desktop({ onOpenWindow }) {
  const [icons, setIcons] = useState(INITIAL_ICONS);
  const [dragState, setDragState] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const MAX_ROWS = Math.floor((window.innerHeight - 32) / CELL_HEIGHT);

  function getNextCell(row, col) {
    const nextRow = row + 1;
    if (nextRow >= MAX_ROWS) {
      return { row: 0, col: col + 1 };
    }
    return { row: nextRow, col };
  }

  function handleMouseDown(e, item) {
    setDragState({
      id: item.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startCol: item.col,
      startRow: item.row,
    });
    setDragOffset({ x: 0, y: 0 });
  }

  useEffect(() => {
    if (!dragState) return;

    function handleMouseMove(e) {
      const dx = e.clientX - dragState.startMouseX;
      const dy = e.clientY - dragState.startMouseY;
      setDragOffset({ x: dx, y: dy });
    }

    function handleMouseUp(e) {
      const dx = e.clientX - dragState.startMouseX;
      const dy = e.clientY - dragState.startMouseY;

      const cellsMovedX = Math.round(dx / CELL_WIDTH);
      const cellsMovedY = Math.round(dy / CELL_HEIGHT);

      const newCol = Math.max(0, dragState.startCol + cellsMovedX);
      const newRow = Math.max(0, dragState.startRow + cellsMovedY);

      setIcons((prevIcons) => {
        let updated = prevIcons.map((icon) =>
          icon.id === dragState.id ? { ...icon, row: newRow, col: newCol } : icon
        );

        let checkRow = newRow;
        let checkCol = newCol;
        let displacedId = dragState.id;

        while (true) {
          const blocker = updated.find(
            (icon) =>
              icon.id !== displacedId &&
              icon.row === checkRow &&
              icon.col === checkCol
          );

          if (!blocker) break;

          const next = getNextCell(checkRow, checkCol);
          updated = updated.map((icon) =>
            icon.id === blocker.id ? { ...icon, row: next.row, col: next.col } : icon
          );

          checkRow = next.row;
          checkCol = next.col;
          displacedId = blocker.id;
        }

        return updated;
      });

      setDragState(null);
      setDragOffset({ x: 0, y: 0 });
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragState]);

  return (
    <div className="xp-desktop">
      {icons.map((item) => {
        const isDragging = dragState?.id === item.id;
        const baseLeft = item.col * CELL_WIDTH + 16;
        const baseTop = item.row * CELL_HEIGHT + 16;

        return (
          <button
            key={item.id}
            className={`xp-icon ${isDragging ? "is-dragging" : ""}`}
            onMouseDown={(e) => handleMouseDown(e, item)}
            onDoubleClick={() => onOpenWindow(item.id)}
            style={{
              left: isDragging ? baseLeft + dragOffset.x : baseLeft,
              top: isDragging ? baseTop + dragOffset.y : baseTop,
              width: CELL_WIDTH,
              height: CELL_HEIGHT,
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              draggable={false}
              className="xp-icon-image"
            />
            <span className="xp-icon-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}