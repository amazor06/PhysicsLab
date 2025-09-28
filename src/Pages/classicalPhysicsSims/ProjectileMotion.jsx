import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Card } from "../../components/ui.jsx";

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

export default function ProjectileMotionSimulation() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const animationRef = useRef();
  const lastFrameTimeRef = useRef();

  // Physics calculations
  const physics = useMemo(() => {
    const radians = (settings.angle * Math.PI) / 180;
    const v0x = settings.speed * Math.cos(radians);
    const v0y = settings.speed * Math.sin(radians);
    
    // Calculate flight time using quadratic formula: h + v0y*t - 0.5*g*t^2 = 0
    // Rearranged: 0.5*g*t^2 - v0y*t - h = 0
    const discriminant = v0y * v0y + 2 * settings.gravity * settings.height;
    const flightTime = discriminant >= 0 ? (v0y + Math.sqrt(discriminant)) / settings.gravity : 0;
    
    // Maximum height occurs when vertical velocity = 0: t = v0y / g
    const timeToApex = v0y / settings.gravity;
    const maxHeight = settings.height + (v0y * v0y) / (2 * settings.gravity);
    
    // Range calculation
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
  
  // Create fixed coordinate system that doesn't change with parameters
  // Base the scale on reasonable maximums, not current trajectory
  const maxDisplayX = 150; // Fixed max range for display
  const maxDisplayY = 80;  // Fixed max height for display
  
  const scaleX = (viewWidth - padding * 2) / maxDisplayX;
  const scaleY = (viewHeight - padding * 2) / maxDisplayY;

  // Convert world coordinates to SVG coordinates
  const worldToSvg = useCallback((x, y) => ({
    x: padding + x * scaleX,
    y: viewHeight - padding - y * scaleY
  }), [scaleX, scaleY]);

  // Building position - ALWAYS at the same visual location
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

  // Animation speed factor - higher speeds should animate faster
  // Base speed on actual physics: distance/time ratio
  const animationSpeedMultiplier = useMemo(() => {
    // Use a reasonable base speed reference
    const baseSpeed = 20; // m/s reference
    return Math.max(0.5, Math.min(3.0, settings.speed / baseSpeed));
  }, [settings.speed]);

  // Animation loop with speed-adjusted timing
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastFrameTimeRef.current) / 1000; // Convert to seconds
      lastFrameTimeRef.current = timestamp;
      
      setTime(currentTime => {
        // Apply speed multiplier to make faster projectiles animate faster
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

  // Aiming arrow - always starts from building top
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
    <Card className="bg-slate-900/80 border border-blue-500/20 shadow-xl">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Projectile Motion Studio</h2>
            <p className="text-slate-400 text-sm">
              Physically accurate projectile motion simulation
            </p>
          </div>
          <Badge variant="outline" className="uppercase tracking-wide text-xs">
            {isPlaying ? "In Flight" : hasLaunched ? "Paused" : "Ready"}
          </Badge>
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

                {/* Building - always at same visual position */}
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

                {/* Projectile - only show if in bounds */}
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
  );
}