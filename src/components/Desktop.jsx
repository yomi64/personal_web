export default function Desktop() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #5a8fdc 0%, #3d6fc4 35%, #2f9e44 75%, #1f7a30 100%)",
        padding: "16px",
      }}
    >
      <button
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "32px" }}>📄</span>
        <span style={{ fontSize: "12px" }}>About_Me.txt</span>
      </button>
    </div>
  );
}