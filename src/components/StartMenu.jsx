import "./StartMenu.css";

const START_MENU_APPS = [
  { id: "about", title: "About Me.txt" },
  { id: "projects", title: "My Projects" },
];

export default function StartMenu({ onOpenApp, onClose }) {
  return (
    <div className="xp-start-menu">
      <div className="xp-start-menu-header">Your Name</div>

      <div className="xp-start-menu-columns">
        <div className="xp-start-menu-col xp-start-menu-col-left">
          {START_MENU_APPS.map((app) => (
            <button
              key={app.id}
              className="xp-start-menu-item"
              onClick={() => {
                onOpenApp(app.id);
                onClose();
              }}
            >
              {app.title}
            </button>
          ))}
        </div>

        <div className="xp-start-menu-col xp-start-menu-col-right">
          <a className="xp-start-menu-item" href="https://github.com/yourusername" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}