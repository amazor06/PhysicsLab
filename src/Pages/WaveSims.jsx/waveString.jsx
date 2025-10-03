import { useState, useEffect, useRef } from "react";

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-emerald-400">
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
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      disabled={disabled}
    />
  </div>
);

const PhysicsSidebar = ({ isOpen, onClose, frequency, wavelength, amplitude }) => {
  const waveSpeed = frequency * wavelength;
  const period = 1 / frequency;
  const angularFreq = 2 * Math.PI * frequency;
  const waveNumber = (2 * Math.PI) / wavelength;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <h3 className="text-2xl font-bold text-slate-800">Wave Physics</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-slate-700">
          <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Wave Equation</h4>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm border border-slate-200">
              y(x,t) = A sin(kx - ωt)
            </div>
            <p className="mt-2 text-sm text-slate-600">
              The fundamental equation describing wave motion on a string.
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Parameters</h4>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">A = {formatNumber(amplitude)} px</div>
                <div className="text-xs text-slate-600">Amplitude: Maximum displacement from equilibrium</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">λ = {formatNumber(wavelength)} px</div>
                <div className="text-xs text-slate-600">Wavelength: Distance between wave peaks</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">f = {formatNumber(frequency)} Hz</div>
                <div className="text-xs text-slate-600">Frequency: Oscillations per second</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">T = {formatNumber(period)} s</div>
                <div className="text-xs text-slate-600">Period: Time for one complete oscillation</div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Derived Quantities</h4>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">v = fλ = {formatNumber(waveSpeed)} px/s</div>
                <div className="text-xs text-slate-600">Wave speed: How fast the wave pattern moves</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">ω = 2πf = {formatNumber(angularFreq)} rad/s</div>
                <div className="text-xs text-slate-600">Angular frequency</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono text-sm mb-1">k = 2π/λ = {formatNumber(waveNumber)} rad/px</div>
                <div className="text-xs text-slate-600">Wave number: Spatial frequency</div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Key Relationships</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono mb-1">v = fλ</div>
                <div className="text-xs text-slate-600">Wave speed relation</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono mb-1">T = 1/f</div>
                <div className="text-xs text-slate-600">Period-frequency relation</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono mb-1">k = 2π/λ = ω/v</div>
                <div className="text-xs text-slate-600">Wave number relations</div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Physical Meaning</h4>
            <p className="text-sm leading-relaxed">
              This simulation shows a transverse wave traveling along a string. The wave propagates
              to the right while individual points on the string oscillate vertically. The phase
              velocity depends on the string's tension and linear mass density in real systems.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default function WaveStringSim() {
  const [amplitude, setAmplitude] = useState(60);
  const [wavelength, setWavelength] = useState(200);
  const [frequency, setFrequency] = useState(1.5);
  const [isRunning, setIsRunning] = useState(false);
  const [showPhysics, setShowPhysics] = useState(false);

  const [time, setTime] = useState(0);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  const svgWidth = 900;
  const svgHeight = 450;
  const baseline = svgHeight / 2;
  const marginLeft = 60;
  const marginBottom = 40;

  const generatePath = (t) => {
    const k = (2 * Math.PI) / wavelength;
    const omega = 2 * Math.PI * frequency;
    const A = amplitude;

    let path = `M ${marginLeft} ${baseline}`;
    const step = 1;
    for (let x = marginLeft; x <= svgWidth - 20; x += step) {
      const y = baseline - A * Math.sin(k * (x - marginLeft) - omega * t);
      path += ` L ${x} ${y}`;
    }
    return path;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Wave on a String</h1>
            <p className="text-slate-400">Interactive physics simulation</p>
          </div>
          <button
            onClick={() => setShowPhysics(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg font-semibold"
          >
          Physics Background
          </button>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          <div className="relative mb-8">
            <svg
              width={svgWidth}
              height={svgHeight}
              className="bg-slate-950 rounded-lg w-full border border-slate-700"
              style={{ maxWidth: "100%" }}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="stringGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#d1d5db", stopOpacity: 0.6 }} />
                  <stop offset="50%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#d1d5db", stopOpacity: 0.6 }} />
                </linearGradient>
              </defs>

              <line
                x1={marginLeft}
                y1={baseline}
                x2={svgWidth - 20}
                y2={baseline}
                stroke="#334155"
                strokeWidth="1"
                strokeDasharray="10 5"
                opacity="0.3"
              />

              {/* X-axis */}
              <line
                x1={marginLeft}
                y1={baseline}
                x2={svgWidth - 20}
                y2={baseline}
                stroke="#64748b"
                strokeWidth="2"
              />
              <polygon
                points={`${svgWidth - 20},${baseline} ${svgWidth - 30},${baseline - 5} ${svgWidth - 30},${baseline + 5}`}
                fill="#64748b"
              />
              <text
                x={svgWidth - 10}
                y={baseline + 5}
                fill="#94a3b8"
                fontSize="14"
                fontWeight="bold"
              >
                x
              </text>

              {/* Y-axis */}
              <line
                x1={marginLeft}
                y1={20}
                x2={marginLeft}
                y2={svgHeight - marginBottom}
                stroke="#64748b"
                strokeWidth="2"
              />
              <polygon
                points={`${marginLeft},20 ${marginLeft - 5},30 ${marginLeft + 5},30`}
                fill="#64748b"
              />
              <text
                x={marginLeft - 5}
                y={15}
                fill="#94a3b8"
                fontSize="14"
                fontWeight="bold"
              >
                y
              </text>

              {/* Tick marks on Y-axis */}
              <line x1={marginLeft - 5} y1={baseline - 50} x2={marginLeft + 5} y2={baseline - 50} stroke="#64748b" strokeWidth="1" />
              <line x1={marginLeft - 5} y1={baseline - 100} x2={marginLeft + 5} y2={baseline - 100} stroke="#64748b" strokeWidth="1" />
              <line x1={marginLeft - 5} y1={baseline + 50} x2={marginLeft + 5} y2={baseline + 50} stroke="#64748b" strokeWidth="1" />
              <line x1={marginLeft - 5} y1={baseline + 100} x2={marginLeft + 5} y2={baseline + 100} stroke="#64748b" strokeWidth="1" />

              <path
                d={generatePath(time)}
                stroke="url(#stringGradient)"
                strokeWidth="5"
                fill="none"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Control
              label="Amplitude"
              value={amplitude}
              unit="px"
              min={10}
              max={180}
              step={5}
              onChange={setAmplitude}
              disabled={isRunning}
            />
            <Control
              label="Wavelength"
              value={wavelength}
              unit="px"
              min={40}
              max={500}
              step={10}
              onChange={setWavelength}
              disabled={isRunning}
            />
            <Control
              label="Frequency"
              value={frequency}
              unit="Hz"
              min={0.1}
              max={8}
              step={0.1}
              onChange={setFrequency}
              disabled={isRunning}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={start}
              disabled={isRunning}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-semibold transition-colors shadow-lg text-lg"
            >
              Start
            </button>
            <button
              onClick={pause}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors text-lg"
            >
              Pause
            </button>
            <button
              onClick={reset}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors text-lg"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <PhysicsSidebar
        isOpen={showPhysics}
        onClose={() => setShowPhysics(false)}
        frequency={frequency}
        wavelength={wavelength}
        amplitude={amplitude}
      />
    </div>
  );
}