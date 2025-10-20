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

    // Surface details (craters/rocks)
    ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
    for (let i = 0; i < 20; i++) {
      const x = (i * 50) % width;
      const size = Math.random() * 15 + 5;
      ctx.beginPath();
      ctx.ellipse(x, height - 35, size, size * 0.5, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Glowing energy crystals on surface
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#3b82f6";
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      ctx.beginPath();
      ctx.moveTo(x, height - 70);
      ctx.lineTo(x - 5, height - 50);
      ctx.lineTo(x, height - 55);
      ctx.lineTo(x + 5, height - 50);
      ctx.closePath();
      ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
      ctx.fill();
    }
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

    // Projectile (energy ball)
    if (launched) {
      const vx = velocity * Math.cos(rad);
      const vy = velocity * Math.sin(rad);
      const x = cannonX + vx * pixelsPerMeter * time;
      const y = cannonY - (vy * pixelsPerMeter * time - 0.5 * g * pixelsPerMeter * time * time);

      // Energy trail
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#3b82f6";
      
      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
      ctx.fill();
      
      // Core
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      coreGradient.addColorStop(0, "#93c5fd");
      coreGradient.addColorStop(1, "#3b82f6");
      ctx.fillStyle = coreGradient;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Check collision with target
      const dx = x - target.x;
      const dy = y - target.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 20) {
        setScore(prev => prev + 1);
        setMessage("🎯 Direct hit! Target relocated!");
        cancelAnimationFrame(rafRef.current);
        setLaunched(false);
        setTrajectory([]);
        setTimeout(() => {
          resetTarget();
          setMessage("Adjust angle and velocity, then launch!");
        }, 1500);
        return;
      }

      // Check if projectile hit ground or went off screen
      if (y >= height - 70 || x > width || x < 0) {
        setMessage("❌ Missed! Recalibrate and try again.");
        cancelAnimationFrame(rafRef.current);
        setLaunched(false);
        setTrajectory([]);
      }
    }
  }, [angle, velocity, time, launched, target, trajectory, stars]);

  useEffect(() => {
    if (!launched) return;
    
    const animate = () => {
      setTime(t => {
        const newTime = t + 0.025;
        const rad = (angle * Math.PI) / 180;
        const vx = velocity * Math.cos(rad);
        const vy = velocity * Math.sin(rad);
        const x = cannonX + vx * pixelsPerMeter * newTime;
        const y = cannonY - (vy * pixelsPerMeter * newTime - 0.5 * g * pixelsPerMeter * newTime * newTime);
        
        setTrajectory(prev => [...prev, { x, y }]);
        return newTime;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [launched, angle, velocity]);

  const handleLaunch = () => {
    if (launched) return;
    setMessage("Energy projectile launched...");
    setTime(0);
    setTrajectory([]);
    setLaunched(true);
  };

  const handleReset = () => {
    setLaunched(false);
    setTime(0);
    setTrajectory([]);
    setMessage("Adjust angle and velocity, then launch!");
    setScore(0);
    resetTarget();
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