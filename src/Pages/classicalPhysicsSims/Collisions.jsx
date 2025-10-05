// Collisions.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, Button, Badge } from "../../components/ui.jsx";

const formatNumber = (v, d = 2) =>
  Number.isFinite(v) ? Number(v).toFixed(d) : "0.00";

const MAX_ARROW_PX = 100;
const PIXELS_TO_SPEED = 0.08;

const BOX_W = 640;
const BOX_H = 400;
const TRACK_Y = BOX_H / 2;

const Control = ({ label, value, unit, min, max, step, onChange, disabled }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
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

export default function Collisions() {
  const [mode, setMode] = useState("2D");
  const [isRunning, setIsRunning] = useState(false);
  const [collisions, setCollisions] = useState(0);

  const [ball1, setBall1] = useState({
    x: 150,
    y: TRACK_Y,
    vx: 3,
    vy: 2,
    mass: 2,
    radius: 22,
  });

  const [ball2, setBall2] = useState({
    x: 480,
    y: TRACK_Y + 20,
    vx: -2,
    vy: -1,
    mass: 3,
    radius: 26,
  });

  const [initial, setInitial] = useState({
    ball1: { mass: 2, vx: 3, vy: 2 },
    ball2: { mass: 3, vx: -2, vy: -1 },
  });

  const svgRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(Date.now());
  const lastCollisionRef = useRef(0);
  const [dragging, setDragging] = useState(null);

  const reset = useCallback(() => {
    setBall1({
      x: 150,
      y: mode === "1D" ? TRACK_Y : 200,
      vx: initial.ball1.vx,
      vy: mode === "1D" ? 0 : initial.ball1.vy,
      mass: initial.ball1.mass,
      radius: 14 + initial.ball1.mass * 5,
    });
    setBall2({
      x: 500,
      y: mode === "1D" ? TRACK_Y : 240,
      vx: initial.ball2.vx,
      vy: mode === "1D" ? 0 : initial.ball2.vy,
      mass: initial.ball2.mass,
      radius: 14 + initial.ball2.mass * 5,
    });
    setIsRunning(false);
    setCollisions(0);
  }, [initial, mode]);

  useEffect(() => {
    reset();
  }, [mode, reset]);

  const toggle = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(!isRunning);
  };

  const updateInitial = (idx, key, value) => {
    setInitial((prev) => ({
      ...prev,
      [`ball${idx}`]: { ...prev[`ball${idx}`], [key]: value },
    }));
    if (idx === 1) {
      setBall1((b) => ({
        ...b,
        [key]: value,
        radius: key === "mass" ? 14 + value * 5 : b.radius,
      }));
    } else {
      setBall2((b) => ({
        ...b,
        [key]: value,
        radius: key === "mass" ? 14 + value * 5 : b.radius,
      }));
    }
  };

  const checkCollision = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.hypot(dx, dy) <= a.radius + b.radius;
  };

  const resolveCollision = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.hypot(dx, dy) || 1e-6;
    const nx = dx / dist;
    const ny = dy / dist;
    const dvx = b.vx - a.vx;
    const dvy = b.vy - a.vy;
    const relVel = dvx * nx + dvy * ny;
    if (relVel > 0) return { a, b };
    const impulse = (2 * relVel) / (a.mass + b.mass);
    const avx = a.vx + impulse * b.mass * nx;
    const avy = a.vy + impulse * b.mass * ny;
    const bvx = b.vx - impulse * a.mass * nx;
    const bvy = b.vy - impulse * a.mass * ny;
    return { a: { ...a, vx: avx, vy: avy }, b: { ...b, vx: bvx, vy: bvy } };
  };

  useEffect(() => {
    if (!isRunning) return;

    const loop = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const step = (b) => {
        let { x, y, vx, vy, radius } = b;
        x += vx * dt * 60;
        if (mode === "2D") y += vy * dt * 60;
        if (x - radius < 0 || x + radius > BOX_W) vx = -vx;
        if (mode === "2D" && (y - radius < 0 || y + radius > BOX_H)) vy = -vy;
        if (mode === "1D") y = TRACK_Y;
        return { ...b, x, y, vx, vy };
      };

      let nb1 = step(ball1);
      let nb2 = step(ball2);

      const canCollide = now - lastCollisionRef.current > 100;
      if (canCollide && checkCollision(nb1, nb2)) {
        const res = resolveCollision(nb1, nb2);
        nb1 = res.a;
        nb2 = res.b;
        lastCollisionRef.current = now;
        setCollisions((c) => c + 1);
      }

      setBall1(nb1);
      setBall2(nb2);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isRunning, mode, ball1, ball2]);

  const arrowFor = useCallback((b) => {
    const mag = Math.hypot(b.vx, b.vy);
    const cap = Math.min(MAX_ARROW_PX, mag / PIXELS_TO_SPEED);
    const scale = mag ? cap / mag : 0;
    const ax = b.x + b.vx * scale;
    const ay = b.y + (-b.vy) * scale;
    return { ax, ay };
  }, []);

  const getSvgPoint = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    const inv = ctm.inverse();
    const loc = pt.matrixTransform(inv);
    return { x: loc.x, y: loc.y };
  };

  const onArrowDown = (which) => (e) => {
    e.preventDefault();
    const wasRunning = isRunning;
    if (wasRunning) setIsRunning(false);
    setDragging({ which, wasRunning });
  };

  const onSvgMove = (e) => {
    if (!dragging) return;
    const p = getSvgPoint(e);
    const setFn = dragging.which === 1 ? setBall1 : setBall2;
    setFn((prev) => {
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const len = Math.hypot(dx, dy) || 1e-6;
      const cap = Math.min(MAX_ARROW_PX, len);
      const scale = cap / len;
      const vx = dx * scale * PIXELS_TO_SPEED;
      const vy = mode === "1D" ? 0 : (-dy * scale) * PIXELS_TO_SPEED;
      return { ...prev, vx, vy };
    });
  };

  const onSvgUp = () => {
    if (!dragging) return;
    if (dragging.wasRunning) setIsRunning(true);
    setDragging(null);
  };

  const arrow1 = arrowFor(ball1);
  const arrow2 = arrowFor(ball2);

  const ke1 = 0.5 * ball1.mass * (ball1.vx ** 2 + ball1.vy ** 2);
  const ke2 = 0.5 * ball2.mass * (ball2.vx ** 2 + ball2.vy ** 2);
  const totalKE = ke1 + ke2;

  return (
    <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Collision Studio</h2>
            <p className="text-slate-400 text-sm">
              Visualize 1D and 2D elastic collisions with draggable velocity vectors.
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-wide text-xs">
            {isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Simulation */}
          <motion.div
            className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg
              ref={svgRef}
              width={BOX_W}
              height={BOX_H}
              viewBox={`0 0 ${BOX_W} ${BOX_H}`}
              className="w-full h-auto"
              onPointerMove={onSvgMove}
              onPointerUp={onSvgUp}
              onPointerLeave={onSvgUp}
            >
              <defs>
                <linearGradient id="b1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
                <linearGradient id="b2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
                </marker>
                <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#a855f7" />
                </marker>
              </defs>

              {/* Track line for 1D */}
              {mode === "1D" && (
                <line
                  x1={20}
                  y1={TRACK_Y}
                  x2={BOX_W - 20}
                  y2={TRACK_Y}
                  stroke="#64748b"
                  strokeDasharray="6,6"
                  strokeWidth="2"
                />
              )}

              {/* Arrows only visible when not running */}
              {!isRunning && (
<>
  <line
    x1={ball1.x}
    y1={ball1.y}
    x2={arrow1.ax}
    y2={arrow1.ay}
    stroke="#60a5fa"
    strokeWidth="3"
    markerEnd="url(#arrowBlue)"
  />
  <line
    x1={ball2.x}
    y1={ball2.y}
    x2={arrow2.ax}
    y2={arrow2.ay}
    stroke="#a855f7"
    strokeWidth="3"
    markerEnd="url(#arrowPurple)"
  />

  {/* Transparent grab zone just over arrowheads */}
  <circle
    cx={arrow1.ax}
    cy={arrow1.ay}
    r="10"
    fill="transparent"
    onPointerDown={onArrowDown(1)}
    style={{ cursor: "grab" }}
  />
  <circle
    cx={arrow2.ax}
    cy={arrow2.ay}
    r="10"
    fill="transparent"
    onPointerDown={onArrowDown(2)}
    style={{ cursor: "grab" }}
  />
</>

              )}

              {/* Balls */}
              <circle cx={ball1.x} cy={ball1.y} r={ball1.radius} fill="url(#b1)" stroke="#60a5fa" strokeWidth="3" />
              <circle cx={ball2.x} cy={ball2.y} r={ball2.radius} fill="url(#b2)" stroke="#a855f7" strokeWidth="3" />

              <text x={ball1.x} y={ball1.y + 5} textAnchor="middle" fill="white" fontSize="12">
                {formatNumber(ball1.mass, 1)}
              </text>
              <text x={ball2.x} y={ball2.y + 5} textAnchor="middle" fill="white" fontSize="12">
                {formatNumber(ball2.mass, 1)}
              </text>
            </svg>
          </motion.div>

          {/* Controls (cleaner layout) */}
          <motion.div
            className="flex flex-col gap-4 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Mode Selector */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-300">Mode</span>
              <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                {["1D", "2D"].map((m) => (
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

            {/* Parameter rows: two columns */}
            <div className="grid grid-cols-2 gap-5">
              {/* Ball 1 */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-blue-400">Object 1</div>
                <Control
                  label="Mass"
                  value={initial.ball1.mass}
                  unit="kg"
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={(v) => updateInitial(1, "mass", v)}
                  disabled={isRunning}
                />
                <Control
                  label="Vx"
                  value={initial.ball1.vx}
                  unit="m/s"
                  min={-10}
                  max={10}
                  step={0.5}
                  onChange={(v) => updateInitial(1, "vx", v)}
                  disabled={isRunning}
                />
                {mode === "2D" && (
                  <Control
                    label="Vy"
                    value={initial.ball1.vy}
                    unit="m/s"
                    min={-10}
                    max={10}
                    step={0.5}
                    onChange={(v) => updateInitial(1, "vy", v)}
                    disabled={isRunning}
                  />
                )}
              </div>

              {/* Ball 2 */}
              <div className="flex flex-col gap-3">
                <div className="text-sm font-semibold text-purple-400">Object 2</div>
                <Control
                  label="Mass"
                  value={initial.ball2.mass}
                  unit="kg"
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={(v) => updateInitial(2, "mass", v)}
                  disabled={isRunning}
                />
                <Control
                  label="Vx"
                  value={initial.ball2.vx}
                  unit="m/s"
                  min={-10}
                  max={10}
                  step={0.5}
                  onChange={(v) => updateInitial(2, "vx", v)}
                  disabled={isRunning}
                />
                {mode === "2D" && (
                  <Control
                    label="Vy"
                    value={initial.ball2.vy}
                    unit="m/s"
                    min={-10}
                    max={10}
                    step={0.5}
                    onChange={(v) => updateInitial(2, "vy", v)}
                    disabled={isRunning}
                  />
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Button onClick={toggle} className="w-full">
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button variant="outline" onClick={reset} className="w-full">
                Reset
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(totalKE, 1)}J</div>
            <div className="text-xs text-slate-400">Total Energy</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(ke1, 1)}J</div>
            <div className="text-xs text-slate-400">Object 1 KE</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{formatNumber(ke2, 1)}J</div>
            <div className="text-xs text-slate-400">Object 2 KE</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">{collisions}</div>
            <div className="text-xs text-slate-400">Collisions</div>
          </div>
        </div>
      </div>
    </Card>
  );
}