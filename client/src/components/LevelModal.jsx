export default function LevelModal({ status, level, score, kills, shots, mistakes, accuracy, onContinue, onQuit }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {status === "level-complete" ? (
          <h2>🎉 Level {level} Complete!</h2>
        ) : (
          <h2>💀 Game Over</h2>
        )}

        <div style={styles.stats}>
          <p>🏆 Score: {score}</p>
          <p>💀 Kills: {kills}</p>
          <p>🔫 Shots: {shots}</p>
          <p>❌ Mistakes: {mistakes}</p>
          <p>🎯 Accuracy: {accuracy}%</p>
        </div>

        <div style={styles.actions}>
          {status === "level-complete" && (
            <button style={styles.button} onClick={onContinue}>
              ▶ Continue
            </button>
          )}
          <button style={styles.buttonQuit} onClick={onQuit}>
            🚪 Quit & Save
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  modal: {
    background: "#1e1e1e",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center",
    width: "300px",
    fontFamily: "monospace",
  },
  stats: {
    margin: "15px 0",
    textAlign: "left",
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  buttonQuit: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    background: "#e53935",
    color: "#fff",
    cursor: "pointer",
  },
}
