import { useState, useEffect } from 'react';

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

export default function FlowRateSim() {
  const [pipeWidth, setPipeWidth] = useState(100); // pixels
  const [fluidVelocity, setFluidVelocity] = useState(2); // px per frame
  const [particles, setParticles] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const boxWidth = 400;
  const boxHeight = 200;
  const pipeHeight = 50; // default height for visual pipe

  const flowRate = (pipeWidth * fluidVelocity / 1000).toFixed(2); // arbitrary units

  const resetParticles = () => {
    const initialParticles = [];
    for (let i = 0; i < 10; i++) {
      initialParticles.push({ x: Math.random() * boxWidth, y: pipeHeight / 2 });
    }
    setParticles(initialParticles);
  };

  useEffect(() => {
    resetParticles();
  }, [pipeWidth]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + fluidVelocity) % boxWidth
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, fluidVelocity, boxWidth]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    resetParticles();
  };

  return (
    <div className="bg-slate-900/80 border border-purple-500/20 shadow-xl rounded-xl p-6">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Simulation */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Flow Rate Simulator</h2>
            <span className="px-2 py-1 rounded-md text-xs border border-slate-700 bg-slate-800 text-slate-300">
              {isRunning ? "Running" : "Stopped"}
            </span>
          </div>

          <div className="rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 flex justify-center items-center">
            <svg width={boxWidth} height={boxHeight} className="w-full h-auto">
              {/* Pipe */}
              <rect
                x={(boxWidth - pipeWidth) / 2}
                y={(boxHeight - pipeHeight) / 2}
                width={pipeWidth}
                height={pipeHeight}
                fill="rgba(59, 130, 246, 0.6)"
                stroke="#1e3a8a"
                strokeWidth="2"
                rx="4"
              />
              {/* Fluid Particles */}
              {particles.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={(boxHeight - pipeHeight) / 2 + pipeHeight / 2}
                  r="5"
                  fill="#60a5fa"
                />
              ))}
            </svg>
          </div>

          <div className="text-white text-sm mt-2">
            <strong>Flow Rate:</strong> {flowRate} (arbitrary units)
          </div>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4">
            <Control
              label="Pipe Width"
              value={pipeWidth}
              unit="px"
              min={50}
              max={300}
              step={1}
              onChange={setPipeWidth}
              disabled={isRunning}
            />
            <Control
              label="Fluid Velocity"
              value={fluidVelocity}
              unit="px/frame"
              min={0.5}
              max={10}
              step={0.1}
              onChange={setFluidVelocity}
              disabled={isRunning}
            />
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 justify-center">
            <button
              onClick={start}
              disabled={isRunning}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 rounded-lg font-semibold text-white"
            >
              Start
            </button>
            <button
              onClick={pause}
              className="w-full px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg font-semibold text-white"
            >
              Pause
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
