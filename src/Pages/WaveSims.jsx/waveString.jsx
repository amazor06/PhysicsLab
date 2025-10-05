// waveString.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "../../components/ui.jsx";

const formatNumber = (v, d = 2) =>
  Number.isFinite(v) ? Number(v).toFixed(d) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-xs md:text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value)} {unit}
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
  </div>
);

export default function WaveString() {
  const [mode, setMode] = useState("Traveling"); // or "Standing"
  const [amplitude, setAmplitude] = useState(60);
  const [wavelength, setWavelength] = useState(200);
  const [frequency, setFrequency] = useState(1.5);
  const [isRunning, setIsRunning] = useState(false);

  const [time, setTime] = useState(0);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const WIDTH = 640;
  const HEIGHT = 400;
  const BASELINE = HEIGHT / 2;
  const LEFT_MARGIN = 50;
  const RIGHT_MARGIN = 20;

  // Derived parameters
  const { k, omega, period, speed } = useMemo(() => {
    const k = (2 * Math.PI) / wavelength;
    const omega = 2 * Math.PI * frequency;
    const period = 1 / frequency;
    const speed = frequency * wavelength;
    return { k, omega, period, speed };
  }, [wavelength, frequency]);

  const start = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  // Time loop
  useEffect(() => {
    if (!isRunning) return;
    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      setTime((t) => t + dt);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning]);

  // Draw wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    canvas.style.width = `${WIDTH}px`;
    canvas.style.height = `${HEIGHT}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // background
    ctx.fillStyle = "rgba(2,6,23,0.6)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "rgba(51,65,85,0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0.5, 0.5, WIDTH - 1, HEIGHT - 1);

    // baseline
    ctx.beginPath();
    ctx.moveTo(LEFT_MARGIN, BASELINE);
    ctx.lineTo(WIDTH - RIGHT_MARGIN, BASELINE);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // wave
    const A = mode === "Standing" ? Math.min(amplitude, 45) : amplitude;
    const step = 1;
    ctx.beginPath();
    const grad = ctx.createLinearGradient(0, 0, WIDTH, 0);
    grad.addColorStop(0, "#60a5fa");
    grad.addColorStop(1, "#a855f7");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.shadowColor = "rgba(99,102,241,0.35)";
    ctx.shadowBlur = 8;
    ctx.moveTo(LEFT_MARGIN, BASELINE);
    for (let x = LEFT_MARGIN; x <= WIDTH - RIGHT_MARGIN; x += step) {
      let y;
      if (mode === "Traveling") {
        y = BASELINE - A * Math.sin(k * (x - LEFT_MARGIN) - omega * time);
      } else {
        y = BASELINE - 2 * A * Math.cos(k * (x - LEFT_MARGIN)) * Math.sin(omega * time);
      }
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [time, amplitude, wavelength, frequency, mode]);

  return (
    <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Wave on a String</h2>
            <p className="text-slate-400 text-sm">
              Visualize traveling and standing waves with adjustable parameters.
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-wide text-xs">
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <motion.div
            className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="w-full h-auto rounded-lg" />
          </motion.div>

          {/* Controls */}
          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Mode Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Mode</span>
              <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                {["Traveling", "Standing"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    disabled={isRunning}
                    className={`px-3 py-1 text-xs font-semibold transition-all ${
                      mode === m ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    } ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Control
                label="Amplitude"
                value={amplitude}
                unit="px"
                min={5}
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
              <div className="hidden md:block" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button onClick={start} disabled={isRunning} className="col-span-2">
                Start
              </Button>
              <Button variant="outline" onClick={reset}>
                Reset
              </Button>
              <Button onClick={pause} className="col-span-3">
                Pause
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats identical to others */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(amplitude, 0)} px</div>
            <div className="text-xs text-slate-400">Amplitude</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(wavelength, 0)} px</div>
            <div className="text-xs text-slate-400">Wavelength</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(frequency, 2)} Hz</div>
            <div className="text-xs text-slate-400">Frequency</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(speed, 0)} px/s</div>
            <div className="text-xs text-slate-400">Wave Speed (fλ)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(k, 3)}</div>
            <div className="text-xs text-slate-400">Wave Number (2π/λ)</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
