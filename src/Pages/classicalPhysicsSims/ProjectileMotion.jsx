import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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

const DEFAULT_SETTINGS = {
  speed: 25,
  angle: 45,
  height: 5,
  gravity: 9.81,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatNumber = (value, digits = 2) =>
  Number.isFinite(value) ? value.toFixed(digits) : "0.00";

const Control = ({ label, value, unit, min, max, step, onChange }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span>{label}</span>
      <span className="font-semibold text-white">
        {formatNumber(value, 1)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
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
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-right text-white"
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
                <h2 className="text-2xl font-bold text-white">Physics of Projectile Motion</h2>
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
                  What is Projectile Motion?
                </h3>
                <p className="leading-relaxed mb-3">
                  Projectile motion is the motion of an object thrown or projected into the air, subject only 
                  to the acceleration of gravity. The object is called a projectile, and its path is called 
                  its trajectory.
                </p>
                <p className="leading-relaxed text-slate-400 text-sm">
                  This type of motion is two-dimensional and combines horizontal motion at constant velocity 
                  with vertical motion under constant acceleration. It's one of the most important topics in 
                  classical mechanics with countless real-world applications.
                </p>
              </section>

              {/* Key Concepts */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-blue-500 rounded"></span>
                  Independence of Motion
                </h3>
                <p className="leading-relaxed mb-4">
                  The most crucial principle in projectile motion is that horizontal and vertical motions 
                  are independent of each other. They occur simultaneously but don't affect one another.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Horizontal Motion</h4>
                    <div className="text-lg text-white mb-2">
                      <MathText>x</MathText> = <MathText>v</MathText>₀ₓ<MathText>t</MathText>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Horizontal velocity remains constant (no acceleration in the x-direction when air 
                      resistance is neglected). The horizontal distance increases linearly with time.
                    </p>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                    <h4 className="text-purple-400 font-semibold mb-2">Vertical Motion</h4>
                    <div className="text-lg text-white mb-2">
                      <MathText>y</MathText> = <MathText>h</MathText>₀ + <MathText>v</MathText>₀ᵧ<MathText>t</MathText> − <Fraction num="1" den="2" /><MathText>gt</MathText>²
                    </div>
                    <p className="text-sm leading-relaxed">
                      Vertical motion follows the same rules as free fall. Gravity constantly accelerates 
                      the projectile downward at <MathText>g</MathText> ≈ 9.81 m/s².
                    </p>
                  </div>
                </div>
              </section>

              {/* Velocity Components */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-500 rounded"></span>
                  Breaking Down Initial Velocity
                </h3>
                <p className="leading-relaxed mb-4">
                  When a projectile is launched at an angle <MathText>θ</MathText>, we must decompose the 
                  initial velocity into horizontal and vertical components using trigonometry.
                </p>
                
                <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 mb-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2">Horizontal Component</h4>
                      <div className="text-xl text-white">
                        <MathText>v</MathText>₀ₓ = <MathText>v</MathText>₀ cos <MathText>θ</MathText>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-green-400 font-semibold mb-2">Vertical Component</h4>
                      <div className="text-xl text-white">
                        <MathText>v</MathText>₀ᵧ = <MathText>v</MathText>₀ sin <MathText>θ</MathText>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-900/50 rounded text-sm">
                    <p><MathText>v</MathText>₀ = initial speed (magnitude)</p>
                    <p><MathText>θ</MathText> = launch angle from horizontal</p>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    <strong className="text-amber-400">Important:</strong> The launch angle dramatically 
                    affects the trajectory. At 45°, the components are equal, giving maximum range on level 
                    ground. Lower angles prioritize distance, higher angles prioritize height.
                  </p>
                </div>
              </section>

              {/* Key Formulas */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-purple-500 rounded"></span>
                  Essential Formulas
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-5 rounded-lg border border-purple-500/30">
                    <h4 className="text-purple-400 font-semibold mb-3">Time of Flight</h4>
                    <div className="text-2xl text-white mb-3 text-center">
                      <MathText>t</MathText> = <Fraction num={<span><MathText>v</MathText>₀ᵧ + √(<MathText>v</MathText>₀ᵧ² + 2<MathText>gh</MathText>₀)</span>} den={<MathText>g</MathText>} />
                    </div>
                    <p className="text-sm leading-relaxed">
                      Total time the projectile is in the air, accounting for initial height. Derived from 
                      the quadratic formula applied to the vertical position equation.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-3">Maximum Height</h4>
                    <div className="text-2xl text-white mb-3 text-center">
                      <MathText>H</MathText> = <MathText>h</MathText>₀ + <Fraction num={<span><MathText>v</MathText>₀ᵧ²</span>} den="2g" />
                    </div>
                    <p className="text-sm leading-relaxed">
                      The highest point reached occurs when vertical velocity becomes zero. At this point, 
                      all the initial vertical kinetic energy has converted to potential energy.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-5 rounded-lg border border-pink-500/30">
                    <h4 className="text-pink-400 font-semibold mb-3">Range</h4>
                    <div className="text-2xl text-white mb-3 text-center">
                      <MathText>R</MathText> = <MathText>v</MathText>₀ₓ × <MathText>t</MathText>
                    </div>
                    <p className="text-sm leading-relaxed">
                      Horizontal distance traveled. Simply the constant horizontal velocity multiplied by 
                      the time of flight. For level ground from height zero: <MathText>R</MathText> = <MathText>v</MathText>₀² sin(2<MathText>θ</MathText>) / <MathText>g</MathText>
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-5 rounded-lg border border-emerald-500/30">
                    <h4 className="text-emerald-400 font-semibold mb-3">Time to Maximum Height</h4>
                    <div className="text-2xl text-white mb-3 text-center">
                      <MathText>t</MathText>ₘₐₓ = <Fraction num={<MathText>v</MathText>/*add oy here*/} den={<MathText>g</MathText>} />
                    </div>
                    <p className="text-sm leading-relaxed">
                      Time when the projectile reaches its apex. At this moment, vertical velocity is zero, 
                      but horizontal velocity remains constant.
                    </p>
                  </div>
                </div>
              </section>

              {/* Trajectory Equation */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-orange-500 rounded"></span>
                  The Trajectory Equation
                </h3>
                <p className="leading-relaxed mb-4">
                  By eliminating time from the position equations, we can express <MathText>y</MathText> as 
                  a function of <MathText>x</MathText>, revealing the parabolic path.
                </p>
                
                <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 p-5 rounded-lg border border-orange-500/30 mb-4">
                  <div className="text-xl text-white mb-3 text-center">
                    <MathText>y</MathText> = <MathText>h</MathText>₀ + <MathText>x</MathText> tan <MathText>θ</MathText> − <Fraction num={<span><MathText>gx</MathText>²</span>} den={<span>2<MathText>v</MathText>₀² cos²<MathText>θ</MathText></span>} />
                  </div>
                  <p className="text-sm text-center leading-relaxed">
                    This is the equation of a parabola opening downward
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-orange-400">📐 Always a Parabola:</strong>
                    <p className="mt-1">Regardless of launch angle or speed, the trajectory is always parabolic 
                    (when air resistance is negligible).</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-orange-400">🎯 Symmetry:</strong>
                    <p className="mt-1">For level ground, the path is symmetric about the maximum height point. 
                    Time up equals time down.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-orange-400">⚡ Speed at Landing:</strong>
                    <p className="mt-1">When landing at the same height as launch, the speed equals the launch 
                    speed (but direction differs).</p>
                  </div>
                </div>
              </section>

              {/* Energy Analysis */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-pink-500 rounded"></span>
                  Energy in Projectile Motion
                </h3>
                <p className="leading-relaxed mb-4">
                  Throughout the flight, mechanical energy is conserved (ignoring air resistance). Energy 
                  continuously transforms between kinetic and potential forms.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-5 rounded-lg border border-blue-500/30">
                    <h4 className="text-blue-400 font-semibold mb-3">Kinetic Energy</h4>
                    <div className="text-xl text-white mb-3">
                      <MathText>KE</MathText> = <Fraction num="1" den="2" /><MathText>m</MathText>(<MathText>v</MathText>ₓ² + <MathText>v</MathText>ᵧ²)
                    </div>
                    <p className="text-sm leading-relaxed">
                      Note that horizontal velocity stays constant, but vertical velocity changes continuously. 
                      Total KE is minimum at the apex (only horizontal component remains).
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-5 rounded-lg border border-pink-500/30">
                    <h4 className="text-pink-400 font-semibold mb-3">Potential Energy</h4>
                    <div className="text-xl text-white mb-3">
                      <MathText>PE</MathText> = <MathText>mgy</MathText>
                    </div>
                    <p className="text-sm leading-relaxed">
                      PE increases as the projectile rises and decreases as it falls. Maximum at the apex, 
                      minimum at the lowest point.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-5 rounded-lg border border-emerald-500/30">
                    <h4 className="text-emerald-400 font-semibold mb-3">Conservation</h4>
                    <div className="text-xl text-white mb-3">
                      <MathText>E</MathText>ₜₒₜₐₗ = <MathText>KE</MathText> + <MathText>PE</MathText> = constant
                    </div>
                    <p className="text-sm leading-relaxed">
                      Total mechanical energy remains constant throughout the motion, demonstrating energy 
                      conservation in an ideal system.
                    </p>
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
                    <h4 className="font-semibold text-white mb-1">🏀 Sports</h4>
                    <p className="text-sm">
                      Basketball free throws, soccer goals, golf shots, and baseball pitches all follow 
                      projectile motion. Athletes intuitively calculate angles and forces to achieve desired 
                      trajectories.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">🚀 Ballistics & Rocketry</h4>
                    <p className="text-sm">
                      Artillery shells, missiles, and even spacecraft trajectories during launch phases 
                      follow projectile motion principles. Military and aerospace engineers use these 
                      equations for precise targeting.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">💧 Water Features</h4>
                    <p className="text-sm">
                      Fountains and water jets are designed using projectile motion calculations to create 
                      specific arcs and patterns. The parabolic paths create aesthetically pleasing designs.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-white mb-1">🚁 Emergency Drops</h4>
                    <p className="text-sm">
                      Firefighting aircraft dropping water and humanitarian aid drops from planes must 
                      account for projectile motion to hit target zones accurately.
                    </p>
                  </div>
                </div>
              </section>

              {/* Optimal Angle */}
              <section className="border-t border-slate-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-cyan-500 rounded"></span>
                  The Magic of 45 Degrees
                </h3>
                <p className="leading-relaxed mb-4">
                  For maximum range on level ground, the optimal launch angle is 45°. This angle perfectly 
                  balances horizontal distance and time aloft.
                </p>
                
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-5 rounded-lg border border-cyan-500/30 mb-4">
                  <div className="text-2xl text-white mb-3 text-center">
                    <MathText>R</MathText>ₘₐₓ = <Fraction num={<span><MathText>v</MathText>₀²</span>} den={<MathText>g</MathText>} /> when <MathText>θ</MathText> = 45°
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400">📊 Complementary Angles:</strong>
                    <p className="mt-1">Launch angles of (45° + <MathText>α</MathText>) and (45° − <MathText>α</MathText>) 
                    produce the same range but different trajectories. For example, 30° and 60° give equal ranges.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400">🏔️ Elevation Effects:</strong>
                    <p className="mt-1">When launching from or landing on elevated positions, the optimal angle 
                    shifts from 45°. Uphill launches need higher angles; downhill launches need lower angles.</p>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg">
                    <strong className="text-cyan-400">🌬️ Real World Complications:</strong>
                    <p className="mt-1">Air resistance reduces optimal angle to around 35-40° for most real 
                    projectiles. This is why long jumpers, shot putters, and javelin throwers use these angles.</p>
                  </div>
                </div>
              </section>

              {/* Advanced Topics */}
              <section className="border-t border-slate-700 pt-6 pb-4">
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-500 rounded"></span>
                  Beyond Ideal Conditions
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Air Resistance</h4>
                    <p className="leading-relaxed">
                      In reality, air resistance (drag) significantly affects trajectories. It's proportional 
                      to velocity squared, making equations much more complex. Trajectories become asymmetric 
                      with steeper descent angles.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Magnus Effect</h4>
                    <p className="leading-relaxed">
                      Spinning projectiles experience a force perpendicular to their motion. This causes 
                      curveballs in baseball, slice and hook in golf, and swerve in soccer. The rotation 
                      creates pressure differences in the surrounding air.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-400 mb-2">Variable Gravity</h4>
                    <p className="leading-relaxed">
                      On other planets or at extreme altitudes, gravity differs from Earth's 9.81 m/s². 
                      The Moon's gravity (1.62 m/s²) allows projectiles to travel six times farther with 
                      the same initial conditions!
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

export default function ProjectileMotionSimulation() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [showEducational, setShowEducational] = useState(false);
  const animationRef = useRef();
  const lastFrameTimeRef = useRef();

  // Physics calculations
  const physics = useMemo(() => {
    const radians = (settings.angle * Math.PI) / 180;
    const v0x = settings.speed * Math.cos(radians);
    const v0y = settings.speed * Math.sin(radians);
    
    const discriminant = v0y * v0y + 2 * settings.gravity * settings.height;
    const flightTime = discriminant >= 0 ? (v0y + Math.sqrt(discriminant)) / settings.gravity : 0;
    
    const timeToApex = v0y / settings.gravity;
    const maxHeight = settings.height + (v0y * v0y) / (2 * settings.gravity);
    
    const range = v0x * flightTime;
    
    return {
      v0x,
      v0y,
      flightTime,
      timeToApex,
      maxHeight,
      range,
      radians
    };
  }, [settings.speed, settings.angle, settings.height, settings.gravity]);

  // Position calculation function
  const getPosition = useCallback((t) => {
    const x = physics.v0x * t;
    const y = Math.max(0, settings.height + physics.v0y * t - 0.5 * settings.gravity * t * t);
    
    return { x, y };
  }, [physics.v0x, physics.v0y, settings.height, settings.gravity]);

  // Generate trajectory points for visualization
  const trajectoryPoints = useMemo(() => {
    if (physics.flightTime <= 0) return [];
    
    const points = [];
    const numPoints = 100;
    
    for (let i = 0; i <= numPoints; i++) {
      const t = (physics.flightTime * i) / numPoints;
      const pos = getPosition(t);
      points.push(pos);
    }
    
    return points;
  }, [physics.flightTime, getPosition]);

  // Fixed SVG dimensions and scaling
  const viewWidth = 640;
  const viewHeight = 360;
  const padding = 40;
  
  const maxDisplayX = 150;
  const maxDisplayY = 80;
  
  const scaleX = (viewWidth - padding * 2) / maxDisplayX;
  const scaleY = (viewHeight - padding * 2) / maxDisplayY;

  // Convert world coordinates to SVG coordinates
  const worldToSvg = useCallback((x, y) => ({
    x: padding + x * scaleX,
    y: viewHeight - padding - y * scaleY
  }), [scaleX, scaleY]);

  // Building position
  const buildingBase = worldToSvg(0, 0);
  const buildingTop = worldToSvg(0, settings.height);
  const buildingWidth = 30;

  // Current projectile position
  const currentPosition = useMemo(() => {
    if (!hasLaunched) {
      return { x: 0, y: settings.height };
    }
    
    const clampedTime = Math.min(time, physics.flightTime);
    return getPosition(clampedTime);
  }, [hasLaunched, time, physics.flightTime, getPosition, settings.height]);

  const svgPosition = worldToSvg(currentPosition.x, currentPosition.y);

  // Animation speed factor
  const animationSpeedMultiplier = useMemo(() => {
    const baseSpeed = 20;
    return Math.max(0.5, Math.min(3.0, settings.speed / baseSpeed));
  }, [settings.speed]);

  // Animation loop with speed-adjusted timing
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = timestamp;
      
      setTime(currentTime => {
        const newTime = currentTime + (deltaTime * animationSpeedMultiplier);
        
        if (newTime >= physics.flightTime) {
          setIsPlaying(false);
          return physics.flightTime;
        }
        
        return newTime;
      });
      
      if (time < physics.flightTime) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, physics.flightTime, time, animationSpeedMultiplier]);

  // Launch function
  const launch = () => {
    setTime(0);
    setHasLaunched(true);
    setIsPlaying(true);
    lastFrameTimeRef.current = null;
  };

  // Reset function
  const reset = () => {
    setTime(0);
    setHasLaunched(false);
    setIsPlaying(false);
    lastFrameTimeRef.current = null;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Toggle pause/resume
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      lastFrameTimeRef.current = null;
    }
  };

  // Generate SVG path for trajectory
  const trajectoryPath = useMemo(() => {
    if (trajectoryPoints.length === 0) return "";
    
    return trajectoryPoints
      .map((point, index) => {
        const svgPoint = worldToSvg(point.x, point.y);
        return `${index === 0 ? 'M' : 'L'} ${svgPoint.x.toFixed(2)} ${svgPoint.y.toFixed(2)}`;
      })
      .join(' ');
  }, [trajectoryPoints, worldToSvg]);

  // Aiming arrow
  const aimingArrow = useMemo(() => {
    const startSvg = buildingTop;
    const arrowLength = 50;
    const endX = startSvg.x + arrowLength * Math.cos(physics.radians);
    const endY = startSvg.y - arrowLength * Math.sin(physics.radians);
    
    return { start: startSvg, end: { x: endX, y: endY } };
  }, [buildingTop, physics.radians]);

  // Show trajectory only if it fits in view
  const trajectoryVisible = physics.range <= maxDisplayX && physics.maxHeight <= maxDisplayY;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Projectile Motion Studio</h2>
              <p className="text-slate-400 text-sm">
                Physically accurate projectile motion simulation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="uppercase tracking-wide text-xs">
                {isPlaying ? "In Flight" : hasLaunched ? "Paused" : "Ready"}
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
              <div className="relative">
                <svg
                  viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                  role="img"
                  aria-label="Projectile motion trajectory"
                  className="h-[320px] w-full"
                >
                  <defs>
                    <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                    </linearGradient>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="6"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="white" />
                    </marker>
                  </defs>

                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Axes */}
                  <line
                    x1={padding}
                    y1={viewHeight - padding}
                    x2={viewWidth - padding}
                    y2={viewHeight - padding}
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                  <line
                    x1={padding}
                    y1={padding}
                    x2={padding}
                    y2={viewHeight - padding}
                    stroke="#64748b"
                    strokeWidth="2"
                  />

                  {/* Axis labels */}
                  <text x={viewWidth - 60} y={viewHeight - padding + 15} className="fill-slate-400 text-xs">
                    Distance (m)
                  </text>
                  <text x={padding - 30} y={padding - 5} className="fill-slate-400 text-xs" transform={`rotate(-90, ${padding - 30}, ${padding - 5})`}>
                    Height (m)
                  </text>

                  {/* Scale markers */}
                  {[0, 25, 50, 75, 100, 125, 150].map(dist => {
                    const x = padding + (dist * scaleX);
                    if (x < viewWidth - padding) {
                      return (
                        <g key={dist}>
                          <line x1={x} y1={viewHeight - padding - 3} x2={x} y2={viewHeight - padding + 3} stroke="#64748b" strokeWidth="1" />
                          <text x={x} y={viewHeight - padding + 15} className="fill-slate-400 text-xs" textAnchor="middle">{dist}</text>
                        </g>
                      );
                    }
                    return null;
                  })}

                  {[0, 10, 20, 30, 40, 50, 60, 70].map(height => {
                    const y = viewHeight - padding - (height * scaleY);
                    if (y > padding) {
                      return (
                        <g key={height}>
                          <line x1={padding - 3} y1={y} x2={padding + 3} y2={y} stroke="#64748b" strokeWidth="1" />
                          <text x={padding - 8} y={y + 3} className="fill-slate-400 text-xs" textAnchor="end">{height}</text>
                        </g>
                      );
                    }
                    return null;
                  })}

                  {/* Building */}
                  <rect
                    x={buildingBase.x - buildingWidth/2}
                    y={buildingTop.y}
                    width={buildingWidth}
                    height={buildingBase.y - buildingTop.y}
                    fill="#475569"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />

                  {/* Ground line */}
                  <line
                    x1={padding}
                    y1={buildingBase.y}
                    x2={viewWidth - padding}
                    y2={buildingBase.y}
                    stroke="#374151"
                    strokeWidth="2"
                  />

                  {/* Trajectory path */}
                  {hasLaunched && trajectoryPath && trajectoryVisible && (
                    <path
                      d={trajectoryPath}
                      fill="none"
                      stroke="url(#trajectoryGradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  )}

                  {/* Trajectory out of bounds warning */}
                  {hasLaunched && !trajectoryVisible && (
                    <text x={viewWidth/2} y={viewHeight/2} className="fill-yellow-400 text-sm" textAnchor="middle">
                      Trajectory extends beyond view
                    </text>
                  )}

                  {/* Aiming line (before launch) */}
                  {!hasLaunched && (
                    <line
                      x1={aimingArrow.start.x}
                      y1={aimingArrow.start.y}
                      x2={aimingArrow.end.x}
                      y2={aimingArrow.end.y}
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="4,2"
                      markerEnd="url(#arrowhead)"
                      opacity="0.8"
                    />
                  )}

                  {/* Projectile */}
                  {(svgPosition.x >= padding && svgPosition.x <= viewWidth - padding && 
                    svgPosition.y >= padding && svgPosition.y <= viewHeight - padding) && (
                    <circle
                      cx={svgPosition.x}
                      cy={svgPosition.y}
                      r="6"
                      fill="#38bdf8"
                      stroke="#0ea5e9"
                      strokeWidth="2"
                    />
                  )}

                  {/* Info overlay */}
                  <text x={padding + 5} y={padding + 15} className="fill-slate-300 text-xs font-mono">
                    Time: {formatNumber(time, 2)}s / {formatNumber(physics.flightTime, 2)}s
                  </text>
                  
                  {hasLaunched && (
                    <text x={padding + 5} y={padding + 30} className="fill-slate-300 text-xs font-mono">
                      Position: ({formatNumber(currentPosition.x, 1)}m, {formatNumber(currentPosition.y, 1)}m)
                    </text>
                  )}
                </svg>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-5 rounded-2xl border border-slate-700/40 bg-slate-950/60 p-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Control
                label="Initial Speed"
                value={settings.speed}
                unit="m/s"
                min={1}
                max={100}
                step={0.5}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, speed: clamp(value, 1, 100) }))
                }
              />
              <Control
                label="Launch Angle"
                value={settings.angle}
                unit="°"
                min={0}
                max={90}
                step={1}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, angle: clamp(value, 0, 90) }))
                }
              />
              <Control
                label="Building Height"
                value={settings.height}
                unit="m"
                min={0}
                max={50}
                step={0.5}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, height: clamp(value, 0, 50) }))
                }
              />
              <Control
                label="Gravity"
                value={settings.gravity}
                unit="m/s²"
                min={0.1}
                max={25}
                step={0.1}
                onChange={(value) =>
                  setSettings((prev) => ({ ...prev, gravity: clamp(value, 0.1, 25) }))
                }
              />

              <div className="mt-4 flex flex-col gap-3">
                {!hasLaunched ? (
                  <Button onClick={launch} className="w-full">
                    Launch Projectile
                  </Button>
                ) : (
                  <Button onClick={togglePlayPause} className="w-full">
                    {isPlaying ? "Pause" : "Resume"}
                  </Button>
                )}
                <Button variant="outline" onClick={reset} className="w-full">
                  Reset Simulation
                </Button>
              </div>

              {/* Speed indicator */}
              <div className="mt-2 p-2 rounded border border-slate-700 bg-slate-800">
                <div className="text-xs text-slate-400 mb-1">Animation Speed</div>
                <div className="text-sm text-white">
                  {(animationSpeedMultiplier * 100).toFixed(0)}% of real-time
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-700/40 bg-slate-950/40 p-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-white">{formatNumber(physics.flightTime, 2)}s</div>
              <div className="text-xs text-slate-400">Flight Time</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{formatNumber(physics.range, 1)}m</div>
              <div className="text-xs text-slate-400">Range</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{formatNumber(physics.maxHeight, 1)}m</div>
              <div className="text-xs text-slate-400">Max Height</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-white">{formatNumber(physics.timeToApex, 2)}s</div>
              <div className="text-xs text-slate-400">Time to Peak</div>
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