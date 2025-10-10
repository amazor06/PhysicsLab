import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg p-6 ${className}`}>{children}</div>
);

const Button = ({ children, onClick, className = "", variant = "default" }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-slate-600 hover:bg-slate-800 text-white"
  };
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = "" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${className}`}>
    {children}
  </span>
);

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

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
        disabled={disabled}
      />
      <span>{max}</span>
    </div>
  </div>
);

const MathText = ({ children }) => (
  <span className="italic font-serif">{children}</span>
);

const Fraction = ({ num, den }) => (
  <span className="inline-flex flex-col items-center justify-center mx-1" style={{ verticalAlign: 'middle' }}>
    <span className="text-sm border-b border-current px-1">{num}</span>
    <span className="text-sm px-1">{den}</span>
  </span>
);

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
                <h2 className="text-2xl font-bold text-white">Physics of the Pendulum</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 text-slate-300">
              {/* Introduction */}
              <section>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  What is a Simple Pendulum?
                </h3>
                <p className="leading-relaxed mb-3">
                  A simple pendulum is an idealized model consisting of a point mass (the bob) suspended 
                  by a massless, inextensible string from a fixed pivot point. When displaced from its 
                  equilibrium position and released, the pendulum swings back and forth under the influence 
                  of gravity.
                </p>
                <p className="leading-relaxed text-slate-400 text-sm">
                  The beauty of the pendulum lies in its predictable, periodic motion—making it one of the 
                  first systems studied in classical mechanics and a cornerstone of understanding oscillatory behavior.
                </p>
              </section>

              {/* Motion Analysis */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  The Equation of Motion
                </h3>
                <p className="leading-relaxed mb-4">
                  The pendulum's motion is governed by Newton's second law applied to rotational motion. 
                  The tangential component of gravity creates a restoring torque that pulls the bob back 
                  toward equilibrium.
                </p>
                
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 mb-4">
                  <h4 className="text-blue-400 font-semibold mb-3">Differential Equation</h4>
                  <div className="text-2xl text-white mb-3 text-center py-2 flex items-center justify-center gap-2">
                    <Fraction num={<span>d²<MathText>θ</MathText></span>} den={<span>d<MathText>t</MathText>²</span>} />
                    <span>= −</span>
                    <Fraction num={<MathText>g</MathText>} den={<MathText>L</MathText>} />
                    <span>sin <MathText>θ</MathText></span>
                  </div>
                  <div className="text-sm space-y-1 bg-slate-900/50 p-3 rounded">
                    <p><MathText>θ</MathText> = angular displacement from vertical (radians)</p>
                    <p><MathText>L</MathText> = length of the pendulum (meters)</p>
                    <p><MathText>g</MathText> = gravitational acceleration ≈ 9.81 m/s²</p>
                    <p><MathText>t</MathText> = time (seconds)</p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-amber-400">Note:</strong> This is a nonlinear differential equation 
                    with no closed-form analytical solution for large angles. The sine term makes it challenging 
                    to solve exactly!
                  </p>
                </div>
              </section>

              {/* Small Angle Approximation */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded"></span>
                  Small Angle Approximation
                </h3>
                <p className="leading-relaxed mb-4">
                  For small angles (typically <MathText>θ</MathText> &lt; 15° or ~0.26 radians), we can use 
                  the approximation sin <MathText>θ</MathText> ≈ <MathText>θ</MathText>. This simplifies our 
                  differential equation dramatically:
                </p>
                
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 mb-4">
                  <div className="text-2xl text-white mb-4 text-center py-2 flex items-center justify-center gap-2">
                    <Fraction num={<span>d²<MathText>θ</MathText></span>} den={<span>d<MathText>t</MathText>²</span>} />
                    <span>≈ −</span>
                    <Fraction num={<MathText>g</MathText>} den={<MathText>L</MathText>} />
                    <MathText>θ</MathText>
                  </div>
                  <p className="text-sm text-center text-slate-400">
                    This is the equation for <strong>simple harmonic motion (SHM)</strong>!
                  </p>
                </div>

                <p className="leading-relaxed text-sm">
                  Under this approximation, the solution becomes sinusoidal: <MathText>θ(t)</MathText> = 
                  <MathText>θ</MathText>₀ cos(<MathText>ωt</MathText>), where <MathText>ω</MathText> = √
                  <span className="inline-flex items-center">
                    (<Fraction num={<MathText>g</MathText>} den={<MathText>L</MathText>} />)
                  </span>{' '}
                  is the angular frequency.
                </p>
              </section>

              {/* Period */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded"></span>
                  Period of Oscillation
                </h3>
                <p className="leading-relaxed mb-4">
                  The period <MathText>T</MathText> is the time it takes for one complete oscillation. 
                  For small angles, Christiaan Huygens discovered this remarkable formula in the 17th century:
                </p>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-6 rounded-lg border border-purple-500/30 mb-4">
                  <div className="text-3xl text-white mb-4 text-center py-2 flex items-center justify-center gap-2">
                    <MathText>T</MathText>
                    <span>= 2π</span>
                    <span className="text-2xl">√</span>
                    <span className="inline-flex items-center">
                      (<Fraction num={<MathText>L</MathText>} den={<MathText>g</MathText>} />)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">📊 Period is independent of mass:</strong>
                    <p className="mt-1">Whether the bob weighs 1 kg or 10 kg, the period remains the same!</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">📏 Period depends on length:</strong>
                    <p className="mt-1">Doubling the length increases the period by a factor of √2 ≈ 1.41</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">🌍 Period depends on gravity:</strong>
                    <p className="mt-1">The same pendulum would swing slower on the Moon where <MathText>g</MathText> ≈ 1.62 m/s²</p>
                  </div>
                </div>
              </section>

              {/* Energy Conservation */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-pink-500 rounded"></span>
                  Energy Conservation
                </h3>
                <p className="leading-relaxed mb-4">
                  In an ideal pendulum (no friction or air resistance), mechanical energy is conserved. 
                  Energy continuously transforms between potential and kinetic forms as the pendulum swings.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-5 rounded-lg border border-pink-500/30">
                    <h4 className="text-pink-400 font-semibold mb-3 flex items-center gap-2">
                      Gravitational Potential Energy
                    </h4>
                    <div className="text-xl text-white mb-3 text-center flex items-center justify-center gap-2">
                      <MathText>PE</MathText>
                      <span>= <MathText>mgh</MathText> = <MathText>mgL</MathText>(1 − cos <MathText>θ</MathText>)</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      The height <MathText>h</MathText> above the lowest point is <MathText>L</MathText>(1 − cos <MathText>θ</MathText>). 
                      PE is maximum when the pendulum is at its highest points (maximum displacement) and zero at 
                      the bottom of the swing.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-5 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                      Kinetic Energy
                    </h4>
                    <div className="text-xl text-white mb-3 text-center flex items-center justify-center gap-2">
                      <MathText>KE</MathText>
                      <span>=</span>
                      <Fraction num="1" den="2" />
                      <MathText>mv²</MathText>
                      <span>=</span>
                      <Fraction num="1" den="2" />
                      <MathText>m</MathText>
                      <span>(<MathText>Lω</MathText>)²</span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      The linear velocity <MathText>v</MathText> = <MathText>Lω</MathText>, where <MathText>ω</MathText> = 
                      <Fraction num={<span>d<MathText>θ</MathText></span>} den={<span>d<MathText>t</MathText></span>} />{' '}
                      is the angular velocity. KE is maximum at the bottom of the swing 
                      when velocity is greatest, and zero at the turning points.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-5 rounded-lg border border-emerald-500/30">
                    <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                      Total Mechanical Energy
                    </h4>
                    <div className="text-xl text-white mb-3 text-center">
                      <MathText>E</MathText> = <MathText>PE</MathText> + <MathText>KE</MathText> = constant
                    </div>
                    <p className="text-sm leading-relaxed">
                      In the absence of dissipative forces, total energy remains constant throughout the motion. 
                      This is a manifestation of the <strong>law of conservation of energy</strong>.
                    </p>
                  </div>
                </div>
              </section>

              {/* Real Applications */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-500 rounded"></span>
                  Real-World Applications
                </h3>
                <div className="grid gap-3">
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-white mb-1">⏰ Precision Timekeeping</h4>
                    <p className="text-sm">
                      Before quartz and atomic clocks, pendulum clocks were the most accurate timekeeping devices. 
                      The predictable period made them essential for navigation and astronomy. Harrison's marine 
                      chronometer used pendulum principles to solve the longitude problem.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-white mb-1">🌊 Seismology</h4>
                    <p className="text-sm">
                      Seismometers use suspended masses (essentially pendulums) to detect ground motion during 
                      earthquakes. The inertia of the mass causes it to remain relatively stationary while the 
                      ground moves, allowing precise measurement of seismic waves.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-white mb-1">🎵 Music and Tempo</h4>
                    <p className="text-sm">
                      Mechanical metronomes use an inverted pendulum with adjustable weight to keep musical tempo. 
                      The period formula allows precise calibration of beats per minute.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-white mb-1">🌍 Measuring Gravity</h4>
                    <p className="text-sm">
                      Since <MathText>T</MathText> = 2π√
                      <span className="inline-flex items-center">
                        (<Fraction num={<MathText>L</MathText>} den={<MathText>g</MathText>} />)
                      </span>, measuring the 
                      period of a pendulum with known length allows calculation of local gravitational acceleration. 
                      This technique revealed that <MathText>g</MathText> varies slightly across Earth's surface.
                    </p>
                  </div>
                </div>
              </section>

              {/* Historical Notes */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded"></span>
                  Historical Insights
                </h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      <strong className="text-yellow-400">🔬 Galileo Galilei (1602):</strong> While attending 
                      church services in Pisa, Galileo noticed a swinging chandelier and timed its oscillations 
                      using his pulse. He discovered that the period was independent of amplitude—a property 
                      called <strong>isochronism</strong>. This observation laid groundwork for pendulum clocks.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      <strong className="text-blue-400">⚙️ Christiaan Huygens (1656):</strong> Built the first 
                      practical pendulum clock, improving timekeeping accuracy from 15 minutes per day to just 
                      15 seconds. He also derived the period formula and discovered that a cycloidal path 
                      (not circular) produces perfectly isochronous motion for all amplitudes.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      <strong className="text-purple-400">📐 Jean Bernard Léon Foucault (1851):</strong> Used a 
                      67-meter pendulum in the Panthéon in Paris to demonstrate Earth's rotation. The plane of 
                      oscillation appeared to rotate, but it was actually Earth rotating beneath the pendulum—
                      providing direct evidence of our planet's rotation.
                    </p>
                  </div>
                </div>
              </section>

              {/* Advanced Topics */}
              <section className="border-t border-slate-700 pt-6 pb-4">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded"></span>
                  Beyond Simple Harmonic Motion
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Large Angle Corrections</h4>
                    <p className="leading-relaxed mb-2">
                      For larger amplitudes, the period increases. The exact formula involves an elliptic integral:
                    </p>
                    <div className="bg-slate-900/70 p-3 rounded text-center text-white">
                      <MathText>T</MathText> = 4√(<MathText>L</MathText>/<MathText>g</MathText>) 
                      <span className="mx-1">K</span>(sin²(<MathText>θ</MathText>₀/2))
                    </div>
                    <p className="mt-2 text-slate-400">
                      Where K is the complete elliptic integral of the first kind, and <MathText>θ</MathText>₀ is 
                      the initial angle.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Damped Oscillations</h4>
                    <p className="leading-relaxed">
                      Real pendulums experience air resistance and friction at the pivot. These dissipative forces 
                      cause the amplitude to decay exponentially over time while slightly increasing the period.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Chaotic Double Pendulum</h4>
                    <p className="leading-relaxed">
                      When you attach a second pendulum to the bob of the first, the system becomes chaotic—
                      meaning tiny differences in initial conditions lead to vastly different outcomes. This 
                      demonstrates sensitive dependence on initial conditions.
                    </p>
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

export default function PendulumSimulation() {
  const [length, setLength] = useState(150);
  const [mass, setMass] = useState(2);
  const [angleDeg, setAngleDeg] = useState(45);
  const [omega, setOmega] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showEducational, setShowEducational] = useState(false);

  const lastTimeRef = useRef(Date.now());
  const animationFrameRef = useRef(null);

  const boxWidth = 640;
  const boxHeight = 400;
  const pivot = useMemo(() => ({ x: boxWidth / 2, y: 60 }), [boxWidth]);
  const g = 980;

  const thetaRad = (angleDeg * Math.PI) / 180;

  const toggleSimulation = () => {
    if (!isRunning) lastTimeRef.current = Date.now();
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setAngleDeg(45);
    setOmega(0);
    setIsRunning(false);
    lastTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      const now = Date.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const steps = 4;
      const smallDt = dt / steps;
      let currentTheta = (angleDeg * Math.PI) / 180;
      let currentOmega = omega;

      for (let i = 0; i < steps; i++) {
        const alpha = -(g / length) * Math.sin(currentTheta);
        currentOmega += alpha * smallDt;
        currentTheta += currentOmega * smallDt;
      }

      setAngleDeg((currentTheta * 180) / Math.PI);
      setOmega(currentOmega);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, length, angleDeg, omega]);

  const bobX = pivot.x + length * Math.sin(thetaRad);
  const bobY = pivot.y + length * Math.cos(thetaRad);
  const period = 2 * Math.PI * Math.sqrt(length / g);
  const height = length * (1 - Math.cos(thetaRad));
  const potentialEnergy = mass * (g / 100) * height;
  const kineticEnergy = 0.5 * mass * Math.pow(omega * length, 2);
  const totalEnergy = potentialEnergy + kineticEnergy;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Pendulum Studio</h2>
              <p className="text-slate-400 text-sm">
                Visualize simple harmonic motion and energy conversion in a pendulum.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="uppercase tracking-wide text-xs border-blue-500/30 text-blue-400">
                {isRunning ? "Running" : "Stopped"}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <svg
                width={boxWidth}
                height={boxHeight}
                viewBox={`0 0 ${boxWidth} ${boxHeight}`}
                className="w-full h-auto"
              >
                <defs>
                  <linearGradient id="bobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect
                  width={boxWidth}
                  height={boxHeight}
                  fill="rgba(15,23,42,0.4)"
                  rx="12"
                />

                <line
                  x1={pivot.x}
                  y1={pivot.y}
                  x2={pivot.x}
                  y2={pivot.y + length + 60}
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />

                <path
                  d={`M ${pivot.x} ${pivot.y + 80}
                      A 80 80 0 0 ${thetaRad > 0 ? 1 : 0}
                      ${pivot.x + 80 * Math.sin(thetaRad)}
                      ${pivot.y + 80 * Math.cos(thetaRad)}`}
                  fill="none"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  opacity="0.7"
                />

                <text
                  x={pivot.x + (thetaRad > 0 ? 45 : -45)}
                  y={pivot.y + 95}
                  textAnchor="middle"
                  fill="#38bdf8"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {formatNumber(Math.abs(angleDeg), 1)}°
                </text>

                <circle
                  cx={pivot.x}
                  cy={pivot.y}
                  r="8"
                  fill="#64748b"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                />

                <line
                  x1={pivot.x}
                  y1={pivot.y}
                  x2={bobX}
                  y2={bobY}
                  stroke="#a855f7"
                  strokeWidth="3"
                  filter="url(#glow)"
                />

                <circle
                  cx={bobX}
                  cy={bobY}
                  r={10 + mass * 2}
                  fill="url(#bobGradient)"
                  stroke="#a855f7"
                  strokeWidth="2"
                  filter="url(#glow)"
                />

                <text
                  x={bobX}
                  y={bobY + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {formatNumber(mass, 1)}
                </text>
              </svg>
            </motion.div>

            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Control
                label="Mass"
                value={mass}
                unit="kg"
                min={0.5}
                max={10}
                step={0.5}
                onChange={setMass}
                disabled={isRunning}
              />
              <Control
                label="Length"
                value={length}
                unit="px"
                min={50}
                max={280}
                step={5}
                onChange={setLength}
                disabled={isRunning}
              />
              <Control
                label="Initial Angle"
                value={angleDeg}
                unit="°"
                min={-90}
                max={90}
                step={1}
                onChange={setAngleDeg}
                disabled={isRunning}
              />

              <div className="mt-4 flex flex-col gap-3">
                <Button onClick={toggleSimulation} className="w-full">
                  {isRunning ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" onClick={reset} className="w-full">
                  Reset
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(angleDeg, 1)}°
              </div>
              <div className="text-xs text-slate-400">Angle</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(period, 2)}s
              </div>
              <div className="text-xs text-slate-400">Period</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(omega, 2)}
              </div>
              <div className="text-xs text-slate-400">Angular Velocity (rad/s)</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">
                {formatNumber(totalEnergy, 1)}
              </div>
              <div className="text-xs text-slate-400">Total Energy (J)</div>
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