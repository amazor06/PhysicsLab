import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * PhysicsLab — Balance Beam Game
 *
 * Goal:
 *   Place/drag masses on a beam to achieve rotational equilibrium (net torque ≈ 0).
 *   When |net torque| is within tolerance, you score a point.
 *
 * Visuals:
 *   Canvas (800x450), dark theme compatible. Beam rotates about a central pivot.
 *   Masses are draggable discs that sit on the beam. You can add 1/2/5 kg masses by clicking the beam.
 *
 * Controls:
 *   - Choose mass size (1, 2, 5 kg)
 *   - Add mass: click on the beam to drop the selected mass at that location
 *   - Drag existing masses to new positions
 *   - Reset board / New challenge (spawns a random fixed mass and asks you to balance)
 *
 * Notes:
 *   - Designed as a single drop-in component for PhysicsLab Games Hub.
 *   - No external styling required; Tailwind-compatible wrapper classes included.
 */

export default function BalanceBeamGame() {
  // Canvas refs
  const canvasRef = useRef(null);
  const rafRef = useRef();

  // World / drawing settings
  const width = 800;
  const height = 450;
  const pivot = { x: width / 2, y: 250 };
  const beamLengthPx = 600; // full length in pixels
  const halfBeam = beamLengthPx / 2;
  const beamThickness = 16;
  const g = 9.81; // m/s^2
  const pxPerMeter = 100; // scale for torque calculations
  const maxAngle = (10 * Math.PI) / 180; // ±10° visual cap
  const torqueToAngle = 0.015; // mapping factor N·m -> radians (tuned for feel)
  const balanceToleranceNm = 0.6; // within this net torque = considered balanced

  // Game state
  const [masses, setMasses] = useState([]); // { id, massKg, sPx }
  const [fixedMass, setFixedMass] = useState(null); // optional challenge mass (non-draggable)
  const [selectedMassKg, setSelectedMassKg] = useState(2);
  const [message, setMessage] = useState("Add or drag masses to balance the beam.");
  const [score, setScore] = useState(0);
  const [angle, setAngle] = useState(0); // current visual angle
  const [dragId, setDragId] = useState(null);
  const [isHoveringBeam, setIsHoveringBeam] = useState(false);

  // Utility: compute unit axis of beam based on current angle
  const axis = () => ({ x: Math.cos(angle), y: Math.sin(angle) });

  // Compute net torque about the pivot (positive: CCW)
  const netTorqueNm = () => {
    const all = [...masses, fixedMass].filter(Boolean);
    let tau = 0;
    for (const m of all) {
      // m.sPx is position along the beam axis, positive to the right of pivot
      const momentArmMeters = (m.sPx / pxPerMeter);
      tau += m.massKg * g * momentArmMeters; // downward force * horizontal lever arm
    }
    return tau; // N·m (since lever arm is horizontal component by construction)
  };

  // Project a screen point onto the beam axis to get sPx (clamped to beam length)
  const screenPointToBeamS = (x, y) => {
    const ax = Math.cos(angle);
    const ay = Math.sin(angle);
    const dx = x - pivot.x;
    const dy = y - pivot.y;
    const s = dx * ax + dy * ay; // projection length along beam
    return Math.max(-halfBeam + 20, Math.min(halfBeam - 20, s)); // keep within beam (padding)
  };

  // Determine if pointer is near the beam (for cursor hints)
  const isNearBeam = (x, y) => {
    // distance from point to the infinite beam line, then require |s| <= halfBeam
    const ax = Math.cos(angle);
    const ay = Math.sin(angle);
    const dx = x - pivot.x;
    const dy = y - pivot.y;
    const s = dx * ax + dy * ay;
    const t = -dx * ay + dy * ax; // perpendicular distance (signed)
    const within = Math.abs(s) <= halfBeam;
    const near = Math.abs(t) <= 18; // within ~18px of the beam centerline
    return within && near;
  };

  // Render loop
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      // Background grid (subtle)
      ctx.save();
      ctx.fillStyle = "#0b0f1a"; // dark bg
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "#9aa4b21f";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.restore();

      // Ground / base
      ctx.save();
      ctx.fillStyle = "#101826";
      ctx.fillRect(0, pivot.y + 80, width, height - (pivot.y + 80));
      ctx.restore();

      // Draw pivot stand
      ctx.save();
      ctx.translate(pivot.x, pivot.y);
      // stand
      ctx.fillStyle = "#1f2a44";
      ctx.fillRect(-18, 0, 36, 90);
      // pivot circle
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#6aa9ff";
      ctx.shadowColor = "#6aa9ff";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();

      // Draw beam (rotated)
      ctx.save();
      ctx.translate(pivot.x, pivot.y);
      ctx.rotate(angle);
      const beamRadius = beamThickness / 2;
      ctx.fillStyle = "#23324f";
      ctx.strokeStyle = "#4e6fae";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-halfBeam, -beamRadius, beamLengthPx, beamThickness, 8);
      ctx.fill();
      ctx.stroke();

      // Draw tick marks every 50px
      ctx.strokeStyle = "#7c90c7";
      ctx.lineWidth = 1;
      for (let s = -halfBeam; s <= halfBeam; s += 50) {
        ctx.beginPath();
        ctx.moveTo(s, -beamRadius);
        ctx.lineTo(s, -beamRadius - 8);
        ctx.stroke();
      }

      // Draw masses on top of beam
      const drawMass = (m, draggable) => {
        const R = 12 + Math.min(24, m.massKg * 4); // radius based on mass
        const ax = Math.cos(0); // local beam axis (x-direction in rotated frame)
        const ay = Math.sin(0);
        const localX = m.sPx; // along beam
        const localY = -beamRadius - R; // sit on top of beam
        // draw
        ctx.save();
        ctx.translate(localX, localY);
        // disk
        ctx.beginPath();
        ctx.arc(0, 0, R, 0, Math.PI * 2);
        ctx.fillStyle = draggable ? "#9ad1ff" : "#ffd39a";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        // label
        ctx.fillStyle = "#0b0f1a";
        ctx.font = "bold 12px Inter, system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${m.massKg} kg`, 0, 0);
        ctx.restore();
      };

      // masses (draggable)
      masses.forEach((m) => drawMass(m, true));
      // fixed challenge mass (non-draggable)
      if (fixedMass) drawMass(fixedMass, false);

      ctx.restore();

      /* UI overlay: current net torque and angle
      const tau = netTorqueNm();
      ctx.save();
      ctx.fillStyle = "#d7e3ff";
      ctx.font = "600 14px Inter, system-ui, sans-serif";
      ctx.fillText(`Net Torque: ${tau.toFixed(2)} N·m`, 20, 28);
      ctx.fillText(`Angle: ${(angle * 180 / Math.PI).toFixed(2)}°`, 20, 48);
      ctx.fillText(`Score: ${score}`, 20, 68);
      ctx.restore();
      `*/
    };

    const loop = () => {
      // Smoothly update angle from torque
      const tau = netTorqueNm();
      const targetAngle = Math.max(-maxAngle, Math.min(maxAngle, tau * torqueToAngle));
      // simple critically-damped interpolation
      const k = 0.15; // stiffness toward target
      const newAngle = angle + (targetAngle - angle) * k;
      setAngle(newAngle);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angle, masses, fixedMass, score]);

  // Balance detection & scoring
  useEffect(() => {
    const tau = netTorqueNm();
    if (Math.abs(tau) <= balanceToleranceNm) {
      setMessage("Balanced! Nice work!");
      // Increment score only when newly balanced (avoid spamming)
      setScore((prev) => prev);
    } else {
      setMessage("Add or drag masses to balance the beam.");
    }
  }, [masses, fixedMass]);

  // Score increment when user crosses into tolerance from out-of-tolerance
  const prevInTol = useRef(false);
  useEffect(() => {
    const inTol = Math.abs(netTorqueNm()) <= balanceToleranceNm;
    if (inTol && !prevInTol.current) {
      setScore((s) => s + 1);
    }
    prevInTol.current = inTol;
  }, [masses, fixedMass, angle]);

  // Pointer handlers (drag & add)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX ?? (e.touches?.[0]?.clientX || 0)) - rect.left;
      const y = (e.clientY ?? (e.touches?.[0]?.clientY || 0)) - rect.top;
      return { x, y };
    };

    const pickMassAt = (x, y) => {
      // find closest mass center within radius
      const ax = Math.cos(angle), ay = Math.sin(angle);
      const toWorld = (sPx, r=0) => {
        const wx = pivot.x + ax * sPx - ay * 0;
        const wy = pivot.y + ay * sPx + ax * 0;
        const beamRadius = beamThickness / 2;
        const R = 12 + Math.min(24, r * 4);
        const cx = wx + (-ay) * (beamRadius + (12 + Math.min(24, r * 4)));
        const cy = wy + (ax) * (beamRadius + (12 + Math.min(24, r * 4)));
        return { x: cx, y: cy, R: R };
      };
      // check draggable masses first
      for (let i = masses.length - 1; i >= 0; i--) {
        const m = masses[i];
        const p = toWorld(m.sPx, m.massKg);
        const dist = Math.hypot(x - p.x, y - p.y);
        if (dist <= p.R + 6) return m.id;
      }
      return null;
    };

    const onMove = (e) => {
      const { x, y } = getPos(e);
      setIsHoveringBeam(isNearBeam(x, y));
      if (dragId !== null) {
        e.preventDefault();
        const sPx = screenPointToBeamS(x, y);
        setMasses((arr) => arr.map((m) => (m.id === dragId ? { ...m, sPx } : m)));
      }
    };

    const onDown = (e) => {
      const { x, y } = getPos(e);
      const id = pickMassAt(x, y);
      if (id !== null) {
        setDragId(id);
        return;
      }
      // If not on a mass and cursor is near the beam, add a new mass at that s
      if (isNearBeam(x, y)) {
        const sPx = screenPointToBeamS(x, y);
        setMasses((arr) => [
          ...arr,
          { id: Date.now(), massKg: selectedMassKg, sPx },
        ]);
      }
    };

    const onUp = () => setDragId(null);

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [angle, selectedMassKg, dragId, masses]);

  const resetBoard = () => {
    setMasses([]);
    setFixedMass(null);
    setScore(0);
    setMessage("Add or drag masses to balance the beam.");
  };

  const newChallenge = () => {
    // Spawn a fixed mass at random side; user must balance with draggable masses
    const side = Math.random() < 0.5 ? -1 : 1;
    const sPx = side * (Math.random() * (halfBeam - 120) + 80);
    const massKg = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    setFixedMass({ id: -1, massKg, sPx });
    setMasses([]);
    setScore(0);
    setMessage("Challenge: Balance the fixed mass using 1/2/5 kg weights.");
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 text-slate-200">
      <motion.h2
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold tracking-tight"
      >
        Balance Beam Game
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2">
          <span className="text-sm text-slate-300">Mass:</span>
          {[1, 2, 5].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMassKg(m)}
              className={`px-3 py-1 rounded-lg text-sm border transition active:scale-[0.98] ${
                selectedMassKg === m
                  ? "bg-sky-500/20 border-sky-400 text-sky-200"
                  : "bg-slate-900/40 border-slate-600 hover:border-slate-400"
              }`}
            >
              {m} kg
            </button>
          ))}
        </div>

        <button
          onClick={newChallenge}
          className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 hover:bg-emerald-500/25"
        >
          New Challenge
        </button>
        <button
          onClick={resetBoard}
          className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-400 text-rose-200 hover:bg-rose-500/25"
        >
          Reset
        </button>
      </motion.div>

      <div className="text-sm text-slate-300">{message}</div>

      <div
        className={`rounded-2xl p-2 border ${
          isHoveringBeam ? "border-sky-400/70" : "border-slate-700"
        } bg-slate-900/60 shadow-inner`}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded-xl select-none touch-none cursor-crosshair"
          style={{ outline: "none" }}
        />
      </div>

      <p className="text-xs text-slate-400">
        Tip: Click near the beam to drop a mass. Drag masses along the beam to adjust torque.
      </p>
    </div>
  );
}
