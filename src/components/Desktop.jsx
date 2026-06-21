import { useState, useEffect } from "react";

const INITIAL_ICONS = [
  { id: "about", icon: "/icons/Generic_Text_Document.png", label: "About Me", row: 0, col: 0 },
  { id: "projects", icon: "/icons/Packager.png", label: "My Projects", row: 1, col: 0 },
  { id: "resume", icon: "/icons/Briefcase.png", label: "Resume", row: 2, col: 0 },
  { id: "contact", icon: "/icons/Dialer.png", label: "Contact", row: 3, col: 0 },
];

const CELL_WIDTH = 80;
const CELL_HEIGHT = 90;

export default function Desktop() {
  const [icons, setIcons] = useState(INITIAL_ICONS);
  const [dragState, setDragState] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const MAX_ROWS = Math.floor((window.innerHeight - 32) / CELL_HEIGHT);

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

  function getNextCell(row, col) {
    const nextRow = row + 1;
    if (nextRow >= MAX_ROWS) {
      return { row: 0, col: col + 1 };
    }
    return { row: nextRow, col };
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
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #5a8fdc 0%, #3d6fc4 35%, #2f9e44 75%, #1f7a30 100%)",
        fontFamily: "Tahoma, Verdana, 'Segoe UI', sans-serif",
        position: "relative",
      }}
    >
      {icons.map((item) => {
        const isDragging = dragState?.id === item.id;
        const baseLeft = item.col * CELL_WIDTH + 16;
        const baseTop = item.row * CELL_HEIGHT + 16;

        return (
          <button
            key={item.id}
            onMouseDown={(e) => handleMouseDown(e, item)}
            style={{
              position: "absolute",
              left: isDragging ? baseLeft + dragOffset.x : baseLeft,
              top: isDragging ? baseTop + dragOffset.y : baseTop,
              width: CELL_WIDTH,
              height: CELL_HEIGHT,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: "white",
              cursor: isDragging ? "grabbing" : "grab",
              zIndex: isDragging ? 10 : 1,
            }}
          >
            <img
              src={item.icon}
              alt={item.label}
              draggable={false}
              style={{ width: "32px", height: "32px", pointerEvents: "none" }}
            />
            <span style={{ fontSize: "12px" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}