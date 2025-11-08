// DoubleSlitSim.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Maximize2, Gauge, Info, BookOpen, X, Sparkles } from "lucide-react";

/* ---------- UI Primitives (match GasLawSim style) ---------- */
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
        {formatNumber(value, step < 1 ? 1 : step === 0.01 ? 2 : 0)} {unit}
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

/* ---------- Slit Structure and Hit Marker (based on Particle) ---------- */

// Note: In a real simulation, we'd use Huygens–Fresnel principle or Fresnel-Kirchhoff integral.
// For this sim style, we'll simplify and just model the final hit position based on probability.

// Simulation Constants
const DISTANCE_TO_SCREEN = 400; // Arbitrary canvas units
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;
const SLIT_X = 200;

class QuantumParticle {
  constructor(y, wavelength) {
    this.y = y; // Y position on the screen
    this.x = CANVAS_WIDTH - 20; // The screen position
    this.radius = 2; // For visual marker
    this.intensity = 0.5 + Math.random() * 0.5; // Visual brightness
    this.color = `rgba(180, 100, 255, ${this.intensity})`;
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Function to calculate the intensity/probability at a screen position y
// Using the standard intensity formula for two slits (Fraunhofer diffraction simplified)
const calculateIntensity = (y, wavelength, slitSeparation, slitWidth, distanceToScreen) => {
  if (wavelength <= 0 || slitSeparation <= 0) return 0;
  
  const L = distanceToScreen;
  const d = slitSeparation;
  const a = slitWidth;
  const k = (2 * Math.PI) / wavelength; // Wave number
  
  // Angle theta approximation: sin(theta) ≈ y / L
  const sinTheta = y / L;
  
  // Single Slit (Diffraction) term: sinc^2(alpha)
  const alpha = (k * a * sinTheta) / 2;
  const sincAlpha = alpha === 0 ? 1 : Math.sin(alpha) / alpha;
  const singleSlitIntensity = sincAlpha * sincAlpha;
  
  // Double Slit (Interference) term: cos^2(beta)
  const beta = (k * d * sinTheta) / 2;
  const doubleSlitIntensity = Math.cos(beta) * Math.cos(beta);
  
  // Total Intensity (simplified)
  return 4 * singleSlitIntensity * doubleSlitIntensity;
};

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
                <h2 className="text-2xl font-bold text-white">Learn Quantum Physics</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 text-slate-300">
              {/* Double Slit Experiment */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  The Double-Slit Experiment
                </h3>
                <p className="leading-relaxed mb-3">
                  This experiment demonstrates <span className="font-semibold text-purple-300">wave-particle duality</span>. When particles (like electrons or photons) are sent through two closely spaced slits:
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>If we <span className="font-medium text-amber-300">don't observe</span> which slit they pass through, they act like a wave, creating an <span className="font-medium text-emerald-300">interference pattern</span>.</li>
                    <li>If we <span className="font-medium text-amber-300">observe</span> their path, they act like particles, creating only two distinct bands.</li>
                  </ul>
                </p>
              </section>

              {/* Interference and Diffraction */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Interference and Diffraction
                </h3>
                <p className="leading-relaxed">
                  <span className="font-semibold text-purple-300">Interference</span> causes the bright and dark fringes. Constructive interference (bright spots) occurs when the path length difference is a whole number of wavelengths ($\lambda$).
                </p>
                <p className="leading-relaxed mt-2">
                  <span className="font-semibold text-purple-300">Diffraction</span> (single-slit effect) dictates the overall shape of the envelope, widening the pattern when the slit width is smaller.
                </p>
              </section>

              {/* De Broglie Wavelength */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded" />
                  Wavelength and Momentum
                </h3>
                <p className="leading-relaxed">
                  The particles' wave nature is defined by the de Broglie wavelength: $\lambda = h/p$.
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    <li>Lower Momentum (e.g., lower speed) $\to$ Larger $\lambda$ $\to$ <span className="font-medium text-cyan-300">Wider Interference Pattern</span>.</li>
                    <li>Higher Momentum (e.g., higher speed) $\to$ Smaller $\lambda$ $\to$ <span className="font-medium text-cyan-300">Narrower Pattern</span> (closer to particle-like behavior).</li>
                  </ul>
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

/* ---------- Main Component ---------- */
export default function DoubleSlitSim() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  // Simulation parameters (Control Panel)
  const [wavelength, setWavelength] = useState(1); // Arbitrary units (e.g., nanometers * constant)
  const [slitSeparation, setSlitSeparation] = useState(15); // Distance between slit centers
  const [slitWidth, setSlitWidth] = useState(5); // Width of each slit
  const [particleRate, setParticleRate] = useState(50); // Particles per second (for visualization)
  const [showEducational, setShowEducational] = useState(false);
  
  const [totalHits, setTotalHits] = useState(0);

  // Visualization state
  const hitsRef = useRef(new Array(CANVAS_HEIGHT).fill(0));
  const particleVisualsRef = useRef([]); // For animated particles
  const HIT_DECAY_RATE = 0.99; // For the glowing effect to fade

  // Dimensions
  const SLIT_CENTER = CANVAS_HEIGHT / 2;
  const SLIT_HALF_SEP = slitSeparation / 2;
  
  // Derived positions of the slits on the canvas Y-axis
  const slit1Top = SLIT_CENTER - SLIT_HALF_SEP - (slitWidth / 2);
  const slit1Bottom = SLIT_CENTER - SLIT_HALF_SEP + (slitWidth / 2);
  const slit2Top = SLIT_CENTER + SLIT_HALF_SEP - (slitWidth / 2);
  const slit2Bottom = SLIT_CENTER + SLIT_HALF_SEP + (slitWidth / 2);

  // Function to calculate a particle's hit position based on probability
  const getHitPosition = useCallback(() => {
    // We'll calculate the probability distribution across the entire screen height
    const MAX_INTENSITY = calculateIntensity(0, wavelength, slitSeparation, slitWidth, DISTANCE_TO_SCREEN);
    let MAX_PROB = 0;
    
    // Find the max probability to normalize the search
    // We can pre-calculate the probability distribution map, but for simplicity, 
    // we'll sample until we find a hit based on rejection sampling.
    
    let hitY = -1;
    let attempts = 0;
    const MAX_ATTEMPTS = 100;
    
    while (hitY === -1 && attempts < MAX_ATTEMPTS) {
      attempts++;
      
      // Random Y position on the screen
      const yCandidate = Math.random() * CANVAS_HEIGHT;
      const yNormalized = yCandidate - SLIT_CENTER; // Y relative to center
      
      // Calculate probability/intensity at this point
      const intensity = calculateIntensity(yNormalized, wavelength, slitSeparation, slitWidth, DISTANCE_TO_SCREEN);
      
      // Normalize and compare to a random number (Rejection Sampling)
      const normalizedProb = intensity / MAX_INTENSITY;
      if (Math.random() < normalizedProb) {
        hitY = yCandidate;
      }
    }

    // Fallback if max attempts fail (unlikely)
    return hitY !== -1 ? hitY : SLIT_CENTER;
  }, [wavelength, slitSeparation, slitWidth]);


  /* Animation loop */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Simulation state references
    const hitMap = hitsRef.current;
    const particleVisuals = particleVisualsRef.current;
    
    let particleCounter = 0;
    const PARTICLES_PER_FRAME = particleRate / 60; // Assuming ~60 FPS

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.02) * 60; // fixed-ish timestep
      lastTimeRef.current = now;

      // 1. Clear and Draw Background (Space theme)
      const grad = ctx.createRadialGradient(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH);
      grad.addColorStop(0, "#0b1220");
      grad.addColorStop(0.5, "#0a0f1a");
      grad.addColorStop(1, "#05080f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Star field (light twinkle)
      for (let i = 0; i < 80; i++) {
        const x = (i * 97) % CANVAS_WIDTH;
        const y = (i * 151) % CANVAS_HEIGHT;
        const alpha = 0.15 + (Math.sin(i + now * 0.001) + 1) / 4;
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fillRect(x, y, 1, 1);
      }
      
      // 2. Slit Wall (Glowing Purple)
      const wallThickness = 15;
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(180,100,255,0.7)";
      ctx.fillStyle = "rgba(100,50,180,0.9)";
      
      // Draw the wall sections
      // Top section
      ctx.fillRect(SLIT_X, 0, wallThickness, slit1Top);
      // Middle section (between slits)
      ctx.fillRect(SLIT_X, slit1Bottom, wallThickness, slit2Top - slit1Bottom);
      // Bottom section
      ctx.fillRect(SLIT_X, slit2Bottom, wallThickness, CANVAS_HEIGHT - slit2Bottom);
      
      ctx.restore();
      
      // 3. Screen/Detector (Right edge)
      const screenX = CANVAS_WIDTH - 10;
      ctx.strokeStyle = "rgba(180,100,255,0.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(screenX, 0);
      ctx.lineTo(screenX, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.fillStyle = "rgba(180,100,255,0.1)";
      ctx.fillRect(screenX - 1, 0, 10, CANVAS_HEIGHT);
      
      // 4. Hit Simulation Logic (Accumulate)
      particleCounter += PARTICLES_PER_FRAME * dt;
      const particlesToSimulate = Math.floor(particleCounter);
      particleCounter -= particlesToSimulate;

      if (particlesToSimulate > 0) {
        setTotalHits(prev => prev + particlesToSimulate);
      }

      for (let i = 0; i < particlesToSimulate; i++) {
        const hitY = getHitPosition();
        const hitIndex = Math.floor(hitY);
        if (hitIndex >= 0 && hitIndex < CANVAS_HEIGHT) {
          hitMap[hitIndex] += 1;
        }
      }
      
      // 5. Decay and Draw Hit Map (The Interference Pattern)
      ctx.save();
      const maxHit = Math.max(...hitMap, 1);
      
      for (let y = 0; y < CANVAS_HEIGHT; y++) {
        const hitValue = hitMap[y];
        
        // Decay the value
        hitMap[y] *= HIT_DECAY_RATE; 
        
        // Draw the hit as a thin, purple line on the screen
        if (hitValue > 0.1) {
          const brightness = Math.min(1, hitValue / maxHit);
          ctx.fillStyle = `rgba(180, 100, 255, ${brightness})`;
          ctx.fillRect(screenX - 10, y, 10, 1); // Draw a 1-pixel high line
        }
      }
      ctx.restore();
      
      // 6. Animation markers (Optional: for a few single particles)
      particleVisuals.forEach(p => p.draw(ctx));
      // No movement physics needed for this simplified model
      
      // 7. Label
      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.strokeStyle = "rgba(139,92,246,0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(CANVAS_WIDTH / 2 - 140, CANVAS_HEIGHT - 50, 280, 40, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#c4b5fd";
      ctx.font = "bold 18px Inter, serif";
      ctx.textAlign = "center";
      ctx.fillText("Probability Distribution", CANVAS_WIDTH / 2, CANVAS_HEIGHT - 23);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [wavelength, slitSeparation, slitWidth, particleRate, getHitPosition]);
  
  // Function to reset the hit map
  const resetSim = () => {
    hitsRef.current = new Array(CANVAS_HEIGHT).fill(0);
    setTotalHits(0);
  };


  /* ---------- Layout (Pendulum-style) ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-purple-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Double-Slit Experiment Sim</h2>
              <p className="text-slate-400 text-sm mt-1">
                Explore the wave-particle duality by observing the interference pattern.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={resetSim} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700">
                <Sparkles className="w-4 h-4" />
                Reset Pattern
              </Button>
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
              <div className="rounded-xl border border-slate-700/50 bg-black overflow-hidden relative">
                <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="w-full h-auto" />
                {/* Slit labels - position them on top of the canvas via absolute positioning */}
                <div 
                  className="absolute text-white font-mono text-sm" 
                  style={{ left: SLIT_X + 20, top: SLIT_CENTER - SLIT_HALF_SEP - (slitWidth / 2) - 30 }}
                >
                  Slit 1
                </div>
                <div 
                  className="absolute text-white font-mono text-sm" 
                  style={{ left: SLIT_X + 20, top: SLIT_CENTER + SLIT_HALF_SEP - (slitWidth / 2) + 10 }}
                >
                  Slit 2
                </div>
                <div 
                  className="absolute text-white font-mono text-sm text-right" 
                  style={{ right: 20, top: 10 }}
                >
                  Detector Screen
                </div>
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
                Experiment Parameters
              </h3>

              <Control
                label="Wavelength (λ)"
                value={wavelength}
                unit="unit"
                min={0.1}
                max={5}
                step={0.1}
                onChange={setWavelength}
                icon={ChevronDown} // Placeholder for a wave icon
              />
              <Control
                label="Slit Separation (d)"
                value={slitSeparation}
                unit="unit"
                min={1}
                max={50}
                step={0.5}
                onChange={setSlitSeparation}
                icon={Maximize2}
              />
              <Control
                label="Slit Width (a)"
                value={slitWidth}
                unit="unit"
                min={1}
                max={20}
                step={0.5}
                onChange={setSlitWidth}
                icon={Gauge} // Placeholder for a measure/gap icon
              />
              <Control
                label="Particle Rate"
                value={particleRate}
                unit="/s"
                min={10}
                max={200}
                step={10}
                onChange={setParticleRate}
                icon={Sparkles}
              />

              <div className="pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-2">Total Hits Detected:</div>
                <div className="text-3xl font-bold text-purple-400">
                  {totalHits.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-800/40 p-3 rounded-lg text-xs text-slate-400">
                💡 <strong>Tip:</strong> A larger wavelength or smaller slit separation produces a more pronounced interference pattern.
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
            <Stat label="Wavelength (λ)" value={formatNumber(wavelength, 1)} unit="unit" color="text-purple-400" />
            <Stat label="Separation (d)" value={formatNumber(slitSeparation, 1)} unit="unit" color="text-blue-400" />
            <Stat label="Width (a)" value={formatNumber(slitWidth, 1)} unit="unit" color="text-pink-400" />
            <Stat label="Total Hits" value={totalHits.toLocaleString()} unit="count" color="text-amber-400" />
            <Stat label="Path Length (L)" value={`${DISTANCE_TO_SCREEN}`} unit="unit" color="text-emerald-400" />
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