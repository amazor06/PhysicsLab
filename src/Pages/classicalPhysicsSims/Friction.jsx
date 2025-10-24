import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Play, Pause, RotateCcw } from "lucide-react";

/* ---------- UI Primitives ---------- */
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-slate-600 hover:bg-slate-800 text-white",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    outline: "border-slate-600 text-white",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Control = ({ label, value, unit, min, max, step, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {typeof value === "number" ? value.toFixed(2) : value} {unit}
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
      />
      <span>{max}</span>
    </div>
  </div>
);

const MathText = ({ children }) => <span className="italic font-serif">{children}</span>;

const EducationalSidebar = ({ isOpen, onClose }) => (
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
          className="fixed right-0 top-0 h-full w-full md:w-[560px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6 pb-12">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-900 pb-4 z-10">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Physics of Friction</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 text-slate-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded" />
                  What is Friction?
                </h3>
                <p className="leading-relaxed mb-3">
                  Friction opposes relative motion between surfaces in contact. It acts parallel to the surface and
                  opposite the direction of motion or attempted motion.
                </p>
              </section>

              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Types of Friction
                </h3>

                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">
                      Static Friction (<MathText>f</MathText>ₛ)
                    </h4>
                    <p className="text-sm leading-relaxed mb-2">Prevents motion from starting.</p>
                    <div className="text-lg text-white font-mono">fₛ ≤ μₛ N</div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">
                      Kinetic Friction (<MathText>f</MathText>ₖ)
                    </h4>
                    <p className="text-sm leading-relaxed mb-2">Slows moving objects.</p>
                    <div className="text-lg text-white font-mono">fₖ = μₖ N</div>
                  </div>
                </div>
              </section>

              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded" />
                  Ramp → Flat Setup
                </h3>
                <p className="leading-relaxed mb-4">
                  The object accelerates down a <strong>frictionless ramp</strong>, then enters a
                  <strong> rough flat</strong> and decelerates due to kinetic friction.
                </p>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-400">
                    <strong className="text-blue-400">Ramp (frictionless):</strong>
                    <p className="mt-1">a = g sin(θ)</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-400">
                    <strong className="text-purple-400">Flat (rough):</strong>
                    <p className="mt-1">a = −μₖ g</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* --------------------------- Main Simulation --------------------------- */
export default function FrictionSimulation() {
  const canvasRef = useRef(null);
  const bgCanvasRef = useRef(null); // Static background
  const animationRef = useRef();
  const lastTsRef = useRef();

  const [mass, setMass] = useState(5);
  const [muK, setMuK] = useState(0.30);
  const [angleDeg, setAngleDeg] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [time, setTime] = useState(0);
  const [showEducational, setShowEducational] = useState(false);

  const width = 900;
  const height = 520;

  const pxPerM = 60;
  const g = 9.8;

  const rampTop = { x: 120, y: 180 };
  const rampLenM = 4.0;
  const blockSizePx = 50;

  const derived = useMemo(() => {
    const theta = (angleDeg * Math.PI) / 180;
    const rampDxPx = Math.cos(theta) * rampLenM * pxPerM;
    const rampDyPx = Math.sin(theta) * rampLenM * pxPerM;

    const rampEnd = { x: rampTop.x + rampDxPx, y: rampTop.y + rampDyPx };
    const aRamp = g * Math.sin(theta);
    const tRamp = Math.sqrt((2 * rampLenM) / aRamp);
    const vEnd = aRamp * tRamp;
    const aFlat = -muK * g;
    const tFlat = vEnd / (muK * g);
    const dFlat = (vEnd * vEnd) / (2 * muK * g);
    const total = tRamp + tFlat;

    return {
      theta,
      rampEnd,
      aRamp,
      tRamp,
      vEnd,
      aFlat,
      tFlat,
      dFlat,
      total,
    };
  }, [angleDeg, muK]);

  const getKinematics = useCallback(
  (t) => {
    const earlyBlendStart = derived.tRamp - 0.12; // start blending 0.12s before ramp ends
    const blendTime = 0.25; // total blend duration

    // --- Ramp phase ---
    if (t <= earlyBlendStart) {
      const s = 0.5 * derived.aRamp * t * t;
      const x = rampTop.x + Math.cos(derived.theta) * s * pxPerM;
      const y = rampTop.y + Math.sin(derived.theta) * s * pxPerM;
      const v = derived.aRamp * t;
      const rotationDeg = angleDeg;
      return { x, y, v, onRamp: true, rotationDeg };
    }

    // --- Smooth transition phase ---
    if (t > earlyBlendStart && t < derived.tRamp + blendTime) {
      const rampY = rampTop.y + Math.sin(derived.theta) * 0.5 * derived.aRamp * earlyBlendStart ** 2 * pxPerM;
      const flatY = derived.rampEnd.y - blockSizePx / 4 - 10;
      const alpha = Math.min(1, (t - earlyBlendStart) / blendTime);

      const s = 0.5 * derived.aRamp * t * t;
      const x = rampTop.x + Math.cos(derived.theta) * s * pxPerM;
      const y = rampY + (flatY - rampY) * alpha;
      const v = derived.aRamp * t;
      const rotationDeg = angleDeg * (1 - alpha); // smooth rotation to horizontal

      return { x, y, v, onRamp: true, rotationDeg };
    }

    // --- Flat motion phase ---
    const tf = t - derived.tRamp;
    const v = Math.max(0, derived.vEnd + derived.aFlat * tf);
    const df = derived.vEnd * tf + 0.5 * derived.aFlat * tf * tf;
    const x = derived.rampEnd.x + Math.max(0, df) * pxPerM;
    const y = derived.rampEnd.y - blockSizePx / 4 - 10;
    const rotationDeg = 0;
    return { x, y, v, onRamp: false, rotationDeg };
  },
  [derived, angleDeg]
);


  const [phase, setPhase] = useState("ramp");
  const kState = useMemo(() => {
    if (!hasLaunched) {
      return { x: rampTop.x, y: rampTop.y, v: 0, onRamp: true, rotationDeg: angleDeg };
    }
    const t = Math.min(time, derived.total);
    const k = getKinematics(t);
    const newPhase = t < derived.tRamp ? "ramp" : k.v > 0.01 ? "flat" : "stopped";
    if (newPhase !== phase) setPhase(newPhase);
    return k;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, derived.total, derived.tRamp, getKinematics, hasLaunched, angleDeg]);

  // Draw static background once
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    // Space gradient
    const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
    bg.addColorStop(0, "#0b1220");
    bg.addColorStop(0.5, "#0a0f1a");
    bg.addColorStop(1, "#05080f");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Star field
    const rnd = (n) => Math.random() * n;
    for (let i = 0; i < 120; i++) {
      ctx.beginPath();
      ctx.arc(rnd(width), rnd(height), Math.random() * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.35})`;
      ctx.fill();
    }
  }, []); // Only once

  // Draw ramp and flat (when angle or muK changes)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    // Ramp polygon (cyan glow)
    const rampBottom = { x: derived.rampEnd.x, y: derived.rampEnd.y };
    const rampLeftBase = { x: rampTop.x, y: rampTop.y + 14 };
    const rampRightBase = { x: rampBottom.x, y: rampBottom.y + 14 };

    ctx.save();
    ctx.shadowBlur = 16;
    ctx.shadowColor = "#22d3ee";
    const rampGrad = ctx.createLinearGradient(rampTop.x, rampTop.y, rampBottom.x, rampBottom.y);
    rampGrad.addColorStop(0, "rgba(34,211,238,0.28)");
    rampGrad.addColorStop(1, "rgba(14,165,233,0.45)");
    ctx.fillStyle = rampGrad;
    ctx.beginPath();
    ctx.moveTo(rampTop.x, rampTop.y);
    ctx.lineTo(rampBottom.x, rampBottom.y);
    ctx.lineTo(rampRightBase.x, rampRightBase.y);
    ctx.lineTo(rampLeftBase.x, rampLeftBase.y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(125,211,252,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rampTop.x, rampTop.y);
    ctx.lineTo(rampBottom.x, rampBottom.y);
    ctx.stroke();
    ctx.restore();

    // Flat surface (violet glow band)
    ctx.save();
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#a855f7";
    const flatWidth = width - rampBottom.x - 40;
    const flatHeight = 20;
    const flatGrad = ctx.createLinearGradient(rampBottom.x, rampBottom.y, width, rampBottom.y);
    flatGrad.addColorStop(0, "rgba(168,85,247,0.45)");
    flatGrad.addColorStop(1, "rgba(147,51,234,0.65)");
    ctx.fillStyle = flatGrad;
    ctx.fillRect(rampBottom.x, rampBottom.y, flatWidth, flatHeight);
    ctx.restore();

    ctx.strokeStyle = "rgba(192,132,252,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rampBottom.x, rampBottom.y, flatWidth, flatHeight);
  }, [angleDeg, derived, muK]);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      setTime((prev) => {
        const next = prev + dt;
        if (next >= derived.total) {
          setIsPlaying(false);
          return derived.total;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, derived.total]);

  const launch = () => {
    setTime(0);
    setHasLaunched(true);
    setIsPlaying(true);
    lastTsRef.current = null;
  };
  const togglePlayPause = () => {
    setIsPlaying((p) => {
      if (!p) lastTsRef.current = null;
      return !p;
    });
  };
  const reset = () => {
    setIsPlaying(false);
    setHasLaunched(false);
    setTime(0);
    lastTsRef.current = null;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-fuchsia-400">
                Ramp → Flat (Friction) Simulation
              </h2>
              <p className="text-slate-400 text-sm">
                Slide down a frictionless ramp, then watch kinetic friction slow the block on the flat.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
                {isPlaying ? "In Motion" : hasLaunched ? (phase === "stopped" ? "Stopped" : "Paused") : "Ready"}
              </Badge>
              <Button onClick={() => setShowEducational(true)} variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learn Physics
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 relative overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Static background layer */}
              <canvas
                ref={bgCanvasRef}
                width={width}
                height={height}
                className="absolute top-4 left-4 w-full h-auto rounded-lg border-2 border-slate-700/50"
              />
              
              {/* Ramp/flat layer */}
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="absolute top-4 left-4 w-full h-auto rounded-lg"
              />

              {/* Spacer to maintain aspect ratio */}
              <div style={{ paddingBottom: `${(height / width) * 100}%` }} />

              {/* Block as DOM element */}
              <div
                className="absolute"
                style={{
                  left: kState.x - blockSizePx / 2 + 20,
                  top: kState.y - blockSizePx / 2 - 38,
                  width: blockSizePx,
                  height: blockSizePx,
                  transform: `rotate(${kState.rotationDeg}deg)`,
                  transition: 'none',
                  pointerEvents: "none",
                }}
              >
                <div
                  className="absolute inset-0 rounded-md"
                  style={{
                    filter: "blur(18px)",
                    background: "radial-gradient(60% 60% at 50% 50%, rgba(251,191,36,0.35), rgba(251,191,36,0))",
                  }}
                />
                <div
                  className="w-full h-full rounded-md border flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 55%, #d97706 100%)",
                    borderColor: "#fcd34d",
                    boxShadow: "0 2px 12px rgba(251,191,36,0.2), inset 0 0 10px rgba(0,0,0,0.25)",
                  }}
                >
                  <span className="text-slate-900 font-bold text-xs">{kState.v.toFixed(1)} m/s</span>
                </div>
              </div>

              {/* Status overlay */}
              <div className="absolute left-0 right-0 bottom-3 text-center text-slate-300 text-sm">
                {phase === "ramp"
                  ? `🎢 On ramp — a = ${derived.aRamp.toFixed(2)} m/s²`
                  : phase === "flat"
                  ? `🛸 On flat — a = ${Math.abs(derived.aFlat).toFixed(2)} m/s² (decelerating)`
                  : "✋ Stopped by friction"}
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Control label="Mass" value={mass} unit="kg" min={1} max={30} step={0.5} onChange={setMass} />
              <Control label="Ramp Angle" value={angleDeg} unit="°" min={10} max={45} step={1} onChange={setAngleDeg} />
              <Control
                label="Friction Coefficient (μₖ)"
                value={muK}
                unit=""
                min={0}
                max={0.8}
                step={0.05}
                onChange={setMuK}
              />

              <div className="mt-4 flex flex-col gap-3">
                {!hasLaunched ? (
                  <Button onClick={launch} className="w-full flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Launch
                  </Button>
                ) : (
                  <Button onClick={togglePlayPause} className="w-full flex items-center justify-center gap-2">
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Resume
                      </>
                    )}
                  </Button>
                )}
                <Button variant="outline" onClick={reset} className="w-full flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div className="mt-2 p-3 rounded-lg border border-blue-500/30 bg-slate-800/50">
                <div className="text-xs text-blue-300 mb-2 font-semibold">Current Status</div>
                <div className="space-y-1 text-sm text-white">
                  <div>
                    Time: {time.toFixed(2)}s / {derived.total.toFixed(2)}s
                  </div>
                  <div>Velocity: {kState.v.toFixed(2)} m/s</div>
                  <div>Zone: {phase === "ramp" ? "Ramp" : phase === "flat" ? "Flat Surface" : "Stopped"}</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-blue-500/30 bg-slate-950/40 p-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-cyan-300">{derived.vEnd.toFixed(2)} m/s</div>
              <div className="text-xs text-slate-400">Speed at Bottom</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-fuchsia-300">{derived.dFlat.toFixed(1)} m</div>
              <div className="text-xs text-slate-400">Distance on Flat</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-cyan-200">{derived.tRamp.toFixed(2)} s</div>
              <div className="text-xs text-slate-400">Time on Ramp</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-fuchsia-200">{derived.tFlat.toFixed(2)} s</div>
              <div className="text-xs text-slate-400">Time to Stop</div>
            </div>
          </div>
        </div>
      </Card>

      <EducationalSidebar isOpen={showEducational} onClose={() => setShowEducational(false)} />
    </div>
  );
}