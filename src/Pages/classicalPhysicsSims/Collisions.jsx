// Collisions.jsx
import { useState, useEffect, useRef, useCallback } from "react";
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

const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    outline: "border-slate-600 text-white"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

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
                <h2 className="text-2xl font-bold text-white">Physics of Collisions</h2>
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
                  What is a Collision?
                </h3>
                <p className="leading-relaxed mb-3">
                  A collision occurs when two or more objects exert forces on each other for a relatively 
                  short time. During this brief interaction, the objects exchange momentum and energy, 
                  resulting in changes to their velocities.
                </p>
                <p className="leading-relaxed text-slate-400 text-sm">
                  Collisions are everywhere in nature—from billiard balls on a pool table to subatomic 
                  particles in accelerators, from car crashes to molecular interactions in gases. 
                  Understanding collision physics is fundamental to engineering, safety design, and even 
                  understanding the behavior of matter itself.
                </p>
              </section>

              {/* Types of Collisions */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  Types of Collisions
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-3">Elastic Collisions</h4>
                    <p className="text-sm leading-relaxed mb-3">
                      In elastic collisions, both momentum <strong>and</strong> kinetic energy are conserved. 
                      No energy is lost to heat, sound, or deformation. This is an idealization that works 
                      well for hard objects like billiard balls or atomic particles.
                    </p>
                    <div className="bg-slate-900/50 p-3 rounded text-sm">
                      <p className="text-cyan-400 font-semibold mb-1">This simulation shows elastic collisions!</p>
                      <p>Notice how the total kinetic energy remains constant throughout all collisions.</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-5 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-semibold mb-3">Inelastic Collisions</h4>
                    <p className="text-sm leading-relaxed mb-3">
                      In inelastic collisions, momentum is conserved but kinetic energy is <strong>not</strong>. 
                      Some energy is converted to other forms like heat, sound, or permanent deformation.
                    </p>
                    <div className="bg-slate-900/50 p-3 rounded text-sm">
                      <p>Most real-world collisions are inelastic—car crashes, dropping a ball, objects sticking together.</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 p-5 rounded-lg border border-red-500/30">
                    <h4 className="text-red-400 font-semibold mb-3">Perfectly Inelastic Collisions</h4>
                    <p className="text-sm leading-relaxed">
                      The most inelastic case—objects stick together after collision, moving as one combined 
                      mass. Maximum kinetic energy is lost (while still conserving momentum).
                    </p>
                  </div>
                </div>
              </section>

              {/* Conservation Laws */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded"></span>
                  Conservation of Momentum
                </h3>
                <p className="leading-relaxed mb-4">
                  The law of conservation of momentum is fundamental to all collision analysis. In an isolated 
                  system (no external forces), total momentum before collision equals total momentum after.
                </p>
                
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 mb-4">
                  <h4 className="text-green-400 font-semibold mb-3">General Momentum Conservation</h4>
                  <div className="text-xl text-white mb-3 text-center">
                    <MathText>m</MathText>₁<MathText>v</MathText>₁ᵢ + <MathText>m</MathText>₂<MathText>v</MathText>₂ᵢ = <MathText>m</MathText>₁<MathText>v</MathText>₁f + <MathText>m</MathText>₂<MathText>v</MathText>₂f
                  </div>
                  <div className="text-sm space-y-1 bg-slate-900/50 p-3 rounded">
                    <p><MathText>m</MathText>₁, <MathText>m</MathText>₂ = masses of objects 1 and 2</p>
                    <p><MathText>v</MathText>ᵢ = initial velocity (before collision)</p>
                    <p><MathText>v</MathText>f = final velocity (after collision)</p>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-emerald-400">Important:</strong> Momentum is a <strong>vector</strong> 
                    quantity, so in 2D and 3D, conservation applies to each component (x, y, z) independently!
                  </p>
                </div>
              </section>

              {/* 1D Elastic Collision Formulas */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded"></span>
                  1D Elastic Collision Formulas
                </h3>
                <p className="leading-relaxed mb-4">
                  For elastic collisions in one dimension, we can derive formulas for final velocities by 
                  combining momentum and energy conservation equations.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-5 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-semibold mb-3">Object 1 Final Velocity</h4>
                    <div className="text-lg text-white mb-3 text-center">
                      <MathText>v</MathText>₁f = <Fraction num={<span>(<MathText>m</MathText>₁ − <MathText>m</MathText>₂)<MathText>v</MathText>₁ᵢ + 2<MathText>m</MathText>₂<MathText>v</MathText>₂ᵢ</span>} den={<span><MathText>m</MathText>₁ + <MathText>m</MathText>₂</span>} />
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-3">Object 2 Final Velocity</h4>
                    <div className="text-lg text-white mb-3 text-center">
                      <MathText>v</MathText>₂f = <Fraction num={<span>(<MathText>m</MathText>₂ − <MathText>m</MathText>₁)<MathText>v</MathText>₂ᵢ + 2<MathText>m</MathText>₁<MathText>v</MathText>₁ᵢ</span>} den={<span><MathText>m</MathText>₁ + <MathText>m</MathText>₂</span>} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">📊 Equal Masses:</strong>
                    <p className="mt-1">When <MathText>m</MathText>₁ = <MathText>m</MathText>₂, the objects 
                    simply exchange velocities! Try it in the simulation with equal masses.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">🏋️ Massive Object Hits Light Object:</strong>
                    <p className="mt-1">When <MathText>m</MathText>₁ ≫ <MathText>m</MathText>₂, the heavy object 
                    barely slows down while the light object shoots off at roughly twice the heavy object's speed.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-purple-400">🎾 Light Object Hits Massive Object:</strong>
                    <p className="mt-1">When <MathText>m</MathText>₁ ≪ <MathText>m</MathText>₂, the light object 
                    bounces back while the massive object barely moves—like a tennis ball bouncing off a wall.</p>
                  </div>
                </div>
              </section>

              {/* 2D Collisions */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-500 rounded"></span>
                  2D Elastic Collisions
                </h3>
                <p className="leading-relaxed mb-4">
                  Two-dimensional collisions are more complex because we must conserve momentum in both 
                  x and y directions simultaneously. The collision normal (line connecting centers) determines 
                  the direction of force transfer.
                </p>
                
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 mb-4">
                  <h4 className="text-orange-400 font-semibold mb-3">Component-wise Conservation</h4>
                  <div className="space-y-2 text-base text-white">
                    <div className="text-center">
                      <strong>X-direction:</strong>
                      <div className="mt-1">
                        <MathText>m</MathText>₁<MathText>v</MathText>₁ₓᵢ + <MathText>m</MathText>₂<MathText>v</MathText>₂ₓᵢ = <MathText>m</MathText>₁<MathText>v</MathText>₁ₓf + <MathText>m</MathText>₂<MathText>v</MathText>₂ₓf
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <strong>Y-direction:</strong>
                      <div className="mt-1">
                        <MathText>m</MathText>₁<MathText>v</MathText>₁ᵧᵢ + <MathText>m</MathText>₂<MathText>v</MathText>₂ᵧᵢ = <MathText>m</MathText>₁<MathText>v</MathText>₁ᵧf + <MathText>m</MathText>₂<MathText>v</MathText>₂ᵧf
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-5 rounded-lg border border-orange-500/30">
                  <h4 className="text-orange-400 font-semibold mb-3">Collision Normal Method</h4>
                  <p className="text-sm leading-relaxed mb-3">
                    The simulation uses the collision normal method:
                  </p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Find the line connecting the centers of the two objects (the normal vector)</li>
                    <li>Project velocities onto this normal direction</li>
                    <li>Apply 1D collision formulas along the normal</li>
                    <li>Keep tangential components unchanged (no friction)</li>
                    <li>Combine normal and tangential components for final velocities</li>
                  </ol>
                </div>
              </section>

              {/* Energy in Elastic Collisions */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-pink-500 rounded"></span>
                  Conservation of Kinetic Energy
                </h3>
                <p className="leading-relaxed mb-4">
                  In elastic collisions, kinetic energy is conserved. This is what makes elastic collisions 
                  special—they're perfectly efficient with no energy loss.
                </p>
                
                <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-5 rounded-lg border border-pink-500/30 mb-4">
                  <div className="text-xl text-white mb-3 text-center">
                    <Fraction num="1" den="2" /><MathText>m</MathText>₁<MathText>v</MathText>₁ᵢ² + <Fraction num="1" den="2" /><MathText>m</MathText>₂<MathText>v</MathText>₂ᵢ² = <Fraction num="1" den="2" /><MathText>m</MathText>₁<MathText>v</MathText>₁f² + <Fraction num="1" den="2" /><MathText>m</MathText>₂<MathText>v</MathText>₂f²
                  </div>
                  <p className="text-sm text-center">
                    Total kinetic energy before = Total kinetic energy after
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-pink-400">⚡ Energy Transfer:</strong>
                    <p className="mt-1">While total KE is conserved, individual objects exchange energy. 
                    Maximum energy transfer occurs when a moving object hits a stationary object of equal mass.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-pink-400">🔄 Watch the Display:</strong>
                    <p className="mt-1">The simulation shows individual and total kinetic energies. Notice how 
                    they redistribute during collisions while the sum stays constant!</p>
                  </div>
                </div>
              </section>

              {/* Coefficient of Restitution */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded"></span>
                  Coefficient of Restitution
                </h3>
                <p className="leading-relaxed mb-4">
                  The coefficient of restitution (<MathText>e</MathText>) measures how "bouncy" a collision is. 
                  It's the ratio of relative velocities after and before collision.
                </p>
                
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-5 rounded-lg border border-cyan-500/30 mb-4">
                  <div className="text-xl text-white mb-3 text-center">
                    <MathText>e</MathText> = <Fraction num={<span>|<MathText>v</MathText>₂f − <MathText>v</MathText>₁f|</span>} den={<span>|<MathText>v</MathText>₁ᵢ − <MathText>v</MathText>₂ᵢ|</span>} />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400"><MathText>e</MathText> = 1 (Elastic):</strong>
                    <p className="mt-1">Perfect bounce—no energy lost. This is what our simulation shows!</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400">0 &lt; <MathText>e</MathText> &lt; 1 (Inelastic):</strong>
                    <p className="mt-1">Partial bounce—some energy lost. Most real collisions fall here. 
                    Basketballs ≈ 0.8, tennis balls ≈ 0.7, steel on steel ≈ 0.9.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400"><MathText>e</MathText> = 0 (Perfectly Inelastic):</strong>
                    <p className="mt-1">No bounce—objects stick together. Clay, putty, or car crashes.</p>
                  </div>
                </div>
              </section>

              {/* Real Applications */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-500 rounded"></span>
                  Real-World Applications
                </h3>
                <div className="grid gap-3">
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">🚗 Vehicle Safety</h4>
                    <p className="text-sm">
                      Crumple zones in cars are designed to make collisions more inelastic, converting kinetic 
                      energy into deformation rather than transferring it to passengers. Airbags extend collision 
                      time, reducing peak forces (impulse = force × time).
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">🎱 Billiards & Pool</h4>
                    <p className="text-sm">
                      Professional pool players intuitively understand elastic collisions. The angles after 
                      collision depend on where the cue ball strikes—hitting dead center transfers maximum 
                      momentum, while glancing blows create complex angle shots.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">⚛️ Particle Physics</h4>
                    <p className="text-sm">
                      Particle accelerators smash particles together at near-light speeds. By analyzing the 
                      collision products using momentum and energy conservation, physicists discover new particles 
                      and fundamental forces. The Higgs boson was found this way!
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">🌡️ Gas Molecules</h4>
                    <p className="text-sm">
                      Gas pressure arises from countless molecular collisions with container walls. The kinetic 
                      theory of gases treats molecules as elastic spheres undergoing constant collisions—the 
                      foundation of thermodynamics.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">⚾ Sports</h4>
                    <p className="text-sm">
                      Baseball bats, tennis rackets, and golf clubs are optimized for coefficient of restitution. 
                      The "sweet spot" on a bat maximizes energy transfer to the ball while minimizing vibration 
                      in the handle.
                    </p>
                  </div>
                </div>
              </section>

              {/* Advanced Topics */}
              <section className="border-t border-slate-700 pt-6 pb-4">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded"></span>
                  Beyond Simple Collisions
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Rotational Effects</h4>
                    <p className="leading-relaxed">
                      Real objects rotate during collisions. A cue ball with spin transfers angular momentum 
                      to the target ball. This adds complexity—we must conserve both linear and angular momentum.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Relativistic Collisions</h4>
                    <p className="leading-relaxed">
                      At speeds approaching light speed, classical momentum formulas fail. Relativistic momentum 
                      is <MathText>p</MathText> = γ<MathText>mv</MathText> where γ increases dramatically near light speed. 
                      Particle accelerators must account for this!
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Friction and Spin</h4>
                    <p className="leading-relaxed">
                      This simulation assumes frictionless collisions. Real collisions involve friction at contact 
                      points, which creates spin and tangential force components. This is why billiard balls can 
                      curve after collision.
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

export default function Collisions() {
  const [mode, setMode] = useState("2D");
  const [isRunning, setIsRunning] = useState(false);
  const [collisions, setCollisions] = useState(0);
  const [showEducational, setShowEducational] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Collision Studio</h2>
              <p className="text-slate-400 text-sm">
                Visualize 1D and 2D elastic collisions with draggable velocity vectors.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
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

            {/* Controls */}
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

      <EducationalSidebar 
        isOpen={showEducational} 
        onClose={() => setShowEducational(false)} 
      />
    </div>
  );
}