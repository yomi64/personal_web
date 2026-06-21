import { useState } from "react";
import Desktop from "./components/Desktop.jsx";
import Window from "./components/Window.jsx";

const INITIAL_WINDOWS = [
  { id: "about", title: "About Me.txt", position: { x: 120, y: 80 }, zIndex: 1, isOpen: true },
  { id: "projects", title: "My Projects", position: { x: 220, y: 140 }, zIndex: 2, isOpen: true },
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
        w.id === id ? { ...w, isOpen: true } : w
      )
    );
    focusWindow(id);
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Desktop onOpenWindow={openWindow} />
      {windows
        .filter((w) => w.isOpen)
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
            onMinimize={() => console.log(`minimize ${w.id}`)}
          />
        ))}
    </div>
  );
}

export default App;