import { useState, useEffect, useRef } from 'react';

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? Number.parseFloat(value).toFixed(digits) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value, step < 1 ? 2 : 0)} {unit}
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

export default function SimplePendulumSim() {
  const [length, setLength] = useState(150);
  const [mass, setMass] = useState(2);
  const [angleDeg, setAngleDeg] = useState(45); // Degrees from vertical
  const [omega, setOmega] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);

  const boxWidth = 500;
  const boxHeight = 500;
  const pivot = { x: boxWidth / 2, y: 80 };
  const g = 980; // pixels/s² (scaled for visual effect)

  const thetaRad = (angleDeg * Math.PI) / 180;

  const reset = () => {
    setAngleDeg(45);
    setOmega(0);
    setIsRunning(false);
    lastTimeRef.current = Date.now();
  };

  const toggleSimulation = () => {
    if (!isRunning) {
      lastTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = now;

      // Use small time steps for accuracy
      const steps = 4;
      const smallDt = dt / steps;
      
      let currentTheta = (angleDeg * Math.PI) / 180;
      let currentOmega = omega;

      for (let i = 0; i < steps; i++) {
        // Simple pendulum: α = -(g/L) * sin(θ)
        const alpha = -(g / length) * Math.sin(currentTheta);
        currentOmega += alpha * smallDt;
        currentTheta += currentOmega * smallDt;
      }

      setAngleDeg((currentTheta * 180) / Math.PI);
      setOmega(currentOmega);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, length, angleDeg, omega]);

  // Calculate bob position
  const bobX = pivot.x + length * Math.sin(thetaRad);
  const bobY = pivot.y + length * Math.cos(thetaRad);

  // Calculate period
  const period = 2 * Math.PI * Math.sqrt(length / g);
  
  // Calculate energy (potential + kinetic)
  const height = length * (1 - Math.cos(thetaRad));
  const potentialEnergy = mass * (g / 100) * height; // Scaled
  const kineticEnergy = 0.5 * mass * Math.pow(omega * length, 2);
  const totalEnergy = potentialEnergy + kineticEnergy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl rounded-2xl p-6 md:p-8">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
              Simple Pendulum Simulator
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              Observe the motion of a simple pendulum with real-time physics simulation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Simulation Display */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 shadow-inner">
                <svg width={boxWidth} height={boxHeight} className="w-full h-auto" viewBox={`0 0 ${boxWidth} ${boxHeight}`}>
                  <defs>
                    <linearGradient id="bobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Background */}
                  <rect
                    width={boxWidth}
                    height={boxHeight}
                    fill="rgba(15, 23, 42, 0.4)"
                    rx="12"
                  />
                  
                  {/* Vertical reference line */}
                  <line
                    x1={pivot.x}
                    y1={pivot.y}
                    x2={pivot.x}
                    y2={pivot.y + 280}
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Angle arc */}
                  <path
                    d={`M ${pivot.x} ${pivot.y + 80} 
                        A 80 80 0 0 ${thetaRad > 0 ? 1 : 0} 
                        ${pivot.x + 80 * Math.sin(thetaRad)} 
                        ${pivot.y + 80 * Math.cos(thetaRad)}`}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    opacity="0.6"
                  />
                  
                  {/* Angle label */}
                  <text
                    x={pivot.x + (thetaRad > 0 ? 45 : -45)}
                    y={pivot.y + 95}
                    textAnchor="middle"
                    fill="#a855f7"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {formatNumber(Math.abs(angleDeg), 1)}°
                  </text>
                  
                  {/* Pivot point */}
                  <circle
                    cx={pivot.x}
                    cy={pivot.y}
                    r="8"
                    fill="#64748b"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  
                  {/* Pendulum rod */}
                  <line
                    x1={pivot.x}
                    y1={pivot.y}
                    x2={bobX}
                    y2={bobY}
                    stroke="#a855f7"
                    strokeWidth="3"
                    filter="url(#glow)"
                  />
                  
                  {/* Pendulum bob */}
                  <circle
                    cx={bobX}
                    cy={bobY}
                    r={12 + mass * 2}
                    fill="url(#bobGradient)"
                    stroke="#f472b6"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                  
                  {/* Mass label on bob */}
                  <text
                    x={bobX}
                    y={bobY + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {formatNumber(mass, 1)}
                  </text>
                </svg>
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Angle</div>
                  <div className="text-lg font-bold text-purple-400">{formatNumber(angleDeg, 1)}°</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Period</div>
                  <div className="text-lg font-bold text-pink-400">{formatNumber(period, 2)}s</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Velocity</div>
                  <div className="text-lg font-bold text-blue-400">{formatNumber(omega, 2)} rad/s</div>
                </div>
                <div className="bg-slate-950/60 border border-slate-700/40 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Energy</div>
                  <div className="text-lg font-bold text-green-400">{formatNumber(totalEnergy, 1)}J</div>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="flex flex-col gap-4">
              {/* Parameters */}
              <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-5">
                <h3 className="text-lg font-semibold text-purple-400 mb-2">Parameters</h3>
                
                <Control
                  label="Mass"
                  value={mass}
                  unit="kg"
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={setMass}
                  disabled={isRunning}
                />
                
                <Control
                  label="Length"
                  value={length}
                  unit="px"
                  min={50}
                  max={280}
                  step={5}
                  onChange={setLength}
                  disabled={isRunning}
                />
                
                <Control
                  label="Initial Angle"
                  value={angleDeg}
                  unit="°"
                  min={-90}
                  max={90}
                  step={1}
                  onChange={setAngleDeg}
                  disabled={isRunning}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-5">
                <button
                  onClick={toggleSimulation}
                  className={`w-full px-4 py-3 rounded-lg font-semibold text-white transition-all ${
                    isRunning 
                      ? 'bg-orange-600 hover:bg-orange-700' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isRunning ? 'Pause' : 'Start'}
                </button>
                
                <button
                  onClick={reset}
                  className="w-full px-4 py-3 border border-slate-600 hover:bg-slate-700 rounded-lg font-semibold text-white transition-all"
                >
                  Reset
                </button>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isRunning 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
                  }`}>
                    {isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}