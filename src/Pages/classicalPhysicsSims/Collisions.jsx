import { useState, useEffect, useCallback } from 'react';

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? Number.parseFloat(value).toFixed(digits) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value, step < 1 ? 2 : 1)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-purple-500"
      disabled={disabled}
    />
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>{min}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-white"
        disabled={disabled}
      />
      <span>{max}</span>
    </div>
  </div>
);

export default function SimpleCollisionSim() {
  const [mode, setMode] = useState('2D'); // '1D' or '2D'
  const [ball1, setBall1] = useState({ x: 150, y: 200, vx: 0, vy: 0, mass: 2, radius: 25 });
  const [ball2, setBall2] = useState({ x: 450, y: 200, vx: 0, vy: 0, mass: 3, radius: 30 });
  const [initialSettings, setInitialSettings] = useState({
    ball1: { mass: 2, vx: 0, vy: 0 },
    ball2: { mass: 3, vx: 0, vy: 0 }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [collisions, setCollisions] = useState(0);

  const boxWidth = 600;
  const boxHeight = 400;
  const trackY = 200; // For 1D mode

  const reset = () => {
    const newBall1 = {
      x: 150,
      y: mode === '1D' ? trackY : 200,
      vx: initialSettings.ball1.vx,
      vy: mode === '1D' ? 0 : initialSettings.ball1.vy,
      mass: initialSettings.ball1.mass,
      radius: 15 + initialSettings.ball1.mass * 2
    };
    const newBall2 = {
      x: 450,
      y: mode === '1D' ? trackY : 200,
      vx: initialSettings.ball2.vx,
      vy: mode === '1D' ? 0 : initialSettings.ball2.vy,
      mass: initialSettings.ball2.mass,
      radius: 15 + initialSettings.ball2.mass * 2
    };
    setBall1(newBall1);
    setBall2(newBall2);
    setIsRunning(false);
    setCollisions(0);
  };

  const start = () => {
    setIsRunning(true);
  };

  const updateInitialSettings = (ballNum, property, value) => {
    setInitialSettings(prev => ({
      ...prev,
      [`ball${ballNum}`]: {
        ...prev[`ball${ballNum}`],
        [property]: value
      }
    }));

    if (ballNum === 1) {
      setBall1(prev => ({
        ...prev,
        [property]: value,
        radius: property === 'mass' ? 15 + value * 2 : prev.radius
      }));
    } else {
      setBall2(prev => ({
        ...prev,
        [property]: value,
        radius: property === 'mass' ? 15 + value * 2 : prev.radius
      }));
    }
  };

  const checkCollision = useCallback((b1, b2) => {
    if (mode === '1D') {
      return Math.abs(b2.x - b1.x) < (b1.radius + b2.radius);
    } else {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (b1.radius + b2.radius);
    }
  }, [mode]);

  const resolveCollision = useCallback((b1, b2) => {
    if (mode === '1D') {
      const u1 = b1.vx;
      const u2 = b2.vx;
      const m1 = b1.mass;
      const m2 = b2.mass;
      
      const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
      const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
      
      return {
        b1: { ...b1, vx: v1 * 0.9 },
        b2: { ...b2, vx: v2 * 0.9 }
      };
    } else {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance === 0) return { b1, b2 };
      
      const nx = dx / distance;
      const ny = dy / distance;
      const dvx = b2.vx - b1.vx;
      const dvy = b2.vy - b1.vy;
      const dvn = dvx * nx + dvy * ny;
      if (dvn > 0) return { b1, b2 };
      
      const impulse = 2 * dvn / (b1.mass + b2.mass);
      return {
        b1: {
          ...b1,
          vx: (b1.vx + impulse * b2.mass * nx) * 0.9,
          vy: (b1.vy + impulse * b2.mass * ny) * 0.9
        },
        b2: {
          ...b2,
          vx: (b2.vx - impulse * b1.mass * nx) * 0.9,
          vy: (b2.vy - impulse * b1.mass * ny) * 0.9
        }
      };
    }
  }, [mode]);

  useEffect(() => {
    reset();
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      setBall1(prev => {
        let newX = prev.x + prev.vx;
        let newY = mode === '1D' ? trackY : prev.y + prev.vy;
        let newVx = prev.vx;
        let newVy = prev.vy;

        if (newX - prev.radius <= 0 || newX + prev.radius >= boxWidth) {
          newVx = -newVx * 0.8;
          newX = newX - prev.radius <= 0 ? prev.radius : boxWidth - prev.radius;
        }
        if (mode === '2D' && (newY - prev.radius <= 0 || newY + prev.radius >= boxHeight)) {
          newVy = -newVy * 0.8;
          newY = newY - prev.radius <= 0 ? prev.radius : boxHeight - prev.radius;
        }

        return { ...prev, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      setBall2(prev => {
        let newX = prev.x + prev.vx;
        let newY = mode === '1D' ? trackY : prev.y + prev.vy;
        let newVx = prev.vx;
        let newVy = prev.vy;

        if (newX - prev.radius <= 0 || newX + prev.radius >= boxWidth) {
          newVx = -newVx * 0.8;
          newX = newX - prev.radius <= 0 ? prev.radius : boxWidth - prev.radius;
        }
        if (mode === '2D' && (newY - prev.radius <= 0 || newY + prev.radius >= boxHeight)) {
          newVy = -newVy * 0.8;
          newY = newY - prev.radius <= 0 ? prev.radius : boxHeight - prev.radius;
        }

        return { ...prev, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      setBall1(b1 => {
        setBall2(b2 => {
          if (checkCollision(b1, b2)) {
            const resolved = resolveCollision(b1, b2);
            setCollisions(prev => prev + 1);
            return resolved.b2;
          }
          return b2;
        });
        return b1;
      });
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [isRunning, mode, checkCollision, resolveCollision]);

  return (
    <div className="bg-slate-900/80 border border-purple-500/20 shadow-xl rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left: Simulation */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Collision Simulator</h2>
              <p className="text-slate-400 text-sm">
                Simulate collisions between two objects with adjustable masses and velocities.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-md text-xs border border-slate-700 bg-slate-800 text-slate-300">
                {isRunning ? "Running" : "Stopped"}
              </span>
              <span className="px-2 py-1 rounded-md text-xs border border-slate-700 bg-slate-800 text-slate-300">
                Collisions: {collisions}
              </span>
              <span className="px-2 py-1 rounded-md text-xs border border-slate-700 bg-slate-800 text-slate-300">
                {mode} Mode
              </span>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">Simulation Mode:</span>
            <div className="flex rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setMode('1D')}
                disabled={isRunning}
                className={`px-4 py-2 text-sm ${
                  mode === '1D'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                1D Collision
              </button>
              <button
                onClick={() => setMode('2D')}
                disabled={isRunning}
                className={`px-4 py-2 text-sm ${
                  mode === '2D'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                2D Collision
              </button>
            </div>
          </div>

          {/* Simulation Area */}
          <div className="rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 flex justify-center">
            <svg width={boxWidth} height={boxHeight} className="w-full h-auto">
              <rect
                width={boxWidth}
                height={boxHeight}
                fill="rgba(15, 23, 42, 0.6)"
                stroke="#334155"
                strokeWidth="2"
                rx="8"
              />
              {mode === '1D' && (
                <line
                  x1={50}
                  y1={trackY}
                  x2={boxWidth - 50}
                  y2={trackY}
                  stroke="#334155"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              )}
              <circle
                cx={ball1.x}
                cy={ball1.y}
                r={ball1.radius}
                fill="url(#ball1Gradient)"
                stroke="#1d4ed8"
                strokeWidth="2"
              />
              <text
                x={ball1.x}
                y={ball1.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {formatNumber(ball1.mass, 1)}kg
              </text>
              <circle
                cx={ball2.x}
                cy={ball2.y}
                r={ball2.radius}
                fill="url(#ball2Gradient)"
                stroke="#d97706"
                strokeWidth="2"
              />
              <text
                x={ball2.x}
                y={ball2.y + 4}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {formatNumber(ball2.mass, 1)}kg
              </text>
              <defs>
                <linearGradient id="ball1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="ball2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Ball 1 Controls */}
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4">
            <h3 className="text-lg font-semibold text-blue-400">Object 1</h3>
            <Control
              label="Mass"
              value={initialSettings.ball1.mass}
              unit="kg"
              min={0.5}
              max={10}
              step={0.1}
              onChange={(value) => updateInitialSettings(1, 'mass', value)}
              disabled={isRunning}
            />
            <Control
              label="Initial X Velocity"
              value={initialSettings.ball1.vx}
              unit="m/s"
              min={-10}
              max={10}
              step={0.2}
              onChange={(value) => updateInitialSettings(1, 'vx', value)}
              disabled={isRunning}
            />
            {mode === '2D' && (
              <Control
                label="Initial Y Velocity"
                value={initialSettings.ball1.vy}
                unit="m/s"
                min={-10}
                max={10}
                step={0.2}
                onChange={(value) => updateInitialSettings(1, 'vy', value)}
                disabled={isRunning}
              />
            )}
          </div>

          {/* Ball 2 Controls */}
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4">
            <h3 className="text-lg font-semibold text-purple-400">Object 2</h3>
            <Control
              label="Mass"
              value={initialSettings.ball2.mass}
              unit="kg"
              min={0.5}
              max={10}
              step={0.1}
              onChange={(value) => updateInitialSettings(2, 'mass', value)}
              disabled={isRunning}
            />
            <Control
              label="Initial X Velocity"
              value={initialSettings.ball2.vx}
              unit="m/s"
              min={-10}
              max={10}
              step={0.2}
              onChange={(value) => updateInitialSettings(2, 'vx', value)}
              disabled={isRunning}
            />
            {mode === '2D' && (
              <Control
                label="Initial Y Velocity"
                value={initialSettings.ball2.vy}
                unit="m/s"
                min={-10}
                max={10}
                step={0.2}
                onChange={(value) => updateInitialSettings(2, 'vy', value)}
                disabled={isRunning}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 justify-center">
            <button
              onClick={start}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-semibold text-white"
            >
              Start Simulation
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="w-full px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-semibold text-white"
            >
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={reset}
              className="w-full px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-semibold text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
