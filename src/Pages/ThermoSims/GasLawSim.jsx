// GasLawSim.jsx
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
      className="w-full accent-amber-500"
      disabled={disabled}
    />
  </div>
);

export default function GasLawSim() {
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(10); // L
  const [moles, setMoles] = useState(1); // mol
  const [isRunning, setIsRunning] = useState(false);

  const [time, setTime] = useState(0);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const WIDTH = 640;
  const HEIGHT = 400;
  const BASELINE = HEIGHT - 40;

  const R = 0.0821; // gas constant (L·atm·K⁻¹·mol⁻¹)
  const pressure = useMemo(
    () => (moles * R * temperature) / volume,
    [temperature, volume, moles]
  );

  const start = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setTemperature(300);
    setVolume(10);
    setMoles(1);
    setTime(0);
  };

  // simple time loop (for small animation effects)
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

  // Draw piston visualization
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

    ctx.fillStyle = "rgba(15, 15, 15, 0.8)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Chamber outline
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(WIDTH / 3, 60, WIDTH / 3, BASELINE - 60);

    // Piston position (inversely proportional to pressure)
    const pistonY = BASELINE - Math.min(pressure * 10, BASELINE - 100);

    // Piston rectangle
    ctx.fillStyle = "rgba(251,191,36,0.7)";
    ctx.fillRect(WIDTH / 3, pistonY, WIDTH / 3, 10);

    // Gas particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const x =
        WIDTH / 3 + 10 + ((i * 37) % (WIDTH / 3 - 20)) + Math.sin(time + i) * 5;
      const y =
        pistonY + 20 + ((i * 17) % (BASELINE - pistonY - 40)) +
        Math.cos(time + i * 1.7) * 3;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255,215,0,0.8)";
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "14px Inter";
    ctx.fillText(`P = ${formatNumber(pressure, 2)} atm`, 50, 40);
    ctx.fillText(`V = ${formatNumber(volume, 1)} L`, 50, 60);
    ctx.fillText(`T = ${formatNumber(temperature, 0)} K`, 50, 80);
  }, [pressure, volume, temperature, time]);

  return (
    <Card className="bg-slate-900/80 border border-amber-500/20 shadow-xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Ideal Gas Law</h2>
            <p className="text-slate-400 text-sm">
              Visualize how pressure, volume, and temperature are related in a gas.
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
            <canvas
              ref={canvasRef}
              width={WIDTH}
              height={HEIGHT}
              className="w-full h-auto rounded-lg"
            />
          </motion.div>

          {/* Controls */}
          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Control
              label="Temperature"
              value={temperature}
              unit="K"
              min={100}
              max={600}
              step={10}
              onChange={setTemperature}
              disabled={isRunning}
            />
            <Control
              label="Volume"
              value={volume}
              unit="L"
              min={2}
              max={20}
              step={0.5}
              onChange={setVolume}
              disabled={isRunning}
            />
            <Control
              label="Moles"
              value={moles}
              unit="mol"
              min={0.5}
              max={5}
              step={0.1}
              onChange={setMoles}
              disabled={isRunning}
            />

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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(pressure, 2)} atm
            </div>
            <div className="text-xs text-slate-400">Pressure (P)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(volume, 1)} L
            </div>
            <div className="text-xs text-slate-400">Volume (V)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(temperature, 0)} K
            </div>
            <div className="text-xs text-slate-400">Temperature (T)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {formatNumber(moles, 1)} mol
            </div>
            <div className="text-xs text-slate-400">Moles (n)</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
