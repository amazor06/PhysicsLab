// GasLawSim.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Thermometer, Maximize2, Atom, Info, BookOpen, X } from "lucide-react";

/* ---------- UI Primitives (match Pendulum style) ---------- */
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    default: "bg-purple-600 hover:bg-purple-700 text-white",
    outline: "border border-slate-600 hover:bg-slate-800 text-white",
    ghost: "hover:bg-slate-800 text-white",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
    {children}
  </span>
);

const formatNumber = (v, d = 2) => (Number.isFinite(v) ? Number(v).toFixed(d) : "0.00");

/* ---------- Controls (purple accent) ---------- */
const Control = ({ label, value, unit, min, max, step, onChange, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span>{label}</span>
      </div>
      <span className="font-mono font-semibold text-white">
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
      className="w-full accent-purple-500"
    />
    <div className="flex items-center justify-between text-xs text-slate-500">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

/* ---------- Particle (unchanged physics; purple visual) ---------- */
class Particle {
  constructor(x, y, vx, vy, temp) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 3;
    this.updateSpeed(temp);
  }
  updateSpeed(temp) {
    const factor = Math.sqrt(temp / 300);
    const speed = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    if (speed > 0) {
      const newSpeed = factor * 3;
      this.vx = (this.vx / speed) * newSpeed;
      this.vy = (this.vy / speed) * newSpeed;
    }
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
    gradient.addColorStop(0, "rgba(180,100,255,0.9)");
    gradient.addColorStop(1, "rgba(120,60,220,0)");
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  checkCollision(o) {
    const dx = o.x - this.x;
    const dy = o.y - this.y;
    const dist = Math.hypot(dx, dy);
    return dist < this.radius + o.radius;
  }
  resolveCollision(o) {
    const dx = o.x - this.x;
    const dy = o.y - this.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;
    const nx = dx / dist;
    const ny = dy / dist;
    const dvx = o.vx - this.vx;
    const dvy = o.vy - this.vy;
    const vn = dvx * nx + dvy * ny;
    if (vn > 0) return;
    const impulse = vn;
    this.vx += impulse * nx;
    this.vy += impulse * ny;
    o.vx -= impulse * nx;
    o.vy -= impulse * ny;
  }
}

/* ---------- Concise Learn Physics Sidebar (purple theme) ---------- */
const LearnPhysicsSidebar = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full md:w-[520px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900 pb-4 z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Learn Physics</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 text-slate-300">
              {/* Ideal Gas Law */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Ideal Gas Law
                </h3>
                <p className="leading-relaxed mb-3">
                  The macroscopic relationship for many gases is <span className="font-semibold text-purple-300">PV = nRT</span>, where:
                  <span className="block mt-2 text-slate-400 text-sm">
                    P = pressure (atm), V = volume (L), n = moles, R ≈ 0.0821 L·atm·K⁻¹·mol⁻¹, T = temperature (K).
                  </span>
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-sm">
                  At constant n: ↑T → ↑P (if V fixed), or ↑T → ↑V (if P fixed). Decreasing V at fixed T increases P.
                </div>
              </section>

              {/* Kinetic Molecular Theory */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Molecular Motion & Temperature
                </h3>
                <p className="leading-relaxed">
                  Temperature is proportional to the average kinetic energy of molecules. In this sim, particle speed scales with √T.
                  More speed → more frequent, harder wall collisions → higher pressure.
                </p>
              </section>

              {/* P–V Relationship */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Pressure–Volume Relationship
                </h3>
                <p className="leading-relaxed">
                  At fixed T and n, decreasing V raises P (Boyle’s law). In the sim, shrinking the glowing box increases collision rate.
                </p>
              </section>

              {/* Real-World Notes */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Real-World Notes
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Real gases deviate from ideal behavior at high pressure and low temperature.</li>
                  <li>Moles control particle count; more particles → higher P at fixed V, T.</li>
                  <li>In sealed containers, heating raises pressure; venting keeps pressure low but volume/amount change.</li>
                </ul>
              </section>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ---------- Main Component (animation kept; layout upgraded) ---------- */
export default function GasLawSim() {
  // Animation state
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(Date.now());

  // Controls
  const [temperature, setTemperature] = useState(300); // K
  const [volume, setVolume] = useState(10); // L
  const [moles, setMoles] = useState(1); // mol
  const [showEducational, setShowEducational] = useState(false);

  // Canvas size
  const WIDTH = 800;
  const HEIGHT = 500;

  // Gas constant
  const R = 0.0821;
  const pressure = (moles * R * temperature) / volume;

  // Container dims from volume (same mapping you had)
  const containerWidth = Math.min(700, 200 + volume * 25);
  const containerHeight = Math.min(400, 150 + volume * 15);
  const containerX = (WIDTH - containerWidth) / 2;
  const containerY = (HEIGHT - containerHeight) / 2;

  // Particle count (scaled by moles)
  const targetCount = Math.round(moles * 50);

  /* Initialize / update particles based on parameters (unchanged logic) */
  useEffect(() => {
    const ps = particlesRef.current;
    const current = ps.length;

    if (current < targetCount) {
      for (let i = current; i < targetCount; i++) {
        const x = containerX + Math.random() * containerWidth;
        const y = containerY + Math.random() * containerHeight;
        const a = Math.random() * Math.PI * 2;
        const s = Math.sqrt(temperature / 300) * 3;
        ps.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, temperature));
      }
    } else if (current > targetCount) {
      ps.splice(targetCount);
    }

    ps.forEach((p) => p.updateSpeed(temperature));

    // Keep inside bounds on resize (no “invisible walls” effect)
    ps.forEach((p) => {
      p.x = Math.max(containerX + p.radius, Math.min(containerX + containerWidth - p.radius, p.x));
      p.y = Math.max(containerY + p.radius, Math.min(containerY + containerHeight - p.radius, p.y));
    });
  }, [moles, temperature, volume, targetCount, containerX, containerY, containerWidth, containerHeight]);

  /* Animation loop (space background + glowing container; unchanged physics) */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.02) * 60; // fixed-ish timestep
      lastTimeRef.current = now;

      // Space gradient background
      const grad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 0, WIDTH / 2, HEIGHT / 2, WIDTH);
      grad.addColorStop(0, "#0b1220");
      grad.addColorStop(0.5, "#0a0f1a");
      grad.addColorStop(1, "#05080f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Star field (light twinkle)
      for (let i = 0; i < 80; i++) {
        const x = (i * 97) % WIDTH;
        const y = (i * 151) % HEIGHT;
        const alpha = 0.15 + (Math.sin(i + now * 0.001) + 1) / 4;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Glowing container
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = "rgba(180,100,255,0.5)";
      ctx.strokeStyle = "rgba(180,100,255,0.85)";
      ctx.lineWidth = 3;
      ctx.strokeRect(containerX, containerY, containerWidth, containerHeight);
      ctx.restore();
      ctx.fillStyle = "rgba(180,100,255,0.05)";
      ctx.fillRect(containerX, containerY, containerWidth, containerHeight);

      // Particle physics
      const ps = particlesRef.current;
      ps.forEach((p) => {
        p.update(dt);
        const xMin = containerX + p.radius;
        const xMax = containerX + containerWidth - p.radius;
        const yMin = containerY + p.radius;
        const yMax = containerY + containerHeight - p.radius;

        if (p.x < xMin) { p.vx *= -1; p.x = xMin; }
        else if (p.x > xMax) { p.vx *= -1; p.x = xMax; }
        if (p.y < yMin) { p.vy *= -1; p.y = yMin; }
        else if (p.y > yMax) { p.vy *= -1; p.y = yMax; }
      });

      // Optional pairwise collisions (kept—fast enough for ~100)
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          if (ps[i].checkCollision(ps[j])) ps[i].resolveCollision(ps[j]);
        }
      }

      // Draw particles
      ps.forEach((p) => p.draw(ctx));

      // Equation label
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.strokeStyle = "rgba(139,92,246,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(WIDTH / 2 - 100, HEIGHT - 50, 200, 40, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#c4b5fd";
      ctx.font = "bold 18px Inter, serif";
      ctx.textAlign = "center";
      ctx.fillText("PV = nRT", WIDTH / 2, HEIGHT - 23);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [temperature, volume, moles, containerX, containerY, containerWidth, containerHeight]);

  /* ---------- Layout (Pendulum-style) ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-purple-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Ideal Gas Law Simulator</h2>
              <p className="text-slate-400 text-sm mt-1">
                Visualize molecular motion in a glowing space environment as you change parameters.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="uppercase tracking-wide text-xs border-purple-500/30 text-purple-400">
                Live
              </Badge>
              <Button variant="outline" onClick={() => setShowEducational(true)} className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learn Physics
              </Button>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas */}
            <motion.div
              className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-xl border border-slate-700/50 bg-black overflow-hidden">
                <canvas ref={canvasRef} width={800} height={500} className="w-full h-auto" />
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-purple-500 rounded" />
                Parameters
              </h3>

              <Control
                label="Temperature"
                value={temperature}
                unit="K"
                min={100}
                max={600}
                step={10}
                onChange={setTemperature}
                icon={Thermometer}
              />
              <Control
                label="Volume"
                value={volume}
                unit="L"
                min={2}
                max={20}
                step={0.5}
                onChange={setVolume}
                icon={Maximize2}
              />
              <Control
                label="Moles"
                value={moles}
                unit="mol"
                min={0.5}
                max={5}
                step={0.1}
                onChange={setMoles}
                icon={Atom}
              />

              <div className="pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Calculated Pressure:</div>
                <div className="text-3xl font-bold text-purple-400">
                  {formatNumber(pressure, 2)}
                  <span className="text-lg text-slate-500 ml-1">atm</span>
                </div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-lg text-xs text-slate-400">
                💡 <strong>Tip:</strong> Increase temperature to speed particles up. Decrease volume to increase wall collisions.
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
            <Stat label="Pressure (P)" value={formatNumber(pressure, 2)} unit="atm" color="text-purple-400" />
            <Stat label="Volume (V)" value={formatNumber(volume, 1)} unit="L" color="text-blue-400" />
            <Stat label="Moles (n)" value={formatNumber(moles, 1)} unit="mol" color="text-pink-400" />
            <Stat label="Temperature (T)" value={formatNumber(temperature, 0)} unit="K" color="text-amber-400" />
            <Stat label="Particles" value={`${targetCount}`} unit="count" color="text-emerald-400" />
          </div>
        </div>
      </Card>

      {/* Learn Physics Sidebar */}
      <LearnPhysicsSidebar isOpen={showEducational} onClose={() => setShowEducational(false)} />
    </div>
  );
}

/* ---------- Small stat card ---------- */
function Stat({ label, value, unit, color }) {
  return (
    <div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{unit}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}
