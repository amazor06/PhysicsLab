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

export default function SimplePendulumSim() {
  const [length, setLength] = useState(150); // Pendulum string length in pixels
  const [mass, setMass] = useState(2);       // Mass in kg
  const [theta, setTheta] = useState(Math.PI / 4); // Initial angle (radians)
  const [omega, setOmega] = useState(0);     // Angular velocity
  const [isRunning, setIsRunning] = useState(false);

  const boxWidth = 400;
  const boxHeight = 400;
  const pivot = { x: boxWidth / 2, y: 50 }; // Fixed pivot point
  const g = 9.81; // gravity

  const reset = () => {
    setTheta(Math.PI / 4);
    setOmega(0);
    setIsRunning(false);
  };

  const start = () => {
    setIsRunning(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTheta(prevTheta => {
        setOmega(prevOmega => {
          // Simple pendulum equation: θ'' = -g/L * sin(θ)
          const alpha = - (g / length) * Math.sin(prevTheta);
          const newOmega = prevOmega + alpha * 0.016; // dt ~16ms
          const newTheta = prevTheta + newOmega * 0.016;
          setTheta(newTheta);
          return newOmega;
        });
        return omega;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isRunning, length]);

  // Calculate bob position
  const bobX = pivot.x + length * Math.sin(theta);
  const bobY = pivot.y + length * Math.cos(theta);

  return (
    <div className="bg-slate-900/80 border border-purple-500/20 shadow-xl rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left: Simulation */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Simple Pendulum Simulator</h2>
              <p className="text-slate-400 text-sm">
                Simulate a pendulum swinging under gravity with adjustable length, mass, and initial angle.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-md text-xs border border-slate-700 bg-slate-800 text-slate-300">
                {isRunning ? "Running" : "Stopped"}
              </span>
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
              {/* Pendulum rod */}
              <line
                x1={pivot.x}
                y1={pivot.y}
                x2={bobX}
                y2={bobY}
                stroke="#a855f7"
                strokeWidth="4"
              />
              {/* Pendulum bob */}
              <circle
                cx={bobX}
                cy={bobY}
                r={15 + mass * 2}
                fill="url(#bobGradient)"
                stroke="#f472b6"
                strokeWidth="2"
              />
              <text
                x={bobX}
                y={bobY + 4}
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                {formatNumber(mass, 1)}kg
              </text>
              <defs>
                <linearGradient id="bobGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity="0.95" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4">
            <h3 className="text-lg font-semibold text-purple-400">Pendulum Controls</h3>
            <Control
              label="Mass"
              value={mass}
              unit="kg"
              min={0.5}
              max={10}
              step={0.1}
              onChange={setMass}
              disabled={isRunning}
            />
            <Control
              label="Length"
              value={length}
              unit="px"
              min={50}
              max={300}
              step={1}
              onChange={setLength}
              disabled={isRunning}
            />
            <Control
              label="Initial Angle"
              value={theta}
              unit="rad"
              min={-Math.PI}
              max={Math.PI}
              step={0.01}
              onChange={setTheta}
              disabled={isRunning}
            />
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
