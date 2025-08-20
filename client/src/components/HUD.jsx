import { useEffect, useState } from "react"

export default function HUD({ level, score, kills, shots, mistakes, timePlayed }) {
  const [formattedTime, setFormattedTime] = useState("0:00")

  useEffect(() => {
    const minutes = Math.floor(timePlayed / 60)
    const seconds = Math.floor(timePlayed % 60)
    setFormattedTime(`${minutes}:${seconds.toString().padStart(2, "0")}`)
  }, [timePlayed])

  const accuracy = shots ? Math.round((kills / shots) * 100) : 0

  return (
    <div className="hud" style={styles.hud}>
      <div style={styles.item}>🎯 Level: {level}</div>
      <div style={styles.item}>🏆 Score: {score}</div>
      <div style={styles.item}>💀 Kills: {kills}</div>
      <div style={styles.item}>🔫 Shots: {shots}</div>
      <div style={styles.item}>❌ Mistakes: {mistakes}</div>
      <div style={styles.item}>🎯 Accuracy: {accuracy}%</div>
      <div style={styles.item}>⏱ Time: {formattedTime}</div>
    </div>
  )
}

const styles = {
  hud: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "10px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "16px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  item: {
    margin: "0 10px",
  },
}
