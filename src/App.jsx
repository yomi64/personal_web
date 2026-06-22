import { useState } from "react";
import Desktop from "./components/Desktop.jsx";
import Window from "./components/Window.jsx";
import Taskbar from "./components/Taskbar.jsx";

const INITIAL_WINDOWS = [
  { id: "about", title: "About Me.txt", position: { x: 120, y: 80 }, zIndex: 1, isOpen: true, isMinimized: false },
  { id: "projects", title: "My Projects", position: { x: 220, y: 140 }, zIndex: 2, isOpen: true, isMinimized: false },
];

function App() {
  const [windows, setWindows] = useState(INITIAL_WINDOWS);
  const [topZIndex, setTopZIndex] = useState(2);

  function handlePositionChange(id, newPosition) {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === id ? { ...w, position: newPosition } : w
      )
    );
  }

  function handleTaskbarButtonClick(id) {
    const targetWindow = windows.find((w) => w.id === id);
    const isCurrentlyActive =
      !targetWindow.isMinimized && targetWindow.zIndex === topZIndex;

    if (isCurrentlyActive) {
      minimizeWindow(id);
    } else {
      restoreWindow(id);
    }
  }

  function focusWindow(id) {
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZ } : w
      )
    );
  }

  function closeWindow(id) {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === id ? { ...w, isOpen: false } : w
      )
    );
  }

  function openWindow(id) {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false } : w
      )
    );
    focusWindow(id);
  }

  function minimizeWindow(id) {
    setWindows((prevWindows) => {
      const updated = prevWindows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      );

      const wasFocused = prevWindows.find((w) => w.id === id)?.zIndex === topZIndex;
      if (wasFocused) {
        const stillVisible = updated.filter((w) => w.isOpen && !w.isMinimized);
        if (stillVisible.length > 0) {
          const nextFocused = stillVisible.reduce((highest, w) =>
            w.zIndex > highest.zIndex ? w : highest
          );
          const nextZ = topZIndex + 1;
          setTopZIndex(nextZ);
          return updated.map((w) =>
            w.id === nextFocused.id ? { ...w, zIndex: nextZ } : w
          );
        }
      }

      return updated;
    });
  }

  function restoreWindow(id) {
    setWindows((prevWindows) =>
      prevWindows.map((w) =>
        w.id === id ? { ...w, isMinimized: false } : w
      )
    );
    focusWindow(id);
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Desktop onOpenWindow={openWindow} />
      {windows
        .filter((w) => w.isOpen && !w.isMinimized)
        .map((w) => (
          <Window
            key={w.id}
            title={w.title}
            position={w.position}
            zIndex={w.zIndex}
            isFocused={w.zIndex === topZIndex}
            onPositionChange={(newPosition) => handlePositionChange(w.id, newPosition)}
            onFocus={() => focusWindow(w.id)}
            onClose={() => closeWindow(w.id)}
            onMinimize={() => minimizeWindow(w.id)}
          />
        ))}
        <Taskbar
          windows={windows}
          topZIndex={topZIndex}
          onTaskbarButtonClick={handleTaskbarButtonClick}
        />
    </div>
  );
}

export default App;