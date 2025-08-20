// client/src/components/GameCanvas.jsx
import { useEffect, useRef, useState } from "react";
import shootSoundFile from "../assets/sounds/shoot.wav";
import hitSoundFile from "../assets/sounds/hit.wav";
import bgMusicFile from "../assets/sounds/bg-music.wav";

export default function GameCanvas({ level, paused, onStats, onLevelComplete, onGameOver }) {
  const canvasRef = useRef(null);
  const gunRef = useRef({ x: 400, y: 550 });
  const bulletsRef = useRef([]);
  const glitchesRef = useRef([]);
  const particlesRef = useRef([]); // explosion effects
  const flashRef = useRef(null); // muzzle flash
  const statsRef = useRef({
    score: 0, kills: 0, shots: 0, mistakes: 0, timePlayed: 0
  });

  const levelDuration = 60; // seconds
  const spawnInterval = 2000;
  let spawnTimer;

  // audio refs
  const shootAudio = useRef(new Audio(shootSoundFile));
  const hitAudio = useRef(new Audio(hitSoundFile));
  const bgMusic = useRef(new Audio(bgMusicFile));

  // --- Shoot
  const shoot = () => {
    if (paused) return;

    // add bullet
    bulletsRef.current.push({
      x: gunRef.current.x + 15,
      y: gunRef.current.y,
      speed: 8
    });
    statsRef.current.shots++;

    // play sound
    shootAudio.current.currentTime = 0;
    shootAudio.current.play();

    // muzzle flash
    flashRef.current = { x: gunRef.current.x + 10, y: gunRef.current.y - 10, life: 5 };
  };

  // --- Spawn glitch
  const spawnGlitch = () => {
    glitchesRef.current.push({
      x: Math.random() * 750,
      y: -30,
      size: 20 + Math.random() * 25,
      speed: 1 + level * 0.4 + Math.random(),
      drift: (Math.random() - 0.5) * 1.5,
      isTarget: Math.random() < 0.15
    });
  };

  // --- Explosion particles
  const spawnParticles = (x, y, color) => {
    for (let i = 0; i < 10; i++) {
      particlesRef.current.push({
        x, y,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        life: 30,
        color
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let last = Date.now();
    let gameLoop;
    let levelTimeLeft = levelDuration;

    // 🎵 play background music
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.4;
    if (!paused) {
      bgMusic.current.play().catch(() => {
        // ignored autoplay block until user interacts
      });
    }

    // start continuous spawning
    spawnTimer = setInterval(() => {
      if (!paused) spawnGlitch();
    }, spawnInterval);

    const update = () => {
      if (paused) {
        gameLoop = requestAnimationFrame(update);
        return;
      }

      const now = Date.now();
      const delta = (now - last) / 1000;
      last = now;
      statsRef.current.timePlayed += delta;
      levelTimeLeft -= delta;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --- draw gun
      ctx.fillStyle = "blue";
      ctx.fillRect(gunRef.current.x, gunRef.current.y, 30, 30);

      // muzzle flash
      if (flashRef.current) {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(flashRef.current.x + 10, flashRef.current.y, 15, 0, Math.PI * 2);
        ctx.fill();
        flashRef.current.life--;
        if (flashRef.current.life <= 0) flashRef.current = null;
      }

      // --- draw bullets
      ctx.fillStyle = "red";
      bulletsRef.current.forEach((b, bi) => {
        b.y -= b.speed;
        ctx.fillRect(b.x, b.y, 5, 10);

        // collisions
        glitchesRef.current.forEach((g, gi) => {
          if (
            b.x < g.x + g.size &&
            b.x + 5 > g.x &&
            b.y < g.y + g.size &&
            b.y + 10 > g.y
          ) {
            // play hit sound
            hitAudio.current.currentTime = 0;
            hitAudio.current.play();

            if (g.isTarget) {
              statsRef.current.score += 100 * level;
              statsRef.current.kills++;
              spawnParticles(g.x, g.y, "lime");
            } else {
              statsRef.current.mistakes++;
              spawnParticles(g.x, g.y, "purple");
              if (statsRef.current.mistakes >= 5) {
                onStats(statsRef.current);
                onGameOver();
              }
            }
            glitchesRef.current.splice(gi, 1);
            bulletsRef.current.splice(bi, 1);
          }
        });
      });

      // --- draw glitches
      glitchesRef.current.forEach((g, gi) => {
        ctx.fillStyle = g.isTarget ? "lime" : "purple";
        if (g.isTarget && Math.random() < 0.1) ctx.fillStyle = "yellow"; // flicker
        g.y += g.speed;
        g.x += g.drift;
        ctx.fillRect(g.x, g.y, g.size, g.size);
        if (g.y > canvas.height) {
          if (g.isTarget) {
            onStats(statsRef.current);
            onGameOver();
          } else {
            glitchesRef.current.splice(gi, 1);
          }
        }
      });

      // --- particles
      particlesRef.current.forEach((p, pi) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        if (p.life <= 0) particlesRef.current.splice(pi, 1);
      });

      // --- time check
      if (levelTimeLeft <= 0) {
        onStats(statsRef.current);
        onLevelComplete();
        return;
      }

      onStats({ ...statsRef.current, timeLeft: Math.ceil(levelTimeLeft) });

      gameLoop = requestAnimationFrame(update);
    };

    gameLoop = requestAnimationFrame(update);

    // controls
    const moveGun = (e) => {
      if (paused) return;
      if (e.key === "ArrowLeft") gunRef.current.x -= 20;
      if (e.key === "ArrowRight") gunRef.current.x += 20;
      if (e.key === " ") shoot();
    };
    window.addEventListener("keydown", moveGun);

    return () => {
      cancelAnimationFrame(gameLoop);
      clearInterval(spawnTimer);
      window.removeEventListener("keydown", moveGun);
      bgMusic.current.pause();
    };
  }, [level, paused]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "2px solid white", background: "black" }}
    />
  );
}
