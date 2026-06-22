import "./Taskbar.css";

export default function Taskbar({ windows, topZIndex, onTaskbarButtonClick, onStartClick }) {
  const openWindows = windows.filter((w) => w.isOpen);

  return (
    <div className="xp-taskbar">
      <button className="xp-start-btn" onClick={onStartClick}>
        start
      </button>
      <div className="xp-taskbar-apps">
        {openWindows.map((w) => {
          const isActive = !w.isMinimized && w.zIndex === topZIndex;
          return (
            <button
              key={w.id}
              className={`xp-taskbar-app ${isActive ? "is-active" : ""}`}
              onClick={() => onTaskbarButtonClick(w.id)}
            >
              {w.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}