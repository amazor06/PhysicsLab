// ReflectionRefractionSim.jsx
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
      className="w-full accent-indigo-500"
      disabled={disabled}
    />
  </div>
);

export default function ReflectionRefractionSim() {
  const [angleIncidence, setAngleIncidence] = useState(30);
  const [n1, setN1] = useState(1.0);
  const [n2, setN2] = useState(1.5);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef(null);
  const canvasRef = useRef(null);

  const WIDTH = 640;
  const HEIGHT = 400;
  const CENTER_X = WIDTH / 2;
  const INTERFACE_Y = HEIGHT / 2;

  // Derived angle of refraction (Snell's Law)
  const angleRefraction = useMemo(() => {
    const rad1 = (angleIncidence * Math.PI) / 180;
    const sin2 = (n1 / n2) * Math.sin(rad1);
    if (Math.abs(sin2) > 1) return null; // total internal reflection
    return (Math.asin(sin2) * 180) / Math.PI;
  }, [angleIncidence, n1, n2]);

  const start = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(true);
  };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setAngleIncidence(30);
    setN1(1.0);
    setN2(1.5);
    setTime(0);
  };

  // Simple animation loop
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

  // Draw the optics visualization
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

    // Background
    ctx.fillStyle = "rgba(15, 15, 35, 1)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Interface
    ctx.fillStyle = "rgba(79,70,229,0.3)";
    ctx.fillRect(0, INTERFACE_Y, WIDTH, HEIGHT / 2);
    ctx.strokeStyle = "rgba(147,197,253,0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, INTERFACE_Y);
    ctx.lineTo(WIDTH, INTERFACE_Y);
    ctx.stroke();

    // Incident ray
    const rayLength = 180;
    const incidentAngleRad = (angleIncidence * Math.PI) / 180;
    const x1 = CENTER_X - rayLength * Math.sin(incidentAngleRad);
    const y1 = INTERFACE_Y - rayLength * Math.cos(incidentAngleRad);

    ctx.strokeStyle = "#60a5fa";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(CENTER_X, INTERFACE_Y);
    ctx.stroke();

    // Normal line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(CENTER_X, 20);
    ctx.lineTo(CENTER_X, HEIGHT - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Reflected ray
    const reflectAngle = incidentAngleRad;
    const x2 = CENTER_X + rayLength * Math.sin(reflectAngle);
    const y2 = INTERFACE_Y - rayLength * Math.cos(reflectAngle);
    ctx.strokeStyle = "#f472b6";
    ctx.beginPath();
    ctx.moveTo(CENTER_X, INTERFACE_Y);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Refracted ray (if exists)
    if (angleRefraction !== null) {
      const refractedRad = (angleRefraction * Math.PI) / 180;
      const x3 = CENTER_X + rayLength * Math.sin(refractedRad);
      const y3 = INTERFACE_Y + rayLength * Math.cos(refractedRad);
      ctx.strokeStyle = "#34d399";
      ctx.beginPath();
      ctx.moveTo(CENTER_X, INTERFACE_Y);
      ctx.lineTo(x3, y3);
      ctx.stroke();
    } else {
      // Total internal reflection indicator
      ctx.fillStyle = "#f87171";
      ctx.font = "14px Inter";
      ctx.fillText("Total Internal Reflection", CENTER_X - 100, INTERFACE_Y + 30);
    }

    // Labels
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "13px Inter";
    ctx.fillText(`θ₁ = ${formatNumber(angleIncidence, 1)}°`, x1 - 60, y1);
    if (angleRefraction !== null)
      ctx.fillText(`θ₂ = ${formatNumber(angleRefraction, 1)}°`, CENTER_X + 70, INTERFACE_Y + 40);
  }, [angleIncidence, n1, n2, angleRefraction, time]);

  return (
    <Card className="bg-slate-900/80 border border-indigo-500/20 shadow-xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Reflection & Refraction
            </h2>
            <p className="text-slate-400 text-sm">
              Visualize how light behaves at a boundary using Snell’s Law.
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
              label="Angle of Incidence"
              value={angleIncidence}
              unit="°"
              min={0}
              max={80}
              step={1}
              onChange={setAngleIncidence}
              disabled={isRunning}
            />
            <Control
              label="Refractive Index (n₁)"
              value={n1}
              unit=""
              min={1.0}
              max={2.0}
              step={0.05}
              onChange={setN1}
              disabled={isRunning}
            />
            <Control
              label="Refractive Index (n₂)"
              value={n2}
              unit=""
              min={1.0}
              max={2.5}
              step={0.05}
              onChange={setN2}
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
              {formatNumber(angleIncidence, 1)}°
            </div>
            <div className="text-xs text-slate-400">Incident Angle (θ₁)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">
              {angleRefraction === null ? "—" : `${formatNumber(angleRefraction, 1)}°`}
            </div>
            <div className="text-xs text-slate-400">Refracted Angle (θ₂)</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(n1, 2)}</div>
            <div className="text-xs text-slate-400">Refractive Index n₁</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(n2, 2)}</div>
            <div className="text-xs text-slate-400">Refractive Index n₂</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
