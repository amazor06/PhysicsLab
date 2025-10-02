import { useState, useEffect, useRef } from "react";

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

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
      className="w-full accent-blue-500"
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

export default function BuoyancySimulator() {
  const [objectMass, setObjectMass] = useState(5);
  const [objectVolume, setObjectVolume] = useState(8);
  const [fluidDensity, setFluidDensity] = useState(1000);
  const [dragCoefficient, setDragCoefficient] = useState(0.5);

  const [objectY, setObjectY] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [bubbles, setBubbles] = useState([]);

  const velocityRef = useRef(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const svgWidth = 500;
  const svgHeight = 600;
  const fluidLevel = 100;
  const fluidBottom = 550;
  const objectRadius = 40;
  const g = 9.81;

  const volumeM3 = objectVolume / 1000;
  const objectDensity = objectMass / volumeM3;
  const weight = objectMass * g;
  const buoyantForce = fluidDensity * volumeM3 * g;
  const netForce = buoyantForce - weight;
  const willFloat = objectDensity < fluidDensity;

  const resetSimulation = () => {
    setObjectY(50);
    velocityRef.current = 0;
    setBubbles([]);
  };

  useEffect(() => {
    resetSimulation();
  }, [objectMass, objectVolume, fluidDensity]);

  useEffect(() => {
    if (!isRunning) return;
    lastTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      let vel = velocityRef.current;
      let pos = objectY;

      const objectCenter = pos + objectRadius;
      const objectBottom = pos + objectRadius * 2;
      const inFluid = objectBottom > fluidLevel && objectCenter < fluidBottom;

      if (inFluid) {
        const acceleration = netForce / objectMass;
        const dragForce =
          -0.5 * dragCoefficient * fluidDensity * volumeM3 * vel * Math.abs(vel);
        const dragAcceleration = dragForce / objectMass;
        vel += (acceleration + dragAcceleration) * dt * 10;
      } else if (objectBottom <= fluidLevel) {
        vel += g * dt * 2;
      } else {
        vel = 0;
      }

      pos += vel * dt * 50;

      const maxY = fluidBottom - objectRadius * 2;
      if (pos < -50) {
        pos = -50;
        vel *= 0.3;
      }
      if (pos > maxY) {
        pos = maxY;
        vel = 0;
      }

      velocityRef.current = vel;
      setObjectY(pos);

      if (Math.random() < 0.2 && vel < -0.5 && inFluid) {
        setBubbles((prev) => [
          ...prev,
          {
            x: svgWidth / 2 + (Math.random() - 0.5) * objectRadius * 1.5,
            y: pos + objectRadius * 2,
            size: 2 + Math.random() * 4,
            id: Date.now() + Math.random(),
          },
        ]);
      }
      setBubbles((prev) =>
        prev.map((b) => ({ ...b, y: b.y - 1.5 })).filter((b) => b.y > fluidLevel)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, netForce, objectMass, dragCoefficient, fluidDensity, objectY]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    resetSimulation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 shadow-2xl rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Simulation Area */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                    Buoyancy Simulator
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Archimedes' Principle in Action</p>
                </div>
                <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                  isRunning 
                    ? 'border-green-500/50 bg-green-500/10 text-green-400' 
                    : 'border-slate-700 bg-slate-800/50 text-slate-300'
                }`}>
                  {isRunning ? "● Running" : "○ Stopped"}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-950/80 to-slate-900/80 p-8 shadow-inner">
                <svg width={svgWidth} height={svgHeight} className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.1))' }}>
                  <defs>
                    <linearGradient id="fluidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
                      <stop offset="100%" stopColor="rgba(29, 78, 216, 0.7)" />
                    </linearGradient>
                    <linearGradient id="objectGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#cbd5e1" />
                      <stop offset="50%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <radialGradient id="highlight">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                      <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
                    </radialGradient>
                    <radialGradient id="bubbleGradient">
                      <stop offset="0%" stopColor="rgba(147, 197, 253, 0.9)" />
                      <stop offset="70%" stopColor="rgba(59, 130, 246, 0.5)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                    </radialGradient>
                    <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 0 10 Q 25 5, 50 10 T 100 10" fill="none" stroke="rgba(147, 197, 253, 0.4)" strokeWidth="2"/>
                    </pattern>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Container */}
                  <rect
                    x="50"
                    y="50"
                    width="400"
                    height="500"
                    fill="none"
                    stroke="rgba(71, 85, 105, 0.8)"
                    strokeWidth="3"
                    rx="8"
                  />

                  {/* Air label */}
                  <text x="250" y="75" textAnchor="middle" fill="rgba(148, 163, 184, 0.9)" fontSize="14" fontWeight="600">
                    Air
                  </text>

                  {/* Fluid */}
                  <rect
                    x="50"
                    y={fluidLevel}
                    width="400"
                    height={fluidBottom - fluidLevel}
                    fill="url(#fluidGradient)"
                  />

                  {/* Waves at surface */}
                  <rect
                    x="50"
                    y={fluidLevel - 10}
                    width="400"
                    height="20"
                    fill="url(#waves)"
                  />

                  {/* Fluid surface line */}
                  <line
                    x1="50"
                    y1={fluidLevel}
                    x2="450"
                    y2={fluidLevel}
                    stroke="rgba(147, 197, 253, 0.9)"
                    strokeWidth="2.5"
                    filter="url(#glow)"
                  />

                  {/* Bubbles */}
                  {bubbles.map((bubble) => (
                    <circle
                      key={bubble.id}
                      cx={bubble.x}
                      cy={bubble.y}
                      r={bubble.size}
                      fill="url(#bubbleGradient)"
                      opacity="0.7"
                    />
                  ))}

                  {/* Object */}
                  <g>
                    {/* Main sphere with glow */}
                    <circle
                      cx={svgWidth / 2}
                      cy={objectY + objectRadius}
                      r={objectRadius + 3}
                      fill="rgba(100, 116, 139, 0.3)"
                      filter="url(#glow)"
                    />
                    <circle
                      cx={svgWidth / 2}
                      cy={objectY + objectRadius}
                      r={objectRadius}
                      fill="url(#objectGradient)"
                      stroke="rgba(71, 85, 105, 0.8)"
                      strokeWidth="2"
                    />
                    
                    {/* Highlight */}
                    <ellipse
                      cx={svgWidth / 2 - 15}
                      cy={objectY + objectRadius - 15}
                      rx="18"
                      ry="25"
                      fill="url(#highlight)"
                    />
                    
                    {/* Secondary highlight */}
                    <ellipse
                      cx={svgWidth / 2 + 12}
                      cy={objectY + objectRadius - 8}
                      rx="8"
                      ry="12"
                      fill="rgba(255, 255, 255, 0.2)"
                    />
                  </g>

                  {/* Force arrows when in fluid */}
                  {objectY + objectRadius * 2 > fluidLevel && objectY + objectRadius < fluidBottom && (
                    <g>
                      <defs>
                        <marker id="arrowUp" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                          <polygon points="0,5 10,5 5,0" fill="#22c55e" />
                        </marker>
                        <marker id="arrowDown" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                          <polygon points="0,5 10,5 5,10" fill="#ef4444" />
                        </marker>
                      </defs>
                    
                    </g>
                  )}

                  {/* Depth markers */}
                  <g opacity="0.5">
                    <line x1="460" y1={fluidLevel} x2="485" y2={fluidLevel} stroke="rgba(148, 163, 184, 0.6)" strokeWidth="2"/>
                    <line x1="460" y1={fluidBottom} x2="485" y2={fluidBottom} stroke="rgba(148, 163, 184, 0.6)" strokeWidth="2"/>
                    <line x1="472" y1={fluidLevel} x2="472" y2={fluidBottom} stroke="rgba(148, 163, 184, 0.6)" strokeWidth="2" strokeDasharray="5,5"/>
                  </g>
                </svg>
              </div>

              {/* Stats Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                  <div className="text-xs text-green-400 mb-1 font-semibold tracking-wide">BUOYANT FORCE</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(buoyantForce)} <span className="text-sm text-slate-400">N ↑</span></div>
                </div>
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
                  <div className="text-xs text-red-400 mb-1 font-semibold tracking-wide">WEIGHT</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(weight)} <span className="text-sm text-slate-400">N ↓</span></div>
                </div>
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="text-xs text-purple-400 mb-1 font-semibold tracking-wide">NET FORCE</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(Math.abs(netForce))} <span className="text-sm text-slate-400">N {netForce > 0 ? '↑' : '↓'}</span></div>
                </div>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="text-xs text-blue-400 mb-1 font-semibold tracking-wide">OBJECT DENSITY</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(objectDensity, 0)} <span className="text-sm text-slate-400">kg/m³</span></div>
                </div>
              </div>

              {/* Prediction Box */}
              <div className={`rounded-xl border p-4 ${
                willFloat 
                  ? 'border-green-500/30 bg-green-500/5' 
                  : 'border-red-500/30 bg-red-500/5'
              }`}>
                <div className="text-sm text-slate-300 leading-relaxed">
                  <strong className={willFloat ? 'text-green-400' : 'text-red-400'}>
                    Prediction: Object will {willFloat ? 'FLOAT ↑' : 'SINK ↓'}
                  </strong>
                  <div className="mt-2 text-xs text-slate-400">
                    F<sub>buoyant</sub> = ρ<sub>fluid</sub> × V × g = {formatNumber(fluidDensity)} × {formatNumber(volumeM3, 4)} × {g} = {formatNumber(buoyantForce)} N
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    F<sub>weight</sub> = m × g = {formatNumber(objectMass)} × {g} = {formatNumber(weight)} N
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-6">
                <Control
                  label="Object Mass"
                  value={objectMass}
                  unit="kg"
                  min={1}
                  max={20}
                  step={0.5}
                  onChange={setObjectMass}
                  disabled={isRunning}
                />
                <Control
                  label="Object Volume"
                  value={objectVolume}
                  unit="L"
                  min={1}
                  max={20}
                  step={0.5}
                  onChange={setObjectVolume}
                  disabled={isRunning}
                />
                <Control
                  label="Fluid Density"
                  value={fluidDensity}
                  unit="kg/m³"
                  min={500}
                  max={2000}
                  step={50}
                  onChange={setFluidDensity}
                  disabled={isRunning}
                />
                <Control
                  label="Drag Coefficient"
                  value={dragCoefficient}
                  unit=""
                  min={0.1}
                  max={2}
                  step={0.1}
                  onChange={setDragCoefficient}
                  disabled={isRunning}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-6">
                <button
                  onClick={start}
                  disabled={isRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Start Simulation
                </button>
                <button
                  onClick={pause}
                  className="w-full px-4 py-3 border border-slate-600 hover:bg-slate-700/50 rounded-lg font-semibold text-white transition-all duration-200"
                >
                  Pause
                </button>
                <button
                  onClick={reset}
                  className="w-full px-4 py-3 border border-slate-600 hover:bg-slate-700/50 rounded-lg font-semibold text-white transition-all duration-200"
                >
                  Reset
                </button>
              </div>

              {/* Presets */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="text-xs text-amber-400 mb-3 font-semibold tracking-wide">💡 QUICK PRESETS</div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setObjectMass(2); setObjectVolume(8); setFluidDensity(1000); }}
                    disabled={isRunning}
                    className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-all duration-200 border border-slate-700/50"
                  >
                    🎈 Balloon (floats)
                  </button>
                  <button
                    onClick={() => { setObjectMass(8); setObjectVolume(8); setFluidDensity(1000); }}
                    disabled={isRunning}
                    className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-all duration-200 border border-slate-700/50"
                  >
                    ⚽ Ball (neutral)
                  </button>
                  <button
                    onClick={() => { setObjectMass(15); setObjectVolume(8); setFluidDensity(1000); }}
                    disabled={isRunning}
                    className="text-xs text-left px-3 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-all duration-200 border border-slate-700/50"
                  >
                    🪨 Rock (sinks)
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}