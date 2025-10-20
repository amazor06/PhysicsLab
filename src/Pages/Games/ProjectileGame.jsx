import { useState, useRef, useEffect } from "react";
import { Target, RotateCcw, Play, Rocket } from "lucide-react";

export default function ProjectileGame() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(50);
  const [launched, setLaunched] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Adjust angle and velocity, then launch!");
  const [target, setTarget] = useState({ x: 550, y: 340 });
  const [trajectory, setTrajectory] = useState([]);
  const [stars, setStars] = useState([]);
  const [asteroid, setAsteroid] = useState(null);
  const [explosion, setExplosion] = useState(null);
  const rafRef = useRef();

  const cannonX = 40;
  const cannonY = 380;
  const g = 9.8;
  const pixelsPerMeter = 3;
  const width = 800;
  const height = 450;

  // Generate stars on mount
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 150; i++) {
      newStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    setStars(newStars);
  }, []);

  const resetTarget = () => {
    const randomX = Math.floor(Math.random() * 300) + 450;
    const randomY = height - 70 - Math.floor(Math.random() * 80);
    setTarget({ x: randomX, y: randomY });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Deep space background gradient
    const spaceGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
    spaceGradient.addColorStop(0, "#1e293b");
    spaceGradient.addColorStop(0.5, "#0f172a");
    spaceGradient.addColorStop(1, "#020617");
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    });

    // Distant planets/moons
    ctx.beginPath();
    ctx.arc(650, 100, 35, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(147, 51, 234, 0.3)";
    ctx.fill();
    ctx.strokeStyle = "rgba(147, 51, 234, 0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(150, 120, 25, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "rgba(59, 130, 246, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Alien ground/surface
    const groundGradient = ctx.createLinearGradient(0, height - 70, 0, height);
    groundGradient.addColorStop(0, "rgba(51, 65, 85, 0.8)");
    groundGradient.addColorStop(1, "rgba(30, 41, 59, 0.9)");
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, height - 70, width, 70);

    // Surface details (craters/rocks) - static positions
    ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
    const craterPositions = [50, 120, 200, 280, 350, 430, 510, 590, 670, 740];
    craterPositions.forEach((x, i) => {
      const size = 10 + (i % 3) * 3;
      ctx.beginPath();
      ctx.ellipse(x, height - 35, size, size * 0.5, 0, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Glowing energy crystals on surface - static positions
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#3b82f6";
    const crystalPositions = [100, 250, 380, 520, 650, 720];
    crystalPositions.forEach(x => {
      ctx.beginPath();
      ctx.moveTo(x, height - 70);
      ctx.lineTo(x - 5, height - 50);
      ctx.lineTo(x, height - 55);
      ctx.lineTo(x + 5, height - 50);
      ctx.closePath();
      ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Futuristic cannon platform with glow
    ctx.fillStyle = "rgba(71, 85, 105, 0.9)";
    ctx.fillRect(10, height - 70, 60, 20);
    
    // Platform glow
    ctx.strokeStyle = "rgba(59, 130, 246, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, height - 70, 60, 20);

    // Energy lines on platform
    ctx.strokeStyle = "rgba(96, 165, 250, 0.7)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(15, height - 60);
    ctx.lineTo(65, height - 60);
    ctx.stroke();

    // Futuristic cannon
    const rad = (angle * Math.PI) / 180;
    ctx.save();
    ctx.translate(cannonX, cannonY);
    
    // Cannon base with glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#3b82f6";
    ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.strokeStyle = "rgba(96, 165, 250, 1)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Cannon barrel with gradient
    ctx.rotate(-rad);
    const barrelGradient = ctx.createLinearGradient(0, 0, 45, 0);
    barrelGradient.addColorStop(0, "rgba(71, 85, 105, 1)");
    barrelGradient.addColorStop(1, "rgba(100, 116, 139, 1)");
    ctx.fillStyle = barrelGradient;
    ctx.fillRect(0, -8, 45, 16);
    
    // Barrel highlights
    ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, -8, 45, 16);
    
    // Energy core at tip
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#60a5fa";
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(40, -4, 8, 8);
    ctx.shadowBlur = 0;
    
    ctx.restore();

    // Target platform
    ctx.fillStyle = "rgba(71, 85, 105, 0.8)";
    ctx.fillRect(target.x - 15, target.y + 15, 30, 8);
    
    // Target with glowing effects
    const targetRadius = 15;
    
    // Outer glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#a855f7";
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetRadius + 5, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Target outer ring
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(192, 132, 252, 1)";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Target middle ring
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetRadius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(192, 132, 252, 0.9)";
    ctx.fill();
    
    // Target center with glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#c084fc";
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetRadius * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = "#e9d5ff";
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw trajectory with gradient
    if (trajectory.length > 1) {
      const trajectoryGradient = ctx.createLinearGradient(
        trajectory[0].x, trajectory[0].y,
        trajectory[trajectory.length - 1].x, trajectory[trajectory.length - 1].y
      );
      trajectoryGradient.addColorStop(0, "rgba(96, 165, 250, 0.6)");
      trajectoryGradient.addColorStop(1, "rgba(59, 130, 246, 0.2)");
      
      ctx.strokeStyle = trajectoryGradient;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(trajectory[0].x, trajectory[0].y);
      for (let i = 1; i < trajectory.length; i++) {
        ctx.lineTo(trajectory[i].x, trajectory[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw asteroid projectile
    if (asteroid) {
      const { x, y, rotation } = asteroid;

      // Asteroid trail/glow
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#fbbf24";
      ctx.beginPath();
      ctx.arc(x, y, 16, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(251, 191, 36, 0.2)";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw asteroid
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Asteroid gradient
      const rockGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 12);
      rockGradient.addColorStop(0, "#a8a29e");
      rockGradient.addColorStop(0.5, "#78716c");
      rockGradient.addColorStop(1, "#44403c");
      ctx.fillStyle = rockGradient;
      
      // Irregular asteroid shape
      ctx.beginPath();
      ctx.moveTo(0, -12);
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 10 + Math.random() * 3;
        ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
      
      // Asteroid highlights
      ctx.strokeStyle = "rgba(168, 162, 158, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Craters on asteroid
      ctx.fillStyle = "rgba(68, 64, 60, 0.6)";
      ctx.beginPath();
      ctx.arc(-3, -2, 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(4, 3, 1.5, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.restore();

      // Shadow below asteroid
      ctx.beginPath();
      ctx.ellipse(x, height - 68, 10, 3, 0, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fill();
    }

    // Draw explosion effect
    if (explosion) {
      const { x, y, frame } = explosion;
      const maxFrames = 30;
      const progress = frame / maxFrames;
      
      // Multiple expanding rings
      for (let i = 0; i < 3; i++) {
        const ringProgress = Math.max(0, progress - i * 0.15);
        const radius = ringProgress * 60;
        const opacity = (1 - ringProgress) * 0.8;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.8, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(251, 191, 36, ${opacity * 0.7})`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Particles
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const distance = progress * 50;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        const size = (1 - progress) * 4;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = i % 2 === 0 ? "#a855f7" : "#fbbf24";
        ctx.beginPath();
        ctx.arc(px, py, size, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? "#c084fc" : "#fcd34d";
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Central flash
      if (progress < 0.3) {
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, 15 * (1 - progress / 0.3), 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${1 - progress / 0.3})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }, [angle, stars, trajectory, asteroid, target, explosion]);

  // Animation Loop
  useEffect(() => {
    if (!launched || !asteroid) return;

    const animate = () => {
      setTime((t) => {
        const newTime = t + 0.025;
        const rad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(rad);
        const vy = velocity * Math.sin(rad);

        const x = cannonX + vx * pixelsPerMeter * newTime;
        const y = cannonY - (vy * pixelsPerMeter * newTime - 0.5 * g * pixelsPerMeter * newTime * newTime);

        const newAsteroid = {
          x,
          y,
          rotation: asteroid.rotation + 0.15,
        };
        setAsteroid(newAsteroid);
        setTrajectory((prev) => [...prev, { x, y }]);

        // Collision check
        const dx = x - target.x;
        const dy = y - target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 20) {
          setScore((prev) => prev + 1);
          setMessage("💥 Direct hit! Target destroyed!");
          
          // Start explosion animation
          setExplosion({ x: target.x, y: target.y, frame: 0 });
          
          cancelAnimationFrame(rafRef.current);
          setLaunched(false);
          setTrajectory([]);
          setAsteroid(null);
          
          // Animate explosion then reset
          let explosionFrame = 0;
          const explosionInterval = setInterval(() => {
            explosionFrame++;
            setExplosion({ x: target.x, y: target.y, frame: explosionFrame });
            
            if (explosionFrame >= 30) {
              clearInterval(explosionInterval);
              setExplosion(null);
              resetTarget();
              setMessage("Adjust angle and velocity, then launch!");
            }
          }, 33); // ~30fps for explosion
          
          return t;
        }

        // Ground or off screen
        if (y >= height - 70 || x > width || x < 0) {
          setMessage("❌ Missed! Recalibrate and try again.");
          cancelAnimationFrame(rafRef.current);
          setLaunched(false);
          setTrajectory([]);
          setAsteroid(null);
          // Don't reset target position on miss
          return t;
        }

        return newTime;
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [launched, angle, velocity, asteroid, target]);

  const handleLaunch = () => {
    if (launched) return;
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const startAsteroid = { x: cannonX, y: cannonY, rotation: 0, vx, vy };
    setAsteroid(startAsteroid);
    setTrajectory([]);
    setTime(0);
    setLaunched(true);
    setMessage("🚀 Asteroid launched!");
  };

  const handleReset = () => {
    setLaunched(false);
    setAsteroid(null);
    setTrajectory([]);
    setExplosion(null);
    setScore(0);
    setTime(0);
    setMessage("Adjust angle and velocity, then launch!");
    resetTarget(); // Only reset target when user explicitly hits Reset button
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-sm border-2 border-blue-500/20 shadow-2xl rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Space Projectile Challenge
              </h2>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-lg font-bold text-xl shadow-lg">
              Score: {score}
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full rounded-lg shadow-lg border-2 border-slate-700/50 mb-6"
          />

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 shadow-md mb-4 border border-slate-700/50">
            <p className="text-center text-lg font-semibold text-slate-200 mb-3">
              {message}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-blue-300 mb-2">
                  Launch Angle: {angle}°
                </label>
                <input
                  type="range"
                  min="10"
                  max="85"
                  value={angle}
                  onChange={(e) => !launched && setAngle(Number(e.target.value))}
                  disabled={launched}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Initial Velocity: {velocity} m/s
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={velocity}
                  onChange={(e) => !launched && setVelocity(Number(e.target.value))}
                  disabled={launched}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleLaunch}
              disabled={launched}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 text-lg font-semibold shadow-lg rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-blue-400/30"
            >
              <Play className="w-5 h-5" />
              Launch
            </button>
            <button 
              onClick={handleReset}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border-2 border-slate-600 hover:border-slate-500 px-8 py-3 text-lg font-semibold shadow-lg rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}