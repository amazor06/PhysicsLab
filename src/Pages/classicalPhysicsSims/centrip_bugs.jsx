import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";

/* ---------- UI Helpers ---------- */
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

const Badge = ({ children, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
    {children}
  </span>
);

const formatNumber = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "0.00");

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
  </div>
);

/* ---------- Sidebar ---------- */
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
          className="fixed right-0 top-0 h-full w-full md:w-[540px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  Centripetal Force in Loop Motion
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-6 text-slate-300">
              <p>
                The ball converts potential energy into kinetic energy as it rolls down
                the ramp. Inside the loop, centripetal force keeps it in circular motion.
              </p>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-center text-white">
                F<sub>c</sub> = m·v² / r
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ---------- Main Simulation ---------- */
export default function CentripetalForceSim() {
  const [angle, setAngle] = useState(30);
  const [radius, setRadius] = useState(80);
  const [mass, setMass] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [showEducational, setShowEducational] = useState(false);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const width = 700;
  const height = 420;
  const g = 980; // cm/s²
  const rampStart = useMemo(() => ({ x: 100, y: 100 }), []);
  const loopCenter = useMemo(
    () => ({ x: 480, y: height - 100 - radius }),
    [radius, height]
  );

  const rampEnd = useMemo(
    () => ({ x: loopCenter.x - radius * 0.9, y: loopCenter.y + radius * 0.9 }),
    [loopCenter, radius]
  );

  const rampLength = Math.sqrt(
    (rampEnd.x - rampStart.x) ** 2 + (rampEnd.y - rampStart.y) ** 2
  );
  const rampHeight = rampEnd.y - rampStart.y;

  /* ---------- Draw ---------- */
  function drawScene(ctx, ball) {
    ctx.clearRect(0, 0, width, height);

    // Ramp
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rampStart.x, rampStart.y);
    ctx.lineTo(rampEnd.x, rampEnd.y);
    ctx.stroke();

    // Loop
    ctx.beginPath();
    ctx.arc(loopCenter.x, loopCenter.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ball
    const grad = ctx.createRadialGradient(ball.x, ball.y, 2, ball.x, ball.y, 10);
    grad.addColorStop(0, "#3b82f6");
    grad.addColorStop(1, "#a855f7");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ---------- Initial Scene ---------- */
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    drawScene(ctx, rampStart);
  }, [radius, angle]);

  /* ---------- Animation ---------- */
  useEffect(() => {
    if (!isRunning) return;

    const ctx = canvasRef.current.getContext("2d");
    let t = 0;
    const dt = 0.02;

    const vRampEnd = Math.sqrt(2 * (g / 100) * rampHeight);
    const totalRampTime = rampLength / vRampEnd;
    const omega = vRampEnd / radius;
    const totalLoopTime = (2 * Math.PI) / omega; // one full loop
    const exitSpeed = vRampEnd * 0.9;

    const animate = () => {
      let ball = { x: 0, y: 0 };

      if (t < totalRampTime) {
        // Rolling down ramp
        const progress = t / totalRampTime;
        const dx = rampEnd.x - rampStart.x;
        const dy = rampEnd.y - rampStart.y;
        ball.x = rampStart.x + dx * progress;
        ball.y = rampStart.y + dy * progress;
      } else if (t < totalRampTime + totalLoopTime) {
        // Looping once CCW
        const loopT = t - totalRampTime;
        const theta = Math.PI + omega * loopT;
        ball.x = loopCenter.x + radius * Math.cos(theta);
        ball.y = loopCenter.y + radius * Math.sin(theta);
      } else {
        // Exiting tangentially (bottom right)
        const exitT = t - (totalRampTime + totalLoopTime);
        const thetaExit = Math.PI + omega * totalLoopTime;
        const exitDirX = Math.cos(thetaExit - Math.PI / 2);
        const exitDirY = Math.sin(thetaExit - Math.PI / 2);
        const lastX = loopCenter.x + radius * Math.cos(thetaExit);
        const lastY = loopCenter.y + radius * Math.sin(thetaExit);
        ball.x = lastX + exitSpeed * 25 * exitT * exitDirX;
        ball.y = lastY + exitSpeed * 25 * exitT * exitDirY;
      }

      drawScene(ctx, ball);
      t += dt;

      if (ball.x > width + 100 || ball.y > height + 100) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning, radius, rampStart, rampEnd, loopCenter, g, rampHeight]);

  /* ---------- Stats ---------- */
  const v_mps = Math.sqrt(2 * (g / 100) * (rampHeight / 100));
  const Fc_N = (mass * v_mps * v_mps) / (radius / 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Centripetal Force Studio</h2>
              <p className="text-slate-400 text-sm">
                Watch the ball roll down a ramp, loop once, and fly offscreen.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="uppercase tracking-wide text-xs border-blue-500/30 text-blue-400">
                {isRunning ? "RUNNING" : "STOPPED"}
              </Badge>
              <Button
                onClick={() => setShowEducational(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Learn Physics
              </Button>
            </div>
          </div>

          {/* Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="w-full h-auto rounded-lg bg-slate-950 border border-slate-800"
              />
            </motion.div>

            {/* Controls */}
            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Control
                label="Ramp Angle (Visual)"
                value={angle}
                unit="°"
                min={15}
                max={45}
                step={1}
                onChange={setAngle}
                disabled={isRunning}
              />
              <Control
                label="Loop Radius"
                value={radius}
                unit="px"
                min={60}
                max={120}
                step={5}
                onChange={setRadius}
                disabled={isRunning}
              />
              <Control
                label="Mass"
                value={mass}
                unit="kg"
                min={0.5}
                max={5}
                step={0.5}
                onChange={setMass}
                disabled={isRunning}
              />

              <div className="mt-4 flex flex-col gap-3">
                <Button onClick={() => setIsRunning(!isRunning)} className="w-full">
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(radius / 100, 2)} m
              </div>
              <div className="text-xs text-slate-400">Loop Radius</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(v_mps, 2)} m/s
              </div>
              <div className="text-xs text-slate-400">Exit Velocity</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(Fc_N, 1)} N
              </div>
              <div className="text-xs text-slate-400">Centripetal Force</div>
            </div>
          </div>
        </div>
      </Card>

      <EducationalSidebar
        isOpen={showEducational}
        onClose={() => setShowEducational(false)}
      />
    </div>
  );
}


