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
      className="w-full accent-pink-500"
      disabled={disabled}
    />
  </div>
);

export default function WaveStringSim() {
  const [amplitude, setAmplitude] = useState(50); // px
  const [wavelength, setWavelength] = useState(200); // px
  const [frequency, setFrequency] = useState(1); // Hz
  const [isRunning, setIsRunning] = useState(false);

  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const svgWidth = 800;
  const svgHeight = 400;
  const baseline = svgHeight / 2;

  // Generate wave points
  const generatePath = (t) => {
    const k = (2 * Math.PI) / wavelength; // wave number
    const omega = 2 * Math.PI * frequency; // angular frequency
    const A = amplitude;

    let path = `M 0 ${baseline}`;
    const step = 5; // pixel step
    for (let x = 0; x <= svgWidth; x += step) {
      const y = baseline - A * Math.sin(k * x - omega * t);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    lastTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      setTime((prev) => prev + dt);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, frequency]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-lg">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">
        Wave on a String
      </h2>
      <svg width={svgWidth} height={svgHeight} className="bg-slate-800 rounded">
        {/* Baseline */}
        <line
          x1="0"
          y1={baseline}
          x2={svgWidth}
          y2={baseline}
          stroke="gray"
          strokeDasharray="4"
        />

        {/* Wave Path */}
        <path
          d={generatePath(time)}
          stroke="pink"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Control
          label="Amplitude"
          value={amplitude}
          unit="px"
          min={10}
          max={100}
          step={5}
          onChange={setAmplitude}
          disabled={isRunning}
        />
        <Control
          label="Wavelength"
          value={wavelength}
          unit="px"
          min={50}
          max={400}
          step={10}
          onChange={setWavelength}
          disabled={isRunning}
        />
        <Control
          label="Frequency"
          value={frequency}
          unit="Hz"
          min={0.2}
          max={5}
          step={0.1}
          onChange={setFrequency}
          disabled={isRunning}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={start}
          disabled={isRunning}
          className="px-4 py-2 bg-pink-600 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={pause}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Pause
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
