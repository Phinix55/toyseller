"use client";
import { useEffect, useRef, useState } from "react";

// Minimal 8-bit Audio Engine
class SoundFX {
  ctx: AudioContext | null = null;
  
  init() {
    if (typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playBlip() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playLaser() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playExplosion() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.3; 
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();
  }
  
  playCrash() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }
}

export default function RacingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal resolution for chunky retro pixels
    canvas.width = 160; 
    canvas.height = 144;
    
    const sfx = new SoundFX();
    sfx.init();

    // Game variables
    let animationId: number;
    let frameCount = 0;
    let currentScore = 0;
    
    const lanes = [30, 80, 130]; // X coordinates for lanes
    let playerLane = 1;
    
    // Entity types
    type Obstacle = { x: number, y: number, type: 'car' | 'round', active: boolean };
    type Laser = { x: number, y: number, active: boolean };
    
    let obstacles: Obstacle[] = [];
    let lasers: Laser[] = [];
    
    let speed = 1.5;
    let isRoundEvent = false;
    let roundEventTimer = 0;

    // Controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (playerLane > 0) {
          playerLane--;
          sfx.playBlip();
        }
      } else if (e.key === 'ArrowRight') {
        if (playerLane < 2) {
          playerLane++;
          sfx.playBlip();
        }
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        // Fire laser
        lasers.push({ x: lanes[playerLane], y: 120, active: true });
        sfx.playLaser();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);

    // Drawing utils
    const drawCar = (x: number, y: number) => {
      ctx.fillStyle = '#0f380f'; // Dark green pixel color
      // Simple pixel car
      ctx.fillRect(x - 6, y - 8, 12, 16);
      ctx.fillRect(x - 8, y - 4, 2, 4); // left wheel
      ctx.fillRect(x + 6, y - 4, 2, 4); // right wheel
      ctx.fillRect(x - 8, y + 4, 2, 4); // left back wheel
      ctx.fillRect(x + 6, y + 4, 2, 4); // right back wheel
    };

    const drawRoundObstacle = (x: number, y: number) => {
      ctx.fillStyle = '#0f380f';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawLaser = (x: number, y: number) => {
      ctx.fillStyle = '#0f380f';
      ctx.fillRect(x - 1, y - 6, 2, 6);
    };

    // Main Loop
    const loop = () => {
      frameCount++;
      
      // Clear Screen with Gameboy Green
      ctx.fillStyle = '#8bac0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Score
      if (frameCount % 10 === 0) {
        currentScore += 1;
        speed += 0.001; // slowly increase speed
      }

      // Draw road markings (scrolling)
      ctx.fillStyle = '#306230'; // subtle mid-green
      const offset = (frameCount * speed) % 20;
      for (let i = -20; i < canvas.height; i += 20) {
        ctx.fillRect(55, i + offset, 2, 10);
        ctx.fillRect(105, i + offset, 2, 10);
      }

      // Manage Event State
      if (!isRoundEvent && Math.random() < 0.002) {
        isRoundEvent = true;
        roundEventTimer = 0;
        // Spawn a round obstacle at top
        obstacles.push({ x: lanes[1], y: -20, type: 'round', active: true });
      }

      if (isRoundEvent) {
        roundEventTimer++;
        if (roundEventTimer > 300) { // Event ends after 300 frames if not resolved
          isRoundEvent = false;
        }
      } else {
        // Spawn standard obstacles
        if (frameCount % 60 === 0) {
          const lane = Math.floor(Math.random() * 3);
          obstacles.push({ x: lanes[lane], y: -20, type: 'car', active: true });
        }
      }

      // Update & Draw Lasers
      lasers.forEach(laser => {
        if (laser.active) {
          laser.y -= 4;
          drawLaser(laser.x, laser.y);
          if (laser.y < -10) laser.active = false;
        }
      });

      // Update & Draw Obstacles
      obstacles.forEach(obs => {
        if (!obs.active) return;
        
        obs.y += speed;
        
        if (obs.type === 'car') {
          drawCar(obs.x, obs.y);
        } else {
          drawRoundObstacle(obs.x, obs.y);
        }

        // Collision with Lasers
        if (obs.type === 'round') {
          lasers.forEach(laser => {
            if (laser.active && Math.abs(laser.x - obs.x) < 10 && Math.abs(laser.y - obs.y) < 10) {
              laser.active = false;
              obs.active = false;
              sfx.playExplosion();
              currentScore += 100;
              isRoundEvent = false; // Event cleared
            }
          });
        }

        // Collision with Player
        const playerX = lanes[playerLane];
        const playerY = 120;
        if (Math.abs(obs.x - playerX) < 12 && Math.abs(obs.y - playerY) < 16) {
          // Crash!
          setScore(currentScore);
          setGameOver(true);
          setIsPlaying(false);
          sfx.playCrash();
        }
        
        if (obs.y > canvas.height + 20) obs.active = false;
      });

      // Cleanup inactive
      obstacles = obstacles.filter(o => o.active);
      lasers = lasers.filter(l => l.active);

      // Draw Player
      drawCar(lanes[playerLane], 120);

      // Draw HUD
      ctx.fillStyle = '#0f380f';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillText(`SCORE:${currentScore}`, 8, 24);

      if (!gameOver) {
        animationId = requestAnimationFrame(loop);
      }
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#8bac0f] rounded-lg shadow-inner overflow-hidden relative">
      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#8bac0f] z-10 p-4 text-center">
          <h2 className="font-pixel text-[#0f380f] text-sm md:text-xl mb-4 leading-relaxed">RACING<br/>CHAMPION</h2>
          <p className="font-pixel text-[#0f380f] text-[8px] md:text-xs mb-8 opacity-70 leading-loose">
            ARROWS TO MOVE<br/>SPACE TO SHOOT
          </p>
          <button 
            onClick={startGame}
            className="font-pixel text-[#0f380f] text-xs md:text-sm animate-pulse border-2 border-[#0f380f] px-4 py-2 hover:bg-[#0f380f] hover:text-[#8bac0f] transition-colors"
          >
            PLAY
          </button>
        </div>
      )}
      
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#8bac0f] z-10 p-4 text-center">
          <h2 className="font-pixel text-[#0f380f] text-sm md:text-xl mb-4">CRASHED!</h2>
          <p className="font-pixel text-[#0f380f] text-xs mb-8">SCORE: {score}</p>
          <button 
            onClick={startGame}
            className="font-pixel text-[#0f380f] text-xs md:text-sm border-2 border-[#0f380f] px-4 py-2 hover:bg-[#0f380f] hover:text-[#8bac0f] transition-colors"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Render canvas large, but logic resolves small for chunky pixels */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
