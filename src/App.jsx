import Desktop from "./components/Desktop.jsx";
import Window from "./components/Window.jsx";

function App() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Desktop />
      <Window title="About Me.txt" />
    </div>
  );
}

export default App;