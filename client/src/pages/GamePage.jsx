// src/pages/GamePage.jsx
import { useRef, useState } from "react";
import GameCanvas from "../components/GameCanvas"; // ✅ fixed path
import HUD from "../components/HUD";
import LevelModal from "../components/LevelModal";
import { saveSession } from "../api/api";

export default function GamePage({ onExit }) {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [shots, setShots] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timePlayed, setTimePlayed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("running"); // running | level-complete | game-over

  const playerName = useRef(localStorage.getItem("playerName") || "Player");

  const onStats = (s) => {
    setScore(s.score);
    setKills(s.kills);
    setShots(s.shots);
    setMistakes(s.mistakes);
    setTimePlayed(s.timePlayed);
  };

  const handleLevelComplete = () => {
    setStatus("level-complete");
    setPaused(true);
    setShowModal(true);
  };

  const handleGameOver = () => {
    setStatus("game-over");
    setPaused(true);
    setShowModal(true);
  };

  const continueNextLevel = () => {
    setLevel((l) => l + 1);
    setPaused(false);
    setShowModal(false);
    setStatus("running");
  };

  const quitAndSave = async () => {
    const accuracy = shots ? Math.round((kills / shots) * 100) : 0;
    try {
      await saveSession({
        playerName: playerName.current,
        score,
        levelReached: level,
        kills,
        shots,
        mistakes,
        accuracy,
        timePlayedSeconds: Math.round(timePlayed),
        finished: true,
      });
    } catch (err) {
      console.error("Error saving session:", err);
    } finally {
      // ✅ return to dashboard cleanly (no full page reload)
      onExit?.();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <HUD
        level={level}
        score={score}
        kills={kills}
        shots={shots}
        mistakes={mistakes}
        timePlayed={timePlayed}
      />

      <GameCanvas
        level={level}
        paused={paused}
        onStats={onStats}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
      />

      {/* Optional in-game Quit button */}
      {!showModal && (
        <button
          className="mt-4 px-4 py-2 rounded bg-red-600 hover:bg-red-500"
          onClick={quitAndSave}
        >
          Quit & Save
        </button>
      )}

      {showModal && (
        <LevelModal
          status={status}
          level={level}
          score={score}
          kills={kills}
          shots={shots}
          mistakes={mistakes}
          accuracy={shots ? Math.round((kills / shots) * 100) : 0}
          onContinue={continueNextLevel}
          onQuit={quitAndSave}
        />
      )}
    </div>
  );
}
