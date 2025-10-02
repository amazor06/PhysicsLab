import { useState, useEffect, useRef } from 'react';

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
      className="w-full accent-cyan-500"
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

export default function FlowRateSim() {
  const [diameter1, setDiameter1] = useState(80);
  const [diameter2, setDiameter2] = useState(40);
  const [velocity1, setVelocity1] = useState(50); // Input velocity in tube 1
  const [particles, setParticles] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const svgWidth = 600;
  const svgHeight = 300;
  const tube1Start = 50;
  const tube1End = 250;
  const tube2Start = 350;
  const tube2End = 550;

  // Calculate areas and velocity in tube 2 using continuity equation
  const area1 = Math.PI * (diameter1 / 2) ** 2;
  const area2 = Math.PI * (diameter2 / 2) ** 2;
  const velocity2 = (area1 / area2) * velocity1; // A1*V1 = A2*V2
  const flowRate = area1 * velocity1;

  const resetParticles = () => {
    const initialParticles = [];
    // Distribute particles more evenly throughout both tubes
    for (let i = 0; i < 40; i++) {
      let x, section, diameter;
      
      if (i < 20) {
        // First tube
        x = tube1Start + Math.random() * (tube1End - tube1Start);
        section = 1;
        diameter = diameter1;
      } else {
        // Second tube
        x = tube2Start + Math.random() * (tube2End - tube2Start);
        section = 2;
        diameter = diameter2;
      }
      
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (diameter / 2 - 4);
      
      initialParticles.push({
        x,
        y: svgHeight / 2 + Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        section
      });
    }
    setParticles(initialParticles);
  };

  useEffect(() => {
    resetParticles();
  }, [diameter1, diameter2]);

  useEffect(() => {
    if (!isRunning) {
      lastTimeRef.current = Date.now();
      return;
    }

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      setParticles(prev => prev.map(p => {
        let newX = p.x;
        let newSection = p.section;
        let newY = p.y;
        let newZ = p.z;

        if (p.section === 1) {
          // In first tube - use velocity1
          newX = p.x + velocity1 * deltaTime;
          
          if (newX >= tube1End) {
            // Transition to second tube
            newSection = 2;
            newX = tube2Start + (newX - tube1End);
            
            // Scale radial position proportionally to diameter change
            const scale = diameter2 / diameter1;
            const yOffset = p.y - svgHeight / 2;
            newY = svgHeight / 2 + yOffset * scale;
            newZ = p.z * scale;
          }
        } else {
          // In second tube - use velocity2 (calculated from continuity)
          newX = p.x + velocity2 * deltaTime;
          
          if (newX >= tube2End) {
            // Reset to beginning of first tube
            newSection = 1;
            newX = tube1Start + (newX - tube2End);
            
            // Create new random position in tube 1
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (diameter1 / 2 - 4);
            newY = svgHeight / 2 + Math.cos(angle) * radius;
            newZ = Math.sin(angle) * radius;
          }
        }

        return { x: newX, y: newY, z: newZ, section: newSection };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, velocity1, velocity2, diameter1, diameter2]);

  const start = () => {
    lastTimeRef.current = Date.now();
    setIsRunning(true);
  };
  
  const pause = () => setIsRunning(false);
  
  const reset = () => {
    setIsRunning(false);
    resetParticles();
  };

  // Sort particles by z-index for proper depth rendering
  const sortedParticles = [...particles].sort((a, b) => a.z - b.z);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 shadow-2xl rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Simulation */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Flow Rate Simulator
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Demonstrating the Continuity Equation</p>
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
                <svg width={svgWidth} height={svgHeight} className="w-full h-auto" style={{ filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.1))' }}>
                  <defs>
                    <linearGradient id="tubeGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(6, 182, 212, 0.3)" />
                      <stop offset="50%" stopColor="rgba(6, 182, 212, 0.5)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.2)" />
                    </linearGradient>
                    <linearGradient id="tubeGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(14, 165, 233, 0.3)" />
                      <stop offset="50%" stopColor="rgba(14, 165, 233, 0.5)" />
                      <stop offset="100%" stopColor="rgba(14, 165, 233, 0.2)" />
                    </linearGradient>
                    <radialGradient id="particleGradient">
                      <stop offset="0%" stopColor="rgba(34, 211, 238, 1)" />
                      <stop offset="70%" stopColor="rgba(6, 182, 212, 0.8)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                    </radialGradient>
                  </defs>

                  {/* First Tube */}
                  <ellipse
                    cx={tube1Start}
                    cy={svgHeight / 2}
                    rx="8"
                    ry={diameter1 / 2}
                    fill="rgba(8, 145, 178, 0.5)"
                    stroke="rgba(6, 182, 212, 0.8)"
                    strokeWidth="2"
                  />
                  <rect
                    x={tube1Start}
                    y={svgHeight / 2 - diameter1 / 2}
                    width={tube1End - tube1Start}
                    height={diameter1}
                    fill="url(#tubeGradient1)"
                    stroke="rgba(6, 182, 212, 0.6)"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx={tube1End}
                    cy={svgHeight / 2}
                    rx="8"
                    ry={diameter1 / 2}
                    fill="rgba(8, 145, 178, 0.7)"
                    stroke="rgba(6, 182, 212, 0.8)"
                    strokeWidth="2"
                  />

                  {/* Second Tube */}
                  <ellipse
                    cx={tube2Start}
                    cy={svgHeight / 2}
                    rx="8"
                    ry={diameter2 / 2}
                    fill="rgba(20, 184, 166, 0.5)"
                    stroke="rgba(14, 165, 233, 0.8)"
                    strokeWidth="2"
                  />
                  <rect
                    x={tube2Start}
                    y={svgHeight / 2 - diameter2 / 2}
                    width={tube2End - tube2Start}
                    height={diameter2}
                    fill="url(#tubeGradient2)"
                    stroke="rgba(14, 165, 233, 0.6)"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx={tube2End}
                    cy={svgHeight / 2}
                    rx="8"
                    ry={diameter2 / 2}
                    fill="rgba(20, 184, 166, 0.7)"
                    stroke="rgba(14, 165, 233, 0.8)"
                    strokeWidth="2"
                  />

                  {/* Transition connector */}
                  <path
                    d={`M ${tube1End} ${svgHeight / 2 - diameter1 / 2} 
                        Q ${(tube1End + tube2Start) / 2} ${svgHeight / 2 - diameter1 / 2}, ${tube2Start} ${svgHeight / 2 - diameter2 / 2}
                        L ${tube2Start} ${svgHeight / 2 + diameter2 / 2}
                        Q ${(tube1End + tube2Start) / 2} ${svgHeight / 2 + diameter1 / 2}, ${tube1End} ${svgHeight / 2 + diameter1 / 2}
                        Z`}
                    fill="rgba(6, 182, 212, 0.25)"
                    stroke="rgba(6, 182, 212, 0.5)"
                    strokeWidth="2"
                  />

                  {/* Fluid Particles with depth */}
                  {sortedParticles.map((p, idx) => {
                    const brightness = 0.6 + (p.z / 60) * 0.4;
                    const size = 3.5 + (p.z / 60) * 1.5;
                    return (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={size}
                        fill="url(#particleGradient)"
                        opacity={brightness}
                      />
                    );
                  })}

                  {/* Labels */}
                  <text x={tube1Start + (tube1End - tube1Start) / 2} y={svgHeight / 2 - diameter1 / 2 - 15} 
                        textAnchor="middle" fill="rgba(6, 182, 212, 0.9)" fontSize="14" fontWeight="600">
                    Tube 1
                  </text>
                  <text x={tube2Start + (tube2End - tube2Start) / 2} y={svgHeight / 2 - diameter2 / 2 - 15} 
                        textAnchor="middle" fill="rgba(14, 165, 233, 0.9)" fontSize="14" fontWeight="600">
                    Tube 2
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
                  <div className="text-xs text-cyan-400 mb-1 font-semibold">TUBE 1 VELOCITY</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(velocity1)} <span className="text-sm text-slate-400">u/s</span></div>
                </div>
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                  <div className="text-xs text-blue-400 mb-1 font-semibold">TUBE 2 VELOCITY</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(velocity2)} <span className="text-sm text-slate-400">u/s</span></div>
                </div>
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
                  <div className="text-xs text-purple-400 mb-1 font-semibold">FLOW RATE</div>
                  <div className="text-2xl font-bold text-white">{formatNumber(flowRate)} <span className="text-sm text-slate-400">u³/s</span></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
                <div className="text-sm text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400">Continuity Equation:</strong> A₁V₁ = A₂V₂ = Q
                  <div className="mt-2 text-xs text-slate-400">
                    Flow rate Q = {formatNumber(flowRate)} units³/s is constant. When diameter decreases from {diameter1} to {diameter2} units, 
                    velocity increases from {formatNumber(velocity1)} to {formatNumber(velocity2)} units/s to maintain constant flow.
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-6">
                <Control
                  label="Tube 1 Diameter"
                  value={diameter1}
                  unit="units"
                  min={30}
                  max={120}
                  step={1}
                  onChange={setDiameter1}
                  disabled={isRunning}
                />
                <Control
                  label="Tube 2 Diameter"
                  value={diameter2}
                  unit="units"
                  min={20}
                  max={120}
                  step={1}
                  onChange={setDiameter2}
                  disabled={isRunning}
                />
                <Control
                  label="Inlet Velocity (Tube 1)"
                  value={velocity1}
                  unit="u/s"
                  min={10}
                  max={150}
                  step={5}
                  onChange={setVelocity1}
                  disabled={isRunning}
                />
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-6">
                <button
                  onClick={start}
                  disabled={isRunning}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-semibold text-white shadow-lg transition-all duration-200"
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

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="text-xs text-amber-400 mb-2 font-semibold">💡 TIP</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Make Tube 2 diameter much smaller (e.g., 25 units) and watch the particles speed up dramatically!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}