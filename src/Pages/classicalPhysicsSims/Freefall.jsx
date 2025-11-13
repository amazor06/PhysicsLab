// FreeFallSim.jsx
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { BookOpen, X, Play, Pause, RotateCcw } from "lucide-react";

/* ---------- UI Primitives (Preserved from original) ---------- */
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
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// MathText helper for beautiful equation rendering
const MathText = ({ children }) => <span className="italic font-serif">{children}</span>;

// Refined Control component (Keeping original structure but adding number input for better UX)
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
    <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
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


const EducationalSidebar = ({ isOpen, onClose, terminalVelocity, mass, dragCoeff }) => (
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
                <h2 className="text-2xl font-bold text-white">Physics of Free Fall</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 text-slate-300">
              <section>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded" />
                  Newton's Second Law with Drag
                </h3>
                <p className="leading-relaxed mb-4">
                  The net force (<MathText>F</MathText><sub className="text-sm">net</sub>) determines the object's acceleration (<MathText>a</MathText>). We use the quadratic drag model, where drag is proportional to the square of velocity.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-blue-400">
                  <strong className="text-blue-400">Equation of Motion:</strong>
                  <div className="text-lg text-white font-mono mt-1">
                    <MathText>m a = F</MathText><sub className="text-sm">g</sub> - <MathText>F</MathText><sub className="text-sm">D</sub>
                  </div>
                  <div className="text-lg text-white font-mono mt-1">
                    <MathText>m (dv/dt) = m g - k v²</MathText>
                  </div>
                  <p className="text-sm mt-2 text-slate-400 italic">
                    The acceleration <MathText>a</MathText> decreases as the object speeds up.
                  </p>
                </div>
              </section>

              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Drag Force and Drag Factor (<MathText>k</MathText>)
                </h3>
                <p className="leading-relaxed mb-4">
                  The Drag Factor (<MathText>k</MathText>) is your adjustable parameter. It encapsulates all properties of the object and the fluid (air) that contribute to resistance.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-purple-400">
                  <strong className="text-purple-400">Drag Force:</strong>
                  <div className="text-lg text-white font-mono mt-1">
                    <MathText>F</MathText><sub className="text-sm">D</sub> = <MathText>k v²</MathText>
                  </div>
                  <p className="text-xs mt-2 text-slate-400">
                    <MathText>k</MathText> in the simulation is proportional to (1/2) * air density * cross-sectional area * <MathText>C</MathText><sub className="text-sm">D</sub> (Drag Coefficient).
                  </p>
                </div>
              </section>

              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded" />
                  Terminal Velocity (<MathText>v</MathText><sub className="text-sm">T</sub>)
                </h3>
                <p className="leading-relaxed mb-4">
                  This is the maximum speed the object can reach. It occurs when <MathText>F</MathText><sub className="text-sm">g</sub> = <MathText>F</MathText><sub className="text-sm">D</sub>, resulting in zero net acceleration.
                </p>
                <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-cyan-400">
                  <strong className="text-cyan-400">Terminal Velocity Formula:</strong>
                  <div className="text-lg text-white font-mono mt-1">
                    <MathText>v</MathText><sub className="text-sm">T</sub> = <MathText>√(m g / k)</MathText>
                  </div>
                </div>
              </section>
              
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-pink-500 rounded" />
                  Current Physics Values
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-blue-400">
                    <strong className="text-blue-400">Mass (<MathText>m</MathText>):</strong>
                    <p className="mt-1">{mass.toFixed(2)} kg</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-purple-400">
                    <strong className="text-purple-400">Drag Factor (<MathText>k</MathText>):</strong>
                    <p className="mt-1">{dragCoeff.toFixed(3)}</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border-l-4 border-cyan-400">
                    <strong className="text-cyan-400">Terminal Velocity (<MathText>v</MathText><sub className="text-sm">T</sub>):</strong>
                    <p className="mt-1">{terminalVelocity.toFixed(2)} m/s</p>
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
export default function FreeFallSimulation() {
  // Simulation Constants
  const width = 800;
  const height = 500;
  const pxPerM = 8; // Pixels per meter (500px height = 62.5 meters)
  const g = 9.81; // m/s^2
  
  // Starting and Ground pixel positions
  const groundYPx = height - 30;
  const startYPx = 50; 
  const objectRadius = 15;
  
  // Custom Offset for ball position (Moving it 50px to the left from center)
  const ballXOffset = -50; 
  const ballXPosition = width / 2 + ballXOffset;
  
  // Physics Parameters (State)
  const [mass, setMass] = useState(1.0); // kg
  const [dragCoeff, setDragCoeff] = useState(0.05); // k factor (Adjustable parameter)
  
  // Simulation Control (State)
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [showEducational, setShowEducational] = useState(false);
  
  // State for fixed initial values after launch
  const [initialA, setInitialA] = useState(g.toFixed(2)); // Initial acceleration (g, fixed at launch)
  const [initialV, setInitialInitialV] = useState(0.00); // Initial velocity (0.00, fixed at launch)

  // Use ref for the actual physics state (more stable for animation loop)
  const physicsStateRef = useRef({
    yM: 0, // Position in meters from startY (distance fallen)
    vM: 0, // Velocity in m/s
  });
  
  const animationRef = useRef();
  const lastTsRef = useRef();

  // framer-motion utility for animating the ball's Y position smoothly
  const ballY = useSpring(startYPx, { stiffness: 50, damping: 20 }); 

  // Derived Constants (Memoized)
  const derived = useMemo(() => {
    // Terminal Velocity: vT = sqrt(m g / k)
    const k_safe = dragCoeff < 0.0001 ? 0.0001 : dragCoeff; 
    const vT = Math.sqrt((mass * g) / k_safe);
    
    // Max fall distance in meters (from startY to ground)
    const maxFallDistanceM = (groundYPx - startYPx) / pxPerM;

    return {
      vT,
      k: dragCoeff, // The k factor is directly the dragCoeff slider value
      maxFallDistanceM,
    };
  }, [mass, dragCoeff, g, groundYPx, startYPx, pxPerM]);

  // Physics update logic (Quadratic Drag: a = g - (k/m) * v^2)
  const updatePhysics = useCallback(
    (dt) => {
      const { yM, vM } = physicsStateRef.current;
      
      // Forces and Acceleration
      // F_net = F_g - F_D = m*g - k*v^2
      // a = F_net / m
      const a = g - (derived.k / mass) * vM * vM;

      // New Velocity (Euler integration step)
      const vM_new = vM + a * dt;

      // New Position (Euler integration step)
      const yM_new = yM + vM * dt; 

      // Check for ground collision
      if (yM_new >= derived.maxFallDistanceM) {
        physicsStateRef.current = { yM: derived.maxFallDistanceM, vM: 0 };
        // Set final position for the animation spring
        ballY.set(groundYPx); 
        setIsPlaying(false);
        setStatus("Stopped");
        return; // Stop physics loop implicitly via isPlaying=false
      }

      // Update state ref
      physicsStateRef.current = { yM: yM_new, vM: vM_new };
      
      // Update animation position
      ballY.set(startYPx + yM_new * pxPerM); 
      
      // Update global time state for display
      setTime((prev) => prev + dt);
    },
    [mass, derived.k, derived.maxFallDistanceM, g, pxPerM, startYPx, groundYPx, ballY]
  );

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      // Cap dt to prevent numerical instability after long pauses
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05); 
      lastTsRef.current = ts;

      updatePhysics(dt);
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, updatePhysics]);

  // UI Control Functions
  const launch = () => {
    setTime(0);
    physicsStateRef.current = { yM: 0, vM: 0 }; // Reset physics state
    setHasLaunched(true);
    setIsPlaying(true);
    setStatus("In Motion");
    lastTsRef.current = null;
    
    // Capture fixed initial values
    setInitialA((g - (derived.k / mass) * 0 * 0).toFixed(2)); // At v=0, a=g
    setInitialInitialV(0.00);

    // Start animation position
    ballY.set(startYPx);
  };
  
  const togglePlayPause = () => {
    setIsPlaying((p) => !p);
    setStatus((s) => (s === "In Motion" ? "Paused" : "In Motion"));
    lastTsRef.current = null;
  };
  
  const reset = () => {
    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setHasLaunched(false);
    physicsStateRef.current = { yM: 0, vM: 0 };
    setTime(0);
    setStatus("Ready");
    lastTsRef.current = null;
    
    // Reset animation position
    ballY.set(startYPx);
    
    // Reset fixed initial values
    setInitialA(g.toFixed(2));
    setInitialInitialV(0.00);
  };

  // Values for display and rendering
  const { vM } = physicsStateRef.current;
  
  // Calculate current acceleration for display
  const currentA = g - (derived.k / mass) * vM * vM;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-5xl mx-auto backdrop-blur-sm">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-fuchsia-400">
                Free Fall Simulation with Quadratic Drag
              </h2>
              <p className="text-slate-400 text-sm">
                Observe terminal velocity by adjusting the mass and drag factor (<MathText>k</MathText>).
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
                {status}
              </Badge>
              <Button onClick={() => setShowEducational(true)} variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Learn Physics
              </Button>
            </div>
          </div>

          {/* Simulation + Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Canvas */}
            <motion.div
              className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4 relative overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <svg width={width} height={height} className="rounded-lg border border-slate-700/50 bg-black/50">
                {/* Background (Stars/Space Vibe) */}
                <rect width={width} height={height} fill="url(#spaceGradient)" />
                <defs>
                  <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: "#05080f", stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: "#0a0f1a", stopOpacity: 1}} />
                  </linearGradient>
                </defs>

                {/* Ground */}
                <rect x="0" y={groundYPx} width={width} height="30" fill="rgba(147,51,234,0.4)" stroke="#a855f7" />

                {/* Object - Using motion.circle for framer-motion smooth animation */}
                <motion.circle 
                    cx={ballXPosition} 
                    cy={ballY} 
                    r={objectRadius} 
                    fill="#fbbf24" 
                    stroke="#fcd34d" 
                    strokeWidth="2"
                >
                  {/* Tooltip text for velocity */}
                  <title>{vM.toFixed(2)} m/s</title>
                </motion.circle>
              </svg>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Control
                label="Object Mass (m)"
                value={mass}
                unit="kg"
                min={0.1}
                max={5.0}
                step={0.1}
                onChange={setMass}
              />
              <Control
                label="Drag Factor (k)"
                value={dragCoeff}
                unit=""
                min={0.0}
                max={0.2}
                step={0.005}
                onChange={setDragCoeff}
              />

              <div className="mt-4 flex flex-col gap-3">
                {!hasLaunched || status === "Stopped" ? (
                  <Button onClick={launch} className="w-full flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" /> Start Fall
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

              {/* Current Simulation Values - (Unchanged, still shows dynamic V and A) */}
              <div className="mt-2 p-3 rounded-lg border border-blue-500/30 bg-slate-800/50">
                <div className="text-xs text-blue-300 mb-2 font-semibold">Current Simulation Values</div>
                <div className="space-y-1 text-sm text-white">
                  <div>Time: {time.toFixed(2)} s</div>
                  <div>
                    Velocity: 
                    <span className="font-mono ml-1">
                        {hasLaunched ? vM.toFixed(2) : initialV}
                    </span> 
                    m/s
                  </div>
                  <div>
                    Acceleration: 
                    <span className="font-mono ml-1">
                        {isPlaying ? currentA.toFixed(2) : initialA}
                    </span> 
                    m/s²
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer Stats - CHANGE: Replaced Current Accel. with Current Velocity */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-blue-500/30 bg-slate-950/40 p-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-cyan-300">{derived.vT.toFixed(2)} m/s</div>
              <div className="text-xs text-slate-400">Terminal Velocity (<MathText>v</MathText><sub className="text-sm">T</sub>)</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-fuchsia-300">{g.toFixed(2)} m/s²</div>
              <div className="text-xs text-slate-400">Gravitational Accel. (<MathText>g</MathText>)</div>
            </div>
            <div>
              {/* THIS SECTION IS UPDATED TO CURRENT VELOCITY */}
              <div className="text-2xl font-semibold text-cyan-200">
                {hasLaunched ? vM.toFixed(2) : initialV} m/s
              </div>
              <div className="text-xs text-slate-400">
                {hasLaunched ? "Current Speed" : "Initial Speed"} (<MathText>v</MathText>)
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-fuchsia-200">{derived.k.toFixed(3)}</div>
              <div className="text-xs text-slate-400">Drag Factor (<MathText>k</MathText>)</div>
            </div>
          </div>
        </div>
      </Card>

      <EducationalSidebar 
        isOpen={showEducational} 
        onClose={() => setShowEducational(false)} 
        terminalVelocity={derived.vT}
        mass={mass}
        dragCoeff={dragCoeff}
      />
    </div>
  );
}