// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, Settings, Trophy, Play, Users, X } from "lucide-react";
import GamePage from "./GamePage"; // ✅ use your real Game

export default function Dashboard({
  user = { username: "Guest", id: null },
  onLogout = () => {},
  audioManager = null,
  onUpdatePreferences = () => {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState({ volume: 50, sfx: true, difficulty: "medium" });
  const [stats, setStats] = useState({
    xp: 4200,
    level: 7,
    coins: 210,
    gamesPlayed: 42,
    highScore: 1840,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const mock = [
      { rank: 1, name: "ByteSlayer", score: 4200 },
      { rank: 2, name: "NullNinja", score: 3580 },
      { rank: 3, name: "GL!TCH_Master", score: 3200 },
      { rank: 4, name: user.username || "You", score: stats.highScore },
    ];
    setLeaderboard(mock);
  }, [user.username, stats.highScore]);

  const handlePrefChange = (patch) => {
    const updated = { ...prefs, ...patch };
    setPrefs(updated);
    onUpdatePreferences(updated);
    if (patch.volume !== undefined && audioManager) audioManager.setVolume(patch.volume);
    if (patch.sfx !== undefined && audioManager) audioManager.setSfxEnabled(patch.sfx);
  };

  const handleStart = () => {
    audioManager?.playClickSound?.();
    setIsPlaying(true); // ✅ show the game
  };

  return (
    <div className="w-full min-h-screen flex bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-black via-zinc-900 to-slate-900 text-white">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gray-900/60 backdrop-blur-sm border-r border-gray-800 p-4`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className={`flex items-center gap-3 ${sidebarOpen ? "w-full" : "w-8 justify-center"}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg shadow-lg flex items-center justify-center text-black font-bold">
              GH
            </div>
            {sidebarOpen && <div className="text-lg font-extrabold">Glitch Hunter</div>}
          </div>
          <button
            className="text-sm text-gray-300 hover:text-white p-1"
            onClick={() => setSidebarOpen((s) => !s)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "⟨" : "⟩"}
          </button>
        </div>

        <nav className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStart}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-md"
          >
            <Play className="w-5 h-5" />
            {sidebarOpen && <span className="font-semibold">Start Hunt</span>}
          </motion.button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
            <Trophy className="w-4 h-4 text-yellow-400" />
            {sidebarOpen && <span>Leaderboard</span>}
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            {sidebarOpen && <span>Settings</span>}
          </button>

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
            <Users className="w-4 h-4 text-green-400" />
            {sidebarOpen && <span>Profile</span>}
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition mt-6"
            onClick={() => onLogout()}
          >
            <LogOut className="w-4 h-4 text-red-400" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        {isPlaying ? (
          // ✅ Your real game
          <div className="w-full h-full">
            <GamePage onExit={() => setIsPlaying(false)} />
          </div>
        ) : (
          <>
            {/* ...the rest of your dashboard (unchanged UI blocks) ... */}
            {/* Player card + stats */}
            <div className="flex items-start gap-6 mb-8">
              {/* (left card) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-gradient-to-br from-white/5 to-white/2 border border-gray-800 rounded-2xl p-5 backdrop-blur-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-black font-bold text-lg">
                    {user.username?.slice(0, 1).toUpperCase() || "G"}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold">{user.username || "Guest Player"}</div>
                    <div className="text-sm text-gray-300">Hunter Rank: Level {stats.level}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">XP</div>
                    <div className="font-mono font-semibold">{stats.xp}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-xs text-gray-400">High Score</div>
                    <div className="font-mono font-bold">{stats.highScore}</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-xs text-gray-400">Games</div>
                    <div className="font-mono font-bold">{stats.gamesPlayed}</div>
                  </div>
                  <div className="p-3 bg-black/30 rounded">
                    <div className="text-xs text-gray-400">Coins</div>
                    <div className="font-mono font-bold">{stats.coins}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={handleStart}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold shadow hover:brightness-105 transition"
                  >
                    Quick Launch
                  </button>
                </div>
              </motion.div>

              {/* (right panels) */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="bg-gradient-to-br from-gray-900/40 to-black/30 border border-gray-800 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Session Stats</div>
                    <div className="text-sm text-gray-400">Live</div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Current Score</div>
                      <div className="font-mono font-bold">0</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">Timer</div>
                      <div className="font-mono font-bold">00:00</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-300">HP</div>
                      <div className="font-mono font-bold">100%</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-gradient-to-br from-gray-900/40 to-black/30 border border-gray-800 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">Leaderboard</div>
                    <div className="text-sm text-gray-400">Top Hunters</div>
                  </div>

                  <ul className="mt-4 space-y-3">
                    {leaderboard.map((p) => (
                      <li key={p.rank} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold">
                            #{p.rank}
                          </div>
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-400">score: {p.score}</div>
                          </div>
                        </div>
                        <div className="font-mono font-semibold">{p.score}</div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>

            {/* CTA Section */}
            <section className="relative rounded-2xl p-6 bg-gradient-to-br from-black/60 to-transparent border border-gray-800 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold">Ready to Hunt?</h3>
                  <p className="text-gray-400 mt-1">Jump into the glitch arena and hunt the corrupted pixel.</p>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart}
                    className="px-6 py-3 rounded-2xl shadow-xl bg-gradient-to-r from-pink-500 to-purple-600 text-black font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-4 h-4" /> Start Hunt
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={() => setShowSettings(true)}
                    whileHover={{ scale: 1.03 }}
                    className="px-4 py-2 rounded-2xl border border-gray-700 text-gray-300"
                  >
                    <Settings className="w-4 h-4 inline" /> Settings
                  </motion.button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Settings Drawer */}
      <motion.aside
        initial={{ x: 300 }}
        animate={{ x: showSettings ? 0 : 300 }}
        transition={{ duration: 0.35 }}
        className="w-96 bg-gray-900/70 backdrop-blur-md border-l border-gray-800 p-6"
        style={{ zIndex: showSettings ? 40 : 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold">Settings</h4>
          <button onClick={() => setShowSettings(false)} className="text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Volume: {prefs.volume}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={prefs.volume}
              onChange={(e) => handlePrefChange({ volume: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-300">Sound Effects</div>
              <div className="text-xs text-gray-500">Toggle in-game SFX</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.sfx}
                onChange={(e) => handlePrefChange({ sfx: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-checked:bg-cyan-500 rounded-full transition" />
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Difficulty</label>
            <select
              value={prefs.difficulty}
              onChange={(e) => handlePrefChange({ difficulty: e.target.value })}
              className="bg-black/30 border border-gray-700 rounded px-3 py-2 w-full"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setShowSettings(false)}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-600 text-black font-bold"
            >
              Save Settings
            </button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
