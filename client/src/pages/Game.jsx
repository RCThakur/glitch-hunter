// src/pages/Game.jsx
import { useEffect } from "react";
import Phaser from "phaser";

export default function Game() {
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: {
        create,
      },
    };
    const game = new Phaser.Game(config);

    function create() {
      this.add.text(200, 200, "Welcome to Glitch Hunter!", { fontSize: "32px", fill: "#fff" });
    }

    return () => game.destroy(true);
  }, []);

  return <div id="game-container" className="min-h-screen bg-black"></div>;
}
