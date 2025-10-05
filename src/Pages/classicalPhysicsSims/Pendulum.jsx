// Pendulum.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "../../components/ui.jsx";

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

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
        className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-white"
        disabled={disabled}
      />
      <span>{max}</span>
    </div>
  </div>
);

export default function PendulumSimulation() {
  const [length, setLength] = useState(150);
  const [mass, setMass] = useState(2);
  const [angleDeg, setAngleDeg] = useState(45);
  const [omega, setOmega] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);

  const boxWidth = 640;
  const boxHeight = 400;
  const pivot = useMemo(() => ({ x: boxWidth / 2, y: 60 }), [boxWidth]);
  const g = 980; // scaled gravity for pixels/s²

  const thetaRad = (angleDeg * Math.PI) / 180;

  const toggleSimulation = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setAngleDeg(45);
    setOmega(0);
    setIsRunning(false);
    lastTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const steps = 4;
      const smallDt = dt / steps;
      let currentTheta = (angleDeg * Math.PI) / 180;
      let currentOmega = omega;

      for (let i = 0; i < steps; i++) {
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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, length, angleDeg, omega]);

  // Derived quantities
  const bobX = pivot.x + length * Math.sin(thetaRad);
  const bobY = pivot.y + length * Math.cos(thetaRad);
  const period = 2 * Math.PI * Math.sqrt(length / g);
  const height = length * (1 - Math.cos(thetaRad));
  const potentialEnergy = mass * (g / 100) * height;
  const kineticEnergy = 0.5 * mass * Math.pow(omega * length, 2);
  const totalEnergy = potentialEnergy + kineticEnergy;

  return (
    <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Pendulum Studio</h2>
            <p className="text-slate-400 text-sm">
              Visualize simple harmonic motion and energy conversion in a pendulum.
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-wide text-xs">
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation Display */}
          <motion.div
            className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <svg
              width={boxWidth}
              height={boxHeight}
              viewBox={`0 0 ${boxWidth} ${boxHeight}`}
              className="w-full h-auto"
            >
              <defs>
                <linearGradient id="bobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background */}
              <rect
                width={boxWidth}
                height={boxHeight}
                fill="rgba(15,23,42,0.4)"
                rx="12"
              />

              {/* Reference line */}
              <line
                x1={pivot.x}
                y1={pivot.y}
                x2={pivot.x}
                y2={pivot.y + length + 60}
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
                stroke="#60a5fa"
                strokeWidth="2"
                opacity="0.7"
              />

              <text
                x={pivot.x + (thetaRad > 0 ? 45 : -45)}
                y={pivot.y + 95}
                textAnchor="middle"
                fill="#38bdf8"
                fontSize="14"
                fontWeight="bold"
              >
                {formatNumber(Math.abs(angleDeg), 1)}°
              </text>

              {/* Pivot */}
              <circle
                cx={pivot.x}
                cy={pivot.y}
                r="8"
                fill="#64748b"
                stroke="#cbd5e1"
                strokeWidth="2"
              />

              {/* Rod */}
              <line
                x1={pivot.x}
                y1={pivot.y}
                x2={bobX}
                y2={bobY}
                stroke="#a855f7"
                strokeWidth="3"
                filter="url(#glow)"
              />

              {/* Bob */}
              <circle
                cx={bobX}
                cy={bobY}
                r={10 + mass * 2}
                fill="url(#bobGradient)"
                stroke="#a855f7"
                strokeWidth="2"
                filter="url(#glow)"
              />

              {/* Mass label */}
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
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
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

            <div className="mt-4 flex flex-col gap-3">
              <Button onClick={toggleSimulation} className="w-full">
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" onClick={reset} className="w-full">
                Reset
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(angleDeg, 1)}°
            </div>
            <div className="text-xs text-slate-400">Angle</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(period, 2)}s
            </div>
            <div className="text-xs text-slate-400">Period</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(omega, 2)}
            </div>
            <div className="text-xs text-slate-400">Angular Velocity (rad/s)</div>
          </div>
          <div>
          </div>
        </div>
      </div>
    </Card>
  );
}
