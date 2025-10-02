import { useState, useEffect, useCallback, useRef } from 'react';

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? Number.parseFloat(value).toFixed(digits) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value, step < 1 ? 1 : 0)} {unit}
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
        className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-white"
        disabled={disabled}
      />
      <span>{max}</span>
    </div>
  </div>
);

export default function CollisionSimulator() {
  const [mode, setMode] = useState('2D');
  const [ball1, setBall1] = useState({ x: 150, y: 200, vx: 3, vy: 2, mass: 2, radius: 25 });
  const [ball2, setBall2] = useState({ x: 450, y: 200, vx: -2, vy: -1, mass: 3, radius: 30 });
  const [initialSettings, setInitialSettings] = useState({
    ball1: { mass: 2, vx: 3, vy: 2 },
    ball2: { mass: 3, vx: -2, vy: -1 }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [collisions, setCollisions] = useState(0);
  const [collisionEffect, setCollisionEffect] = useState(null);
  const [trails, setTrails] = useState({ ball1: [], ball2: [] });
  
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);
  const lastCollisionRef = useRef(0);

  const boxWidth = 700;
  const boxHeight = 500;
  const trackY = 250;

  const reset = () => {
    const newBall1 = {
      x: 150,
      y: mode === '1D' ? trackY : 200,
      vx: initialSettings.ball1.vx,
      vy: mode === '1D' ? 0 : initialSettings.ball1.vy,
      mass: initialSettings.ball1.mass,
      radius: 15 + initialSettings.ball1.mass * 3
    };
    const newBall2 = {
      x: 550,
      y: mode === '1D' ? trackY : 300,
      vx: initialSettings.ball2.vx,
      vy: mode === '1D' ? 0 : initialSettings.ball2.vy,
      mass: initialSettings.ball2.mass,
      radius: 15 + initialSettings.ball2.mass * 3
    };
    setBall1(newBall1);
    setBall2(newBall2);
    setIsRunning(false);
    setCollisions(0);
    setCollisionEffect(null);
    setTrails({ ball1: [], ball2: [] });
    lastTimeRef.current = Date.now();
  };

  const toggleSimulation = () => {
    if (!isRunning) {
      lastTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
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
        radius: property === 'mass' ? 15 + value * 3 : prev.radius
      }));
    } else {
      setBall2(prev => ({
        ...prev,
        [property]: value,
        radius: property === 'mass' ? 15 + value * 3 : prev.radius
      }));
    }
  };

  const checkCollision = (b1, b2) => {
    if (mode === '1D') {
      return Math.abs(b2.x - b1.x) <= (b1.radius + b2.radius);
    } else {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= (b1.radius + b2.radius);
    }
  };

  const resolveCollision = (b1, b2) => {
    if (mode === '1D') {
      const u1 = b1.vx;
      const u2 = b2.vx;
      const m1 = b1.mass;
      const m2 = b2.mass;
      
      const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
      const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
      
      // Separate balls to prevent overlap
      const overlap = (b1.radius + b2.radius) - Math.abs(b2.x - b1.x);
      const separationX = overlap / 2 * (b1.x < b2.x ? -1 : 1);
      
      return {
        b1: { ...b1, vx: v1, x: b1.x + separationX },
        b2: { ...b2, vx: v2, x: b2.x - separationX }
      };
    } else {
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return { b1, b2 };
      
      const nx = dx / distance;
      const ny = dy / distance;
      
      // Separate balls
      const overlap = (b1.radius + b2.radius) - distance;
      if (overlap > 0) {
        b1 = { ...b1, x: b1.x - nx * overlap / 2, y: b1.y - ny * overlap / 2 };
        b2 = { ...b2, x: b2.x + nx * overlap / 2, y: b2.y + ny * overlap / 2 };
      }
      
      const dvx = b2.vx - b1.vx;
      const dvy = b2.vy - b1.vy;
      const dvn = dvx * nx + dvy * ny;
      
      if (dvn > 0) return { b1, b2 };
      
      const impulse = 2 * dvn / (b1.mass + b2.mass);
      
      return {
        b1: {
          ...b1,
          vx: b1.vx + impulse * b2.mass * nx,
          vy: b1.vy + impulse * b2.mass * ny
        },
        b2: {
          ...b2,
          vx: b2.vx - impulse * b1.mass * nx,
          vy: b2.vy - impulse * b1.mass * ny
        }
      };
    }
  };

  useEffect(() => {
    reset();
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      setBall1(prev => {
        let newX = prev.x + prev.vx * dt * 60;
        let newY = mode === '1D' ? trackY : prev.y + prev.vy * dt * 60;
        let newVx = prev.vx;
        let newVy = prev.vy;

        if (newX - prev.radius <= 0 || newX + prev.radius >= boxWidth) {
          newVx = -newVx * 0.95;
          newX = newX - prev.radius <= 0 ? prev.radius : boxWidth - prev.radius;
        }
        if (mode === '2D' && (newY - prev.radius <= 0 || newY + prev.radius >= boxHeight)) {
          newVy = -newVy * 0.95;
          newY = newY - prev.radius <= 0 ? prev.radius : boxHeight - prev.radius;
        }

        return { ...prev, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      setBall2(prev => {
        let newX = prev.x + prev.vx * dt * 60;
        let newY = mode === '1D' ? trackY : prev.y + prev.vy * dt * 60;
        let newVx = prev.vx;
        let newVy = prev.vy;

        if (newX - prev.radius <= 0 || newX + prev.radius >= boxWidth) {
          newVx = -newVx * 0.95;
          newX = newX - prev.radius <= 0 ? prev.radius : boxWidth - prev.radius;
        }
        if (mode === '2D' && (newY - prev.radius <= 0 || newY + prev.radius >= boxHeight)) {
          newVy = -newVy * 0.95;
          newY = newY - prev.radius <= 0 ? prev.radius : boxHeight - prev.radius;
        }

        return { ...prev, x: newX, y: newY, vx: newVx, vy: newVy };
      });

      setBall1(b1 => {
        setBall2(b2 => {
          if (checkCollision(b1, b2) && now - lastCollisionRef.current > 100) {
            const resolved = resolveCollision(b1, b2);
            setCollisions(prev => prev + 1);
            lastCollisionRef.current = now;
            
            const collisionX = (b1.x + b2.x) / 2;
            const collisionY = (b1.y + b2.y) / 2;
            setCollisionEffect({ x: collisionX, y: collisionY, time: now });
            
            setBall1(resolved.b1);
            return resolved.b2;
          }
          return b2;
        });
        return b1;
      });

      // Update trails
      setTrails(prev => {
        const newTrail1 = [...prev.ball1, { x: ball1.x, y: ball1.y }].slice(-15);
        const newTrail2 = [...prev.ball2, { x: ball2.x, y: ball2.y }].slice(-15);
        return { ball1: newTrail1, ball2: newTrail2 };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, mode, ball1.x, ball1.y, ball2.x, ball2.y]);

  // Calculate kinetic energies and momentum
  const ke1 = 0.5 * ball1.mass * (ball1.vx ** 2 + ball1.vy ** 2);
  const ke2 = 0.5 * ball2.mass * (ball2.vx ** 2 + ball2.vy ** 2);
  const totalKE = ke1 + ke2;
  
  const momentum1 = Math.sqrt((ball1.mass * ball1.vx) ** 2 + (ball1.mass * ball1.vy) ** 2);
  const momentum2 = Math.sqrt((ball2.mass * ball2.vx) ** 2 + (ball2.mass * ball2.vy) ** 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl rounded-2xl p-6 md:p-8">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
              Collision Simulator
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Explore elastic collisions in 1D and 2D with momentum and energy conservation
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Simulation Display */}
            <div className="xl:col-span-2 flex flex-col gap-4">
              
              {/* Mode Toggle */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-300">Mode:</span>
                  <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                    <button
                      onClick={() => setMode('1D')}
                      disabled={isRunning}
                      className={`px-4 py-2 text-sm font-semibold transition-all ${
                        mode === '1D'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      1D Linear
                    </button>
                    <button
                      onClick={() => setMode('2D')}
                      disabled={isRunning}
                      className={`px-4 py-2 text-sm font-semibold transition-all ${
                        mode === '2D'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      2D Planar
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isRunning 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                  }`}>
                    {isRunning ? 'Running' : 'Stopped'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Collisions: {collisions}
                  </span>
                </div>
              </div>

              {/* Simulation Canvas */}
              <div className="rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 shadow-inner">
                <svg width={boxWidth} height={boxHeight} className="w-full h-auto" viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
                  <defs>
                    <linearGradient id="ball1Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="ball2Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    <radialGradient id="collisionGradient">
                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  
                  <rect
                    width={boxWidth}
                    height={boxHeight}
                    fill="rgba(15, 23, 42, 0.4)"
                    rx="12"
                  />
                  
                  {/* 1D Track */}
                  {mode === '1D' && (
                    <>
                      <line
                        x1={30}
                        y1={trackY}
                        x2={boxWidth - 30}
                        y2={trackY}
                        stroke="#475569"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      <line
                        x1={30}
                        y1={trackY}
                        x2={boxWidth - 30}
                        y2={trackY}
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                  
                  {/* Motion Trails */}
                  {isRunning && mode === '2D' && (
                    <>
                      <path
                        d={`M ${trails.ball1.map((p, i) => `${i === 0 ? '' : 'L '}${p.x} ${p.y}`).join(' ')}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        opacity="0.3"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M ${trails.ball2.map((p, i) => `${i === 0 ? '' : 'L '}${p.x} ${p.y}`).join(' ')}`}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="2"
                        opacity="0.3"
                        strokeLinecap="round"
                      />
                    </>
                  )}
                  
                  {/* Collision Effect */}
                  {collisionEffect && Date.now() - collisionEffect.time < 300 && (
                    <circle
                      cx={collisionEffect.x}
                      cy={collisionEffect.y}
                      r={30 * (1 - (Date.now() - collisionEffect.time) / 300)}
                      fill="url(#collisionGradient)"
                      opacity={1 - (Date.now() - collisionEffect.time) / 300}
                    />
                  )}
                  
                  {/* Ball 1 */}
                  <circle
                    cx={ball1.x}
                    cy={ball1.y}
                    r={ball1.radius}
                    fill="url(#ball1Gradient)"
                    stroke="#60a5fa"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                  <text
                    x={ball1.x}
                    y={ball1.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {formatNumber(ball1.mass, 1)}
                  </text>
                  
                  {/* Ball 2 */}
                  <circle
                    cx={ball2.x}
                    cy={ball2.y}
                    r={ball2.radius}
                    fill="url(#ball2Gradient)"
                    stroke="#a855f7"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                  <text
                    x={ball2.x}
                    y={ball2.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {formatNumber(ball2.mass, 1)}
                  </text>
                  
                  {/* Velocity Vectors */}
                  {!isRunning && (
                    <>
                      <defs>
                        <marker id="arrowhead1" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                          <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
                        </marker>
                        <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                          <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
                        </marker>
                      </defs>
                      <line
                        x1={ball1.x}
                        y1={ball1.y}
                        x2={ball1.x + ball1.vx * 15}
                        y2={ball1.y + ball1.vy * 15}
                        stroke="#60a5fa"
                        strokeWidth="3"
                        markerEnd="url(#arrowhead1)"
                        opacity="0.8"
                      />
                      <line
                        x1={ball2.x}
                        y1={ball2.y}
                        x2={ball2.x + ball2.vx * 15}
                        y2={ball2.y + ball2.vy * 15}
                        stroke="#a855f7"
                        strokeWidth="3"
                        markerEnd="url(#arrowhead2)"
                        opacity="0.8"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Total Energy</div>
                  <div className="text-lg font-bold text-green-400">{formatNumber(totalKE, 1)} J</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Ball 1 KE</div>
                  <div className="text-lg font-bold text-blue-400">{formatNumber(ke1, 1)} J</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Ball 2 KE</div>
                  <div className="text-lg font-bold text-purple-400">{formatNumber(ke2, 1)} J</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Collisions</div>
                  <div className="text-lg font-bold text-orange-400">{collisions}</div>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="flex flex-col gap-4">
              
              {/* Ball 1 Controls */}
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-500/30 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  Object 1
                </h3>
                
                <Control
                  label="Mass"
                  value={initialSettings.ball1.mass}
                  unit="kg"
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={(value) => updateInitialSettings(1, 'mass', value)}
                  disabled={isRunning}
                />
                
                <Control
                  label="Velocity X"
                  value={initialSettings.ball1.vx}
                  unit="m/s"
                  min={-8}
                  max={8}
                  step={0.5}
                  onChange={(value) => updateInitialSettings(1, 'vx', value)}
                  disabled={isRunning}
                />
                
                {mode === '2D' && (
                  <Control
                    label="Velocity Y"
                    value={initialSettings.ball1.vy}
                    unit="m/s"
                    min={-8}
                    max={8}
                    step={0.5}
                    onChange={(value) => updateInitialSettings(1, 'vy', value)}
                    disabled={isRunning}
                  />
                )}
                
                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">Momentum</div>
                  <div className="text-sm font-semibold text-blue-300">{formatNumber(momentum1, 2)} kg⋅m/s</div>
                </div>
              </div>

              {/* Ball 2 Controls */}
              <div className="flex flex-col gap-4 rounded-2xl border border-purple-500/30 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold text-purple-400 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-600"></div>
                  Object 2
                </h3>
                
                <Control
                  label="Mass"
                  value={initialSettings.ball2.mass}
                  unit="kg"
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={(value) => updateInitialSettings(2, 'mass', value)}
                  disabled={isRunning}
                />
                
                <Control
                  label="Velocity X"
                  value={initialSettings.ball2.vx}
                  unit="m/s"
                  min={-8}
                  max={8}
                  step={0.5}
                  onChange={(value) => updateInitialSettings(2, 'vx', value)}
                  disabled={isRunning}
                />
                
                {mode === '2D' && (
                  <Control
                    label="Velocity Y"
                    value={initialSettings.ball2.vy}
                    unit="m/s"
                    min={-8}
                    max={8}
                    step={0.5}
                    onChange={(value) => updateInitialSettings(2, 'vy', value)}
                    disabled={isRunning}
                  />
                )}
                
                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400">Momentum</div>
                  <div className="text-sm font-semibold text-purple-300">{formatNumber(momentum2, 2)} kg⋅m/s</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-5">
                <button
                  onClick={toggleSimulation}
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                    isRunning 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  }`}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={reset}
                  className="w-full px-4 py-3 border-2 border-slate-600 hover:bg-slate-700 rounded-lg font-semibold text-white transition-all"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}